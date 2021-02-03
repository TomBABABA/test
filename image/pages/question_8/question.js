// pages/question5.2.js
const innerAudioContext = wx.createInnerAudioContext()
var plugin = requirePlugin("WechatSI")
const util = require('../../utils/util.js')
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"
Page({


    /**
   * 页面的初始数据
   */
  data: {
    completed:"",
    name_value_bei:"",
    a:"",
    b:"",
    c:"",
    d:"",
    name_value_cut:"",
    question: "第8题 按提示做减法！"
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text =  this.data.question;
    this.textToSpeech(text)
    this.dialogAlert(this.data.question)
    // var max=120;
    // let min=80;
    // var num = parseInt(Math.random()*(max-min+1)+min,10);
    // Math.floor(Math.random()*(max-min+1)+min); 
    this.setData({name_value_bei:100});
    //console.log(num);
    // max=13;
    // min=7;
    // var num1 = parseInt(Math.random()*(max-min+1)+min,10);
    // Math.floor(Math.random()*(max-min+1)+min); 
    this.setData({name_value_cut:7});
  },
  gotoUpperQues:function(){
    wx.redirectTo({
      url: '/pages/question_7/question'
    })
  },
  gotoNextQues:function(){
    var answer = {
      "a":this.data.a,
      "b":this.data.b,
      "c":this.data.c,
      "d":this.data.d,
    }
    wx.setStorageSync('8', answer)
    this.uploadData()
    wx.redirectTo({
      url: '/pages/question_9.1/question'
    })
  },
  uploadData: function () {
    wx.request({
      url: "http://127.0.0.1:8000/"+ 'test',
      method: 'GET',
      data: {
        '8': wx.getStorageSync('8'),
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
  gotoQues: function () {
    this.textToSpeech(this.data.question)
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

  /**
   * 键盘输入时触发的事件  在这里实时获取输入的内容
   */
  namea: function(res){
    console.log("输入的值为："+res.detail.value);//打印输入的值
    this.setData({
      // name_value: res.detail.value//赋值给name_value
     a:res.detail.value
    })
  },
  nameb: function(res){
    console.log("输入的值为："+res.detail.value);//打印输入的值
    this.setData({
      // name_value: res.detail.value//赋值给name_value
      b:res.detail.value
    })
  },
  namec: function(res){
    console.log("输入的值为："+res.detail.value);//打印输入的值
    this.setData({
      // name_value: res.detail.value//赋值给name_value
      c:res.detail.value
    })
  },
  named: function(res){
    console.log("输入的值为："+res.detail.value);//打印输入的值
    this.setData({
      // name_value: res.detail.value//赋值给name_value
      d:res.detail.value
    })
  },
//   startSetInter: function(){
//     var that = this;
//     //将计时器赋值给setInter
//     that.data.setInter = setInterval(
//         function () {
//             console.log('setInterval==' ,that.data.setInter);
//         }
//   , 2000)
// },
})