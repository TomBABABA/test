// pages/index/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    islogin:false,
    isExit:false,
    avatarUrl: "",
    userName: "",
    imgurl: app.globalData.imgurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              // wx.redirectTo({
              //   url: '../../pages/moca_Sds_index/moca_Sds_index',
              // })
            }
          })
        }
      }
    })
  },
  bindGetUserInfo (e) {
    var that = this
    this.setData({ isLogin: !this.data.isLogin, avatarUrl: e.detail.userInfo.avatarUrl, userName: e.detail.userInfo.nickName })
    wx.setStorageSync('isLogin', this.data.isLogin)
    wx.login({
      success: function (res) {
        console.log(res.code)
        wx.request({
          url: app.globalData.url+'getOpenid/',
          data: { code: res.code },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.statusCode == 200) {
              wx.setStorageSync('openId', res.data.openid)
              console.log(res.data.openid)
              wx.request({
                url: app.globalData.url+'login/',
                data: { openId: res.data.openid },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  if (res.statusCode == 200) {
                    console.log('wenjian' + res)
                    // that.setData({ isExist: res.data.exist, isDoctor: res.data.isDoctor, isParamedic: res.data.isParamedic, isPatient: res.data.isPatient})
                    // wx.setStorageSync('isPatient', that.data.isPatient)
                    if (res && res.header && res.header['Set-Cookie']) {
                      wx.setStorageSync('cookieKey', res.header['Set-Cookie']) //保存Cookie到Storage
                    }
                    // if (!that.data.isExist) {
                    //   wx.showModal({
                    //     title: '',
                    //     content: '请点击修改信息选择您的身份',
                    //   })
                    // }
                  }
                },
              })
            }
          },
        })
      }
    })
    wx.redirectTo({
      url: '../../pages/login/login',
    })
    if(e.detail.userInfo)
    {
      // console.log(e.detail.userInfo)
      // wx.redirectTo({
      //   url: '../../pages/moca_Sds_index/moca_Sds_index',
      // })
    }
    else{
      // wx.showModal({
      //   cancelColor: 'cancelColor',
      //   title:'警告',
      //   content:'你点击了取消授权，将无法进入测试系统',
      //   confirmText:'返回授权',
      //   showCancel:false,
      //   success: function (res) {
      //     if (res.confirm) {
      //       //点击确定按钮
      //     } else if (res.cancel) {
      //       //点击取消按钮
      //     }
      //   }    
      // })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})