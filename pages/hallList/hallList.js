// pages/hallList/hallList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxUrl: '',
    z_id: '',
    title: '',
    currentPage: 1,
    sendAjax: true,
    loadText: '努力加载中...',
    contentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ajaxUrl: app.globalData.server,
      z_id: options.z_id,
      title: options.title
    });

    wx.showLoading({
      title: '加载中...',
    });

    if (options.title) {
      app.setNavTitle(decodeURI(options.title));
    }
    this.getInteractive(this.data.z_id, '', this.data.currentPage);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 获取展项列表
  getInteractive: function(z_id, i_id, page) {
    var that = this;
    wx.request({
      url: that.data.ajaxUrl + 'applets/items',
      method: 'get',
      data: {
        z_id: z_id,
        i_id: i_id,
        page: page
      },
      success: function(res) {
        // console.log('展项列表', res);
        if (res.statusCode == 200 && res.data.status == 1000) {
          res.data.data.forEach(function(el) {
            el.hall_cover = that.data.ajaxUrl + el.hall_cover
          });
          that.setData({
            contentList: that.data.contentList.concat(res.data.data)
          });
          if (that.data.contentList.length >= res.data.count) {
            that.setData({
              loadText: '没有更多数据了',
              sendAjax: false
            });
          }
        } else if (res.statusCode == 200 && res.data.status == 1006) {
          that.setData({
            loadText: page == 1 ? '暂无数据' : '没有更多数据了',
            sendAjax: false
          });
        }
        wx.hideLoading();
      },
      fail: function(err) {
        console.log('展项列表获取失败', err);
      }
    });
  },

  goDetail: function(e) {
    var that = this;
    var i_id = e.currentTarget.dataset.i_id;
    wx.navigateTo({
      url: '../listDetail/listDetail?title=' + that.data.title + '&i_id=' + i_id,
    });
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
      currentPage: ++that.data.currentPage
    });
    that.getInteractive(that.data.z_id, that.data.contentList.slice(-1)[0].z_id, that.data.currentPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})