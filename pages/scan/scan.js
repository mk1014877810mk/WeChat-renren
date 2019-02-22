// pages/scan/scan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxUrl: '',
    e_id: 1,
    code: '',
    title: '',
    logoSrc: '',
    iconSrc: {
      first: '../../images/icon-index.png',
      second: '../../images/icon-scan1.png',
      third: '../../images/icon-map.png'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ajaxUrl: app.globalData.server,
      title: options.title,
      logoSrc: options.logoSrc,
      e_id: options.e_id
    });
    app.setNavTitle(decodeURI(options.title));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  goScanImg: function() {
    var that = this;
    wx.scanCode({
      success: function(res) {
        console.log('二维码数据：', res)
        that.setData({
          code: res.result
        });
        // 判断二维码的合法性及是否在当前展馆下扫描其他展馆中的展项
        var oParams = {};
        var aParams = [];
        if (res.result && Array.isArray(res.result.split('?'))) {
          aParams = res.result.split('?').slice(-1)[0].split('&');
          aParams.forEach(function(el) {
            oParams[el.split('=')[0]] = el.split('=')[1];
          });
          if (!oParams.e_id) {
            wx.showModal({
              title: '温馨提示',
              content: '当前二维码不属于此小程序!',
              showCancel: false
            });
            return;
          }
          wx.navigateTo({
            url: '../listDetail/listDetail?i_id=' + oParams.i_id + '&title=' + that.data.title,
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '当前二维码不属于此小程序!',
            showCancel: false
          });
        }
      }
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