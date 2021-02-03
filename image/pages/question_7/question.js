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
    name_value_bei: "",
    question_text: [],
    question_answer: [],
    name_value_cut: "",
    index: 0,
    isDisabled:false,
    stopState:0,
    question: "第7题 听到数字1请按按钮！",
    imgurl: app.globalData.imgurl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text = this.data.question;
    this.textToSpeech(text)
    // wx.showLoading({
    //   title: "读题中",
    //   mask: true
    // })
    this.dialogAlert(this.data.question)
    // innerAudioContext.onEnded(() => {
    //   wx.hideLoading()
    // })
    for (var i = 0; i < 20; i++) {
      this.data.question_answer.push(0);
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
  gotoQues: function () {
    this.textToSpeech(this.data.question)
  },
  gotoUpperQues:function(){
  wx.redirectTo({
      url: '/pages/question_6.2/question'
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
      title: event,
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
    "question_answer":this.data.question_answer,
    "question_text":this.data.question_text,
   };
   this.setData({stopState:1})
    wx.setStorageSync('7', answer)
    wx.redirectTo({
      url: '/pages/question_8/question'
    })
    // this.uploadData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapOne: function () {

    this.data.question_answer[this.data.index-1] = 1;
    console.log(this.data.question_answer)
  },
  uploadData: function () {
    wx.request({
      url: "http://127.0.0.1:8000/"+ 'test',
      method: 'GET',
      data: {
        '7': wx.getStorageSync('7'),
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
  startquestionAudio: function () {
    var that = this;
    var ttindex = 0;
    var testpre ="请准备。。。。。。";
    this.textToSpeech(testpre)
    if (!this.data.isDisabled) {
      this.setData({isDisabled:true})
    }else{
      return;
    }
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function () {
        if (ttindex > 19||that.data.stopState==1) {
          clearInterval(that.data.setInter)
        }
        // console.log('ttindex==' ,ttindex);
        ttindex++;
        var max = 0;
        let min = 10;
        var num = parseInt(Math.random() * (max - min + 1) + min, 10);
        Math.floor(Math.random() * (max - min + 1) + min);
        if(ttindex%3==0||ttindex%7==0){
          num=1;
        }
        that.textToSpeech(num.toString())

        that.setData({
          index: ttindex
        });
        
        that.data.question_text.push(num.toString());
        console.log(that.data.question_text);
        if (ttindex > 19||that.data.stopState==1) {
          clearInterval(that.data.setInter)
        }
      }, 2000)
  },
})