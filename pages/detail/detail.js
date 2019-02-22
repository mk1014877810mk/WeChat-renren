// pages/detail/detail.js
const app = getApp();
const ajaxUrl = app.globalData.server;
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var aHrefHrefData = `<p>
    <span style="font-size: 14px;">梅赛德斯 - 奔驰文化中心</span>
</p>
<hr/>
<p>
    <br/>
</p>
<p>
    <span style="font-size: 14px;">&nbsp; &nbsp; 梅赛德斯 - 奔驰文化中心是全球顶级的娱乐、文化、体育及休闲圣殿。文化中心拥有五个观众楼层、18000 个座位、82 个VIP 包厢、多功能酒廊及会议室，配备顶级音响及演出设施，可承办国内外最大规模的室内表演活动及体育赛事。</span><img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2249893882,1165836821&fm=27&gp=0.jpg" title="1537152781470012.jpg" alt="500.jpg"/>
</p>
<p>
    <br/>
</p>
<p>
    <span style="font-size: 14px;">&nbsp; &nbsp; 同时可容纳800 名观众的音乐俱乐部开创上海“剧场 + 酒吧”先锋营业模式。文化中心拥有全上海最大的室内真冰溜冰场、全数字化管理豪华影城、以及约 2 万平方米的商业休闲区，从购物到餐饮，琳琅满目，一应俱全。</span>
</p>
<p>
    <br/>
</p>
<p>
    <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2249893882,1165836821&fm=27&gp=0.jpg" title="1537152793520327.jpg" alt="501.jpg"/>
</p>`; // 渲染百度编辑器的内容
    WxParse.wxParse('aHrefHrefData', 'html', aHrefHrefData, this);
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