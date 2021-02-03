// pages/question5.1/question5.1.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext()
var plugin = requirePlugin("WechatSI")
const util = require('../../utils/util.js')
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    completed: "",
    
    a:"",
    b:"",
    c:"",
    imgurl: app.globalData.imgurl,
    VState:0,
    question: "第5题：使用以下种类的钱币购买价值13元的物品，并说出三种不同的付款方式"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text = this.data.question;
    this.textToSpeech(text)
    
    this.dialogAlert(this.data.question)
   
    
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
  gotoQues: function () {
    this.textToSpeech(this.data.question)
    Dialog.alert({
      title:'考试题目',
      message: this.data.question,
      confirmButtonText: "退出播放",
    }).then(() => {
      innerAudioContext.stop();
    })
  },
  gotoUpperQues:function(){
  wx.redirectTo({
      url: '/pages/question_b4/question'
    })
  },
  textToSpeech: function (event) {
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: event,
      success: function (res) {
        // 开始播放
        innerAudioContext.autoplay = true
        innerAudioContext.src = res.filename
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })

      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    });

  },
  //弹窗
  dialogAlert: function (event) {
    Dialog.alert({
      title:'考试题目',
      message:event,
      confirmButtonText: "退出播放",
    }).then(() => {
      innerAudioContext.stop();
      console.log("执行")
    })
    innerAudioContext.onEnded(() => {
      Dialog.close()
    });
  },
  gotoNextQues:function(){
   var answer = {
    "a":this.data.a,
    "b":this.data.b,
    "c":this.data.c,
   };
   
    wx.setStorageSync('5', answer)
    wx.redirectTo({
      url: '/pages/question_b6.1/question'
    })
    // this.uploadData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapOne: function () {
    this.setData({VState:this.data.VState+1})
    console.log(this.data.VState)
  },
  uploadData: function () {
    wx.request({
      url: "http://127.0.0.1:8000/"+ 'test',
      method: 'GET',
      data: {
        '5': wx.getStorageSync('5'),
      },
      header: {
        'content-type': 'application/json',
        'Cookie': wx.getStorageSync('cookieKey')
      },
    })
    wx.showToast({
      title: '上传成功',
    })
  },
  addOne: function () {
    if(this.data.VState==0){
      this.setData({a: this.data.a+" 1"})
      console.log(this.data.a)
    }else if(this.data.VState==1){
      this.setData({b: this.data.b+" 1"})
      console.log(this.data.b)
    }else if(this.data.VState==2){
      this.setData({c: this.data.c+" 1"})
      console.log(this.data.c)
    }
  },
  addFive: function () {
    if(this.data.VState==0){
      this.setData({a: this.data.a+" 5"})
      console.log(this.data.a)
    }else if(this.data.VState==1){
      this.setData({b: this.data.b+" 5"})
      console.log(this.data.b)
    }else if(this.data.VState==2){
      this.setData({c: this.data.c+" 5"})
      console.log(this.data.c)
    }
  },
  addTen: function () {
    if(this.data.VState==0){
      this.setData({a: this.data.a+" 10"})
      console.log(this.data.a)
    }else if(this.data.VState==1){
      this.setData({b: this.data.b+" 10"})
      console.log(this.data.b)
    }else if(this.data.VState==2){
      this.setData({c: this.data.c+" 10"})
      console.log(this.data.c)
    }
  },
  D1:function(){
    if(this.data.a!=null){
      var mystr=this.data.a;
      var sliceStr=mystr.slice(0,-2);
      this.setData({a:sliceStr})
    }
  },
  D2:function(){
    if(this.data.b!=null){
      var mystr=this.data.b;
      var sliceStr=mystr.slice(0,-2);
      this.setData({b:sliceStr})
    }
  },
  D3:function(){
    if(this.data.c!=null){
      var mystr=this.data.c;
      var sliceStr=mystr.slice(0,-2);
      this.setData({c:sliceStr})
    }
  },
})