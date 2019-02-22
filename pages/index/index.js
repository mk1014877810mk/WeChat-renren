// pages/index/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxUrl: '',
    page: 1,
    sendAjax: true,
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
    exhibition: {
      firstData: [], // 模板1
      secondData: [], // 模板2
      thirdData: [] // 模板3
    },
    template: {
      first: true,
      second: true,
      third: true
    },
    tips: false,
    loadText: '努力加载中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ajaxUrl: app.globalData.server
    });
    wx.showLoading({
      title: '加载中...',
    });
    this.getExhibitionList(this.data.page);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  goHome: function(e) {
    var e_id = e.currentTarget.dataset.e_id;
    wx.navigateTo({
      url: '../home/home?e_id=' + e_id
    });
  },

  getExhibitionList: function(page) {
    var that = this;
    wx.request({
      url: that.data.ajaxUrl + 'applets',
      method: 'get',
      data: {
        page: page
      },
      success: function(res) {
        // console.log('展馆列表', res);
        if (res.statusCode == 200 && res.data.status == 1000) {

          var data = res.data.data;
          if (page == 1) {
            // 设置轮播图图片
            that.setData({
              'swiper.imgUrls': data.length > 6 ? data.slice(0, 5) : data
            });

            // 设置模板数据
            // 模板1
            if (data.length >= 1) {
              that.setData({
                'exhibition.firstData': data.slice(0, 1)
              });
            } else {
              that.setData({
                'template.first': false,
                'template.second': false,
                'template.third': false
              });
              return;
            }
            // 模板2、3
            if (data.length > 1 && data.length <= 5) {
              that.setData({
                'exhibition.secondData': data.slice(1),
                'template.third': false
              });
            } else if (data.length > 5) {
              that.setData({
                'exhibition.secondData': data.slice(1, 5),
                'exhibition.thirdData': data.slice(5)
              });
            } else {
              that.setData({
                'template.second': false,
                'template.third': false
              });
            }
          } else {
            that.setData({
              'exhibition.thirdData': that.data.exhibition.thirdData.concat(data),
            });
          }
          var allLength = that.data.exhibition.firstData.length + that.data.exhibition.secondData.length + that.data.exhibition.thirdData.length;
          if (res.data.count == allLength) {
            that.setData({
              loadText: '没有更多数据了',
              sendAjax: false
            });
          }
        }
      },
      complete: function() {
        wx.hideLoading();
      },
      fail: function(err) {
        console.log('展馆列表获取失败', err);
      }
    })
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
    var that = this;
    if (!that.data.sendAjax) return;
    that.setData({
      page: ++that.data.page
    });
    that.getExhibitionList(that.data.page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})