// pages/map/map.js
const app = getApp();
const pointerW = 46; // 当前地图点图标宽度
const pointerH = 46; // 当前地图点图标高度
const bmsW = 20; // 后台地图点图标宽度
const bmsH = 20; // 后台地图点图标高度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    ajaxUrl: '',
    e_id: 1,
    title: '',
    windowWidth: 0,
    windowHeight: 0,
    scale: 1, //px与rpx之间的转换系数
    logoSrc: '',
    z_id: '',
    showPointer: true, // 是否显示地图上展项坐标点
    showList: false, // 是否展示展厅地图列表
    currentIndex: 0, // 当前所点击图标的索引
    currentTitle: '',
    iconSrc: {
      first: '../../images/icon-index.png',
      second: '../../images/icon-scan.png',
      third: '../../images/icon-map1.png'
    },
    map: {
      initScale: 1, // 地图初始化放大比例
      scale: 1, // 手指双滑放大的倍数
      height: 0,
    },
    img: {
      width: 0,
      height: 0,
      src: '',
      scale: 1, // 地图加载放大倍数
      x: 0,
      y: 0
    },
    pointer: {
      width: pointerW,
      height: pointerH,
      position: [] // 绑定的坐标集合
    },
    originPointer: {}, // 原始坐标点数据备份 
    hallList: [], // 展厅地图列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var scale = wx.getSystemInfoSync().windowWidth / 750;
    this.setData({
      ajaxUrl: app.globalData.server,
      scale: scale,
      'map.height': wx.getSystemInfoSync().windowHeight - 100 * scale,
      windowHeight: wx.getSystemInfoSync().windowHeight - 100 * scale,
      windowWidth: wx.getSystemInfoSync().windowWidth,
    });

    var sence = decodeURIComponent(options.q);
    // sence = 'https://renren.broadmesse.net/map?e_id=6&z_id=167';
    var exist = sence.indexOf('z_id');
    var oParams = {};
    var e_id, z_id;
    // console.log('options-map:', options, 'sence-map:', sence, 'exist-map:', exist);
    if (exist == -1) { // 点击进入
      this.setData({
        e_id: options.e_id,
        z_id: wx.getStorageSync('lastHallZid'),
        title: options.title,
        logoSrc: options.logoSrc,
      });
      if (!this.data.z_id) {
        wx.showToast({
          title: '无数据！',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      wx.showLoading({
        title: '加载中...',
      });
      app.setNavTitle(decodeURI(options.title));
      this.getMap(this.data.z_id);

    } else { // 扫码进入

      var that = this;
      var aParams = sence.split('?').slice(-1)[0].split('&');
      aParams.forEach(function(el) {
        oParams[el.split('=')[0]] = el.split('=')[1];
      });
      this.setData({
        e_id: oParams.e_id,
        z_id: oParams.z_id
      })
      wx.showLoading({
        title: '加载中...',
      });
      this.getHallInfo(that.data.e_id, function() {
        that.getMap(that.data.z_id);
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getHallInfo: function(e_id, callback) {
    var that = this;
    wx.request({
      url: that.data.ajaxUrl + 'applets/info',
      method: 'get',
      data: {
        e_id: e_id
      },
      success: function(res) {
        // console.log('展馆基本信息', res);
        if (res.statusCode == 200 && res.data.status == 1000) {
          that.setData({
            title: res.data.data.hall_name,
            logoSrc: res.data.data.hall_logo
          });
          app.setNavTitle(res.data.data.hall_name);
          callback && callback();
        }
      },
      fail: function(err) {
        console.log('展馆基本信息获取失败', err);
      }
    })
  },

  getMap: function(z_id) {
    var that = this;
    wx.request({
      url: that.data.ajaxUrl + 'applets/map',
      method: 'get',
      data: {
        z_id: z_id,
        e_id: that.data.e_id
      },
      success: function(res) {
        // console.log('地图数据', res);
        if (res.statusCode == 200 && res.data.status == 1000) {
          if (res.data.data.hall_map == '' || !res.data.data.hall_map) {
            wx.hideLoading();
            setTimeout(function() {
              wx.showToast({
                icon: 'none',
                title: '无对应地图,请选择其它地图',
                duration: 2000
              });
            }, 300);
            return;
          }
          res.data.data.items_position.forEach(function(el, index) {
            el.showPic = false;
          });
          that.setData({
            'img.src': that.data.ajaxUrl + res.data.data.hall_map,
            'pointer.position': res.data.data.items_position || [],
            'currentTitle': res.data.data.hall_name
          });
        }
      },
      fail: function(err) {
        console.log('地图数据获取失败', err);
      }
    });
  },

  // 加载图片,并设置图片初始化缩放比例
  imgLoad: function(e) {
    var that = this,
      width = e.detail.width,
      height = e.detail.height,
      tempX = that.data.windowWidth / width,
      tempY = that.data.windowHeight / height;
    if (tempX <= tempY) { // 纵向缩放
      that.setData({
        'img.scale': tempY
      });
    } else { // 横向缩放
      that.setData({
        'img.scale': tempX
      });
    }
    that.setData({
      'img.width': width * that.data.img.scale,
      'img.height': height * that.data.img.scale
    });

    // 位置赋值计算
    var items_position = that.data.pointer.position;

    items_position.forEach(function(el, index) {
      el.x = ((el.hall_position.split(',')[0] * 1 + bmsW / 2) / that.data.scale) * that.data.img.scale - pointerW / 2.4;
      el.y = ((el.hall_position.split(',')[1] * 1 + bmsH / 2) / that.data.scale) * that.data.img.scale - pointerH / 1.4;
      el.top = el.y > 140;
      el.index = index;
    });
    that.setData({
      showPointer: true,
      'pointer.position': items_position
    });

    var originPointer = {};
    for (var key in that.data.pointer) {
      if (typeof(that.data.pointer[key]) == 'object' && Array.isArray(that.data.pointer[key])) {
        var position = [];
        that.data.pointer[key].forEach(function(el, index) {
          if (typeof(el) == 'object') {
            var obj = {};
            for (var k in el) {
              obj[k] = el[k];
            }
          }
          position.push(obj);
        });
        originPointer[key] = position;
      } else {
        originPointer[key] = that.data.pointer[key];
      }
    }
    that.setData({
      originPointer: originPointer,
      'img.x': -1 * (that.data.img.width - wx.getSystemInfoSync().windowWidth) / 2,
      'img.y': -1 * (that.data.img.height - that.data.map.height) / 2
    });
    wx.hideLoading();
  },

  bindscale: function(e) {
    var that = this;
    var scale = e.detail.scale;
    var pointer = {};
    for (var key in that.data.originPointer) {
      if (typeof(that.data.originPointer[key]) == 'object' && Array.isArray(that.data.originPointer[key])) {
        var position = [];
        that.data.originPointer[key].forEach(function(el, index) {
          if (typeof(el) == 'object') {
            var obj = {};
            for (var k in el) {
              if (k == 'x') {
                obj[k] = el[k] + (scale - 1) * pointerW / 8;
              } else if (k == 'y') {
                obj[k] = el[k] + (scale - 1) * pointerH / 6;
              } else {
                obj[k] = el[k];
              }
            }
          }
          position.push(obj);
        });
        pointer[key] = position;
      } else {
        pointer[key] = that.data.originPointer[key];
      }
    }
    pointer.width /= scale;
    pointer.height /= scale;
    that.setData({
      'map.scale': scale,
      pointer: pointer
    });
  },

  showPic: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.imgTab();
    var position = that.data.pointer.position;
    var originPosition = that.data.originPointer.position;
    position.forEach(function(el, i) {
      if (index == i) {
        el.showPic = originPosition[i].showPic = !position[index].showPic;
      } else {
        el.showPic = originPosition[i].showPic = false;
      }
    });
    that.setData({
      currentIndex: index,
      'pointer.position': position,
      'originPointer.position': originPosition
    });
  },

  // 展示隐藏展厅地图列表
  showOrHideList: function() {
    if (this.data.hallList.length == 0) this.getHallList();
    this.setData({
      showList: !this.data.showList
    });
  },
  // 获取展厅列表及地图
  getHallList: function() {
    var that = this;
    wx.request({
      url: that.data.ajaxUrl + 'applets/hall',
      method: 'get',
      data: {
        e_id: that.data.e_id
      },
      success: function(res) {
        // console.log('展厅列表', res);
        if (res.statusCode == 200 && res.data.status == 1000) {
          if (that.data.z_id == '') {
            that.setData({
              z_id: res.data.data[0].z_id
            });
          }
          that.setData({
            hallList: res.data.data
          });
        }
      },
      fail: function(err) {
        console.log('展厅列表获取失败', err)
      }
    });
  },

  checkHall: function(e) {
    var that = this;
    var z_id = e.currentTarget.dataset.z_id;
    if (that.data.z_id == z_id) return;
    if (!e.currentTarget.dataset.hasmap) {
      wx.showToast({
        icon: 'none',
        title: '当前展厅暂无地图',
      });
      return;
    }
    that.setData({
      showPointer: false,
      'map.initScale': 1,
      'img.src': '',
      'pointer.position': [],
      z_id: z_id,
      showList: false
    });
    wx.showLoading({
      title: '地图切换中...',
    });
    setTimeout(function() {
      that.getMap(z_id);
    }, 1500);
  },

  imgTab: function(e) {
    if (this.data.showList) {
      this.setData({
        showList: false
      });
    }
  },

  goListDetail: function(e) {
    wx.navigateTo({
      url: '../listDetail/listDetail?i_id=' + e.currentTarget.dataset.i_id + '&title=' + this.data.title,
    });
  },

  // nav跳转
  navJump: function(e) {
    var that = this;
    app.navJump(e, that.data.title, that.data.e_id, that.data.logoSrc);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})