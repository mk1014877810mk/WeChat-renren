// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxUrl: '',
    scale: 1,
    template: 5,
    e_id: 1,
    title: '', // 展馆名称
    logoSrc: '',
    loadingHeight: 60,
    listHeight: 0,
    iconSrc: {
      first: '../../images/icon-index1.png',
      second: '../../images/icon-scan.png',
      third: '../../images/icon-map.png'
    },
    swiper: {
      imgUrls: [],
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 700,
      indicatorActivColor: "#fff",
      indicatorColor: "#aaa",
      circular: true,
    },
    tab: {
      height: 600,
      currentTab: 0,
      z_idList: [], // 所有展厅id集合
      tabTitle: [],
      contents: [], // 模板1、2、3列表数据
      sendAjaxList: [],
      hallList: [], // 模板4、5、6列表数据
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var sence = decodeURIComponent(options.q);
    var exist = sence.indexOf('i_id');
    var oParams = {};
    var e_id, i_id;
    console.log('options:', options, 'sence:', sence, 'exist:', exist);
    if (exist != -1) { // 扫码进入
      var aParams = sence.split('?').slice(-1)[0].split('&');
      aParams.forEach(function(el) {
        oParams[el.split('=')[0]] = el.split('=')[1];
      });
      e_id = oParams.e_id;

      // 跳转
      wx.navigateTo({
        url: '../listDetail/listDetail?i_id=' + oParams.i_id,
      });

    } else { // 点击进入
      e_id = options.e_id;
    }
    that.setData({
      ajaxUrl: app.globalData.server,
      scale: wx.getSystemInfoSync().windowWidth / 750,
      e_id: e_id
    });

    wx.showLoading({
      title: '加载中...',
    });

    // 通过e_id获取展馆相关信息
    that.getHallInfo(that.data.e_id, function() {

      that.getSwiper();

      // 获取页面刚加载数据
      that.getExhibitionList(function(z_idList) {
        var contentList = [];
        var sendAjax = [];
        z_idList.forEach(function(el, index) {
          sendAjax.push(true);
          contentList.push([]);
        });
        if (that.data.template > 3) {
          wx.hideLoading();
          return;
        }
        that.getInteractive(z_idList[0], '', 1, function(data) {
          contentList[0] = data.data || [];
          that.setData({
            'tab.contents': contentList,
            'tab.sendAjaxList': sendAjax
          });
          // 设置高度
          var obj = {
            length: that.data.tab.contents[that.data.tab.currentTab].length
          };
          that.setHeight(obj);
          wx.hideLoading();
        });
      });
    });

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
            template: 1 * res.data.data.template || 1,
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

  getSwiper: function() {
    var that = this;
    if (that.data.template < 4) { // 123轮播
      wx.request({
        url: that.data.ajaxUrl + 'applets/item-banner',
        method: 'get',
        data: {
          e_id: that.data.e_id
        },
        success: function(res) {
          // console.log('123模板轮播图列表', res);
          if (res.statusCode == 200 && res.data.status == 1000) {
            that.setData({
              'swiper.imgUrls': res.data.data.length <= 5 ? res.data.data : res.data.data.slice(0, 5)
            });
          }
        },
        fail: function(err) {
          console.log('轮播图获取失败', err);
        }
      })
    } else { // 456轮播
      wx.request({
        url: that.data.ajaxUrl + 'applets/hall-banner',
        method: 'get',
        data: {
          e_id: that.data.e_id
        },
        success: function(res) {
          // console.log('456模板轮播图列表', res);
          if (res.statusCode == 200 && res.data.status == 1000) {
            that.setData({
              'swiper.imgUrls': res.data.data.length <= 5 ? res.data.data : res.data.data.slice(0, 5)
            });
          }
        },
        fail: function(err) {
          console.log('展厅轮播图获取失败', err);
        }
      })
    }
  },

  // 获取展厅列表
  getExhibitionList: function(callback) {
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
          var exList = [];
          var z_idList = [];
          // 判断展厅与模板是否匹配
          if (res.data.data.length > 4 && that.data.template < 4) { // 展厅数量大于四，模板小于四
            that.setData({
              template: Number(that.data.template) + 3
            });
          } else if (res.data.data.length <= 4 && that.data.template >= 4) { // 展厅数量小于四，模板大于四
            that.setData({
              template: Number(that.data.template) - 3
            });
          }
          res.data.data.forEach(function(el, index) {
            var obj = {};
            obj.img = that.data.ajaxUrl + el.hall_cover;
            obj.des = el.hall_summary;
            obj.z_id = el.z_id;
            obj.title = el.hall_name;
            z_idList.push(el.z_id);
            exList.push(obj);
          });
          if (that.data.template < 4) { // 模板1、2、3
            that.setData({
              'tab.tabTitle': exList,
              'tab.z_idList': z_idList
            });
          } else { // 模板4、5、6
            that.setData({
              'tab.hallList': exList
            });
            wx.setStorageSync('lastHallZid', res.data.data[0].z_id);
            that.setAnotherHeight();
          }
          callback && callback(z_idList); // 获取所有展项
        } else if (res.statusCode == 200 && res.data.status == 1006) {
          wx.setStorageSync('lastHallZid', '');
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '当前展馆无数据',
            duration: 2000
          });
        }
      },
      fail: function(err) {
        console.log('展厅列表获取失败', err);
      }
    })
  },

  // 获取展项列表
  getInteractive: function(z_id, i_id, page, callback) {
    var that = this;
    wx.request({
      url: that.data.ajaxUrl + 'applets/items',
      method: 'get',
      data: {
        z_id: z_id,
        page: page,
        i_id: i_id
      },
      success: function(res) {
        // console.log('展项列表', res);
        if (res.statusCode == 200 && res.data.status == 1000) {
          app.globalData.lastHallZid = z_id;
          wx.setStorageSync('lastHallZid', z_id);
          res.data.data.forEach(function(el, index) {
            el.hall_cover = that.data.ajaxUrl + el.hall_cover;
            el.loadText = '努力加载中...';
            el.page = page;
            el.count = res.data.count;
          });
          callback && callback(res.data);
        } else if (res.statusCode == 200 && res.data.status == 1006) {
          app.globalData.lastHallZid = z_id;
          wx.setStorageSync('lastHallZid', z_id);
          callback && callback([]);
        }
      },
      fail: function(err) {
        console.log('展项列表获取失败', err);
      }
    })
  },

  bindChange: function(e) {
    var index = e.detail.current,
      that = this,
      height;
    wx.setStorageSync('lastHallZid', that.data.tab.tabTitle[index].z_id);
    that.setData({
      'tab.currentTab': index
    });
    if (that.data.tab.contents[index].length == 0) { // 当前数据列表无数据
      wx.showLoading({
        title: '加载中...',
      });
      that.getInteractive(that.data.tab.z_idList[index], '', 1, function(data) {
        if (data.status == 1000) {
          var tempContent = that.data.tab.contents;
          tempContent[index] = data.data;
          that.setData({
            'tab.contents': tempContent
          });
          var obj = {
            length: that.data.tab.contents[that.data.tab.currentTab].length
          };
          that.setHeight(obj);
        } else if (data.length == 0) {
          var obj = {
            length: that.data.tab.contents[that.data.tab.currentTab].length
          };
          that.setHeight(obj);
        }
        wx.hideLoading();
      });
    } else { // 数据列表有数据
      var obj = {
        length: that.data.tab.contents[that.data.tab.currentTab].length
      };
      that.setHeight(obj);
    }
  },

  changeBigTab: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      'tab.currentTab': index
    });
  },

  goAnother: function(e) {
    console.log(e)
    var that = this;
    if (e.currentTarget.dataset.index == 0) {
      // 展馆
      var e_id = e.currentTarget.dataset.e_id;
      wx.navigateTo({
        url: '../listDetail/listDetail?title=' + encodeURI(that.data.title) + '&e_id=' + e_id,
      });
    } else {
      // 展厅或展项
      var id = e.currentTarget.dataset.i_id;
      if (id == 242) { // 抽奖
        var user_id = wx.getStorageSync('user_id');
        wx.navigateTo({
          url: '../listDetail/listDetail?user_id=' + user_id
        });
      } else {
        wx.navigateTo({
          url: '../listDetail/listDetail?title=' + encodeURI(that.data.title) + '&i_id=' + id,
        });
      }

    }
  },

  goHallList: function(e) {
    var that = this;
    var z_id = e.currentTarget.dataset.z_id;
    wx.navigateTo({
      url: '../hallList/hallList?title=' + encodeURI(that.data.title) + '&z_id=' + z_id,
    });
  },
  /**
   *设置tab轮播图的高度
   * params:length:数据总条数
   */
  setHeight: function(obj) {
    var that = this;
    var detailH = 0;
    var minHeight = wx.getSystemInfoSync().windowHeight / that.data.scale - 652;
    var query = wx.createSelectorQuery();
    switch (that.data.template) {
      case 1:
        // detailH = 177;
        query.select('.template1').boundingClientRect();
        query.exec((res) => {
          console.log('setHeight1:', res);
          // 获取detail高度
          var detailH = res && res[0] && res[0].height ? res[0].height / that.data.scale : 177;
          console.log('detailH:', detailH);
          that.setData({
            'tab.height': Math.max(minHeight, obj.length < 10 ? detailH * obj.length + that.data.loadingHeight - 50 : detailH * obj.length + that.data.loadingHeight)
          });
        });
        break;
      case 2:
        // detailH = 419;
        query.select('.template2').boundingClientRect();
        query.exec((res) => {
          console.log('setHeight2:', res);
          // 获取detail高度
          var detailH = res && res[0] && res[0].height ? res[0].height / that.data.scale + 20 : 419;
          console.log('detailH:', detailH);
          that.setData({
            'tab.height': Math.max(minHeight, obj.length < 10 ? detailH * Math.ceil(obj.length / 2) + that.data.loadingHeight - 30 : detailH * Math.ceil(obj.length / 2) + that.data.loadingHeight - 10)
          });
        });
        break;
      case 3:
        // detailH = 577;
        query.select('.template3').boundingClientRect();
        query.exec((res) => {
          console.log('setHeight3:', res);
          // 获取detail高度
          var detailH = res && res[0] && res[0].height ? res[0].height / that.data.scale + 20 : 577;
          console.log('detailH:', detailH);
          // console.log(detailH);
          that.setData({
            'tab.height': Math.max(minHeight, obj.length < 10 ? detailH * obj.length + that.data.loadingHeight - 50 : detailH * obj.length + that.data.loadingHeight - 20)
          });
        });
        break;
    }
  },

  // 设置模板4、5、6背景的最小高度
  setAnotherHeight: function() {
    var that = this;
    that.setData({
      listHeight: wx.getSystemInfoSync().windowHeight / that.data.scale - 100 - 450 - 20
    });
  },

  // nav导航跳转
  navJump: function(e) {
    var that = this;
    app.navJump(e, that.data.title, that.data.e_id, that.data.logoSrc);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    app.setNavTitle(that.data.title);
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
    app.globalData.lastHallZid = '';
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
    var that = this;
    if (that.data.template > 3) return;
    var currentTab = that.data.tab.currentTab;

    if (!that.data.tab.sendAjaxList[currentTab]) return;

    var z_id = that.data.tab.z_idList[currentTab];
    var page = 1 + Number(that.data.tab.contents[currentTab].slice(-1)[0].page);
    // console.log(z_id, page);
    that.getInteractive(z_id, that.data.tab.contents[currentTab].slice(-1)[0].z_id, page, function(data) {
      if (data.length == 0) { // 查询数据为空
        var sendAjaxList = that.data.tab.sendAjaxList;
        sendAjaxList[currentTab] = false;
        var contents = that.data.tab.contents;
        contents[currentTab][0].loadText = '没有更多数据了';
        that.setData({
          'tab.sendAjaxList': sendAjaxList,
          'tab.contents': contents
        });
      } else { // 查询有数据
        var contents = that.data.tab.contents;
        var count = data.count;
        contents[currentTab] = contents[currentTab].concat(data.data);

        if (contents[currentTab].length >= count) {
          var sendAjaxList = that.data.tab.sendAjaxList;
          sendAjaxList[currentTab] = false;
          contents[currentTab][0].loadText = '没有更多数据了';
          that.setData({
            'tab.sendAjaxList': sendAjaxList
          });
        }
        that.setData({
          'tab.contents': contents
        });
        var obj = {
          length: that.data.tab.contents[currentTab].length
        };
        that.setHeight(obj);
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})