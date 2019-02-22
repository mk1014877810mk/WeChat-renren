// pages/listDetail/listDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxUrl: '',
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var str = '';
    if (options.user_id) { // 抽奖
      str = 'https://renren.broadmesse.net/vote/index.html?user_id=' + options.user_id;
    } else if (options.e_id) { // 通往展馆详情
      str = 'https://renren.broadmesse.net/wechat-kanzhan/index.html?e_id=' + options.e_id;
    } else {
      str = 'https://renren.broadmesse.net/wechat-kanzhan/index.html?i_id=' + options.i_id
    }
    this.setData({
      ajaxUrl: app.globalData.server,
      src: str
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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