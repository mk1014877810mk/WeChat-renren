// pages/map/map.js
const app = getApp();
const ajaxUrl = app.globalData.server;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    windowHeight: 0,
    map: {
      scale: 1,
      height: 0
    },
    img: {
      width: 0,
      height: 0,
      // src: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2249893882,1165836821&fm=27&gp=0.jpg',
      src: 'https://dl.broadmesse.net/librarySide/frontend/web//uploads/items/0.jpg',
      scale: 1
    },
    touch: { // 双滑
      distance: 0,
      scale: 1,
      newScale: 1, // 双滑之后的缩放比
      originWidth: 0,
      originHeight: 0,
      originProInfoList: [], // 未放大缩小时的展项数据
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var scale = wx.getSystemInfoSync().windowWidth / 750;
    this.setData({
      'map.scale': scale,
      'map.height': wx.getSystemInfoSync().windowHeight - 100 * scale,
      windowHeight: wx.getSystemInfoSync().windowHeight - 100 * scale,
      windowWidth: wx.getSystemInfoSync().windowWidth,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 加载图片,并设置图片初始化缩放比例
  imgLoad: function(e) {
    // console.log(e);
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
      'img.height': height * that.data.img.scale,
      'touch.originWidth': width * that.data.img.scale,
      'touch.originHeight': height * that.data.img.scale
    });
    // 图片加载完成之后定位展览及ibeacon位置
    // that.getProInfo();
    // that.getIbeaconInfo();
  },

  bindscale:function(e){
    console.log(e)
  },

  // bindTouchStart: function(e) {
  //   // 手指单滑
  //   if (e.touches.length == 1) {
  //     return false;
  //   }
  //   // 双手指触发开始
  //   var xMove = e.touches[1].clientX - e.touches[0].clientX;
  //   var yMove = e.touches[1].clientY - e.touches[0].clientY;
  //   var distance = Math.sqrt(xMove * xMove + yMove * yMove);
  //   this.setData({
  //     'touch.distance': distance,
  //   });
  // },

  // bindTouchMove: function(e) {
  //   var that = this;
  //   var touch = that.data.touch;
  //   if (e.touches.length == 1) { // 单滑
  //     return false;
  //   }
  //   // 双滑
  //   var xMove = e.touches[1].clientX - e.touches[0].clientX;
  //   var yMove = e.touches[1].clientY - e.touches[0].clientY;
  //   // 新的 ditance 
  //   var distance = Math.sqrt(xMove * xMove + yMove * yMove);
  //   var distanceDiff = distance - touch.distance;
  //   var newScale = touch.scale + 0.003 * distanceDiff
  //   // 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
  //   newScale = Math.min(newScale, 2);
  //   newScale = Math.max(newScale, 1);
  //   // console.log(newScale);
  //   var scaleWidth = newScale * touch.originWidth;
  //   var scaleHeight = newScale * touch.originHeight;
  //   // 给展项位置赋值
  //   // var tempProInfoList = that.data.touch.originProInfoList;
  //   // var tempArr = [];
  //   // tempProInfoList.forEach(function(el) {
  //   //   var arr = {}
  //   //   for (var k in el) {
  //   //     arr[k] = el[k]
  //   //   }
  //   //   tempArr.push(arr);
  //   // });
  //   // tempArr.forEach(function(el, i) { // 确定图标位置
  //   //   el.left = el.left * newScale + (40 * that.data.scale) * (newScale - 1);
  //   //   el.top = el.top * newScale + (80 * that.data.scale) * (newScale - 1);
  //   // });

  //   that.setData({
  //     'touch.distance': distance,
  //     'touch.scale': newScale,
  //     'touch.newScale': newScale,
  //     'img.width': scaleWidth,
  //     'img.height': scaleHeight,
  //     // 'img.proInfoList': tempArr,
  //   });
  //   // that.setData({
  //   //   'current.left': (that.data.current.position.x0) * newScale + (11.5 * that.data.scale) * (newScale - 1),
  //   //   'current.top': (that.data.current.position.y0) * newScale + (25 * that.data.scale) * (newScale - 1),
  //   // })



  // },

  // nav跳转
  navJump: function(e) {
    app.navJump(e);
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