//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (!wx.getStorageSync('user_id')){
      var user_id = (+new Date()).toString() + Math.random();
      wx.setStorageSync('user_id', user_id);
    }


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


  /**
   * 导航栏跳转
   */

  navJump: function(e, title, e_id, logoSrc) {
    var route1 = getCurrentPages()[0].route;
    var route2 = getCurrentPages()[1] && getCurrentPages()[1].route;
    var index = e.currentTarget.dataset.index;
    if (route1 == 'pages/home/home' && index == 1 || route2 == 'pages/home/home' && index == 1 || route1 == 'pages/scan/scan' && index == 2 || route2 == 'pages/scan/scan' && index == 2 || route1 == 'pages/map/map' && index == 3 || route2 == 'pages/map/map' && index == 3) return;
    if (index == 1) {
      wx.redirectTo({
        url: '../home/home?title=' + title + '&e_id=' + e_id + '&logoSrc=' + logoSrc,
      });
    } else if (index == 2) {
      wx.redirectTo({
        url: '../scan/scan?title=' + title + '&e_id=' + e_id + '&logoSrc=' + logoSrc,
      });
    } else if (index == 3) {
      wx.redirectTo({
        url: '../map/map?title=' + title + '&e_id=' + e_id + '&logoSrc=' + logoSrc,
      });
    }
  },

  setNavTitle: function(title) {
    wx.setNavigationBarTitle({
      title: title
    });
  },

  globalData: {
    userInfo: null,
    // server: 'http://172.16.1.168/tour/web/',
    server: 'https://renren.broadmesse.net/tour/web/',
    lastHallZid: '', // 用户最后一次点击有效的展厅id
  }
})