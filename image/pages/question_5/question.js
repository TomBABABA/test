// pages/question1/question1.js
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
const innerAudioContext = wx.createInnerAudioContext();
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
let manager = plugin.getRecordRecognitionManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '第5题 请正确读出以下五个词语 ',//语音播放的内容
    question:'第5题 请正确读出以下五个词语 ',//滚动条内容
    one_phrase:'鼻子。。。。。。。丝绸。。。。。。。寺庙。。。。。。。菊花。。。。。。。红色。。。。。',//点击播放之后播放的内容
    status:0,
    voice_path: String,
    result: String,
    imgurl: app.globalData.imgurl,
  },
  gotoPage1:function(options){
    wx.redirectTo({
      url: '../../pages/question_4.3/question',
    })
  },

  gotoPage2:function(options){
    var answer = {
      text: this.data.result,
    }
     wx.setStorageSync('5-1', this.data.voice_path)
    wx.setStorageSync('5-2', answer)

    wx.redirectTo({
      url: '../../pages/question_6.1/question',
    })
  },
    //播放语音
    textToSpeech:function(e){
      plugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: e,
        success: function (res) {
          innerAudioContext.autoplay = true
          innerAudioContext.src = res.filename
          innerAudioContext.onPlay(() => {
        })
        },
        fail: function (res) {
          console.log("fail tts", res)
        }
      })
    }, 
  popConfirm: function(){
    var that = this;
    Dialog.alert({
      title:'考试题目',
      message: '第5题 正确读出以下五个词语',
      confirmButtonText: "退出播放",
    }).then(() => {
      innerAudioContext.stop();
    })
    
    innerAudioContext.onEnded(() => {
      Dialog.close()
    });
    this.textToSpeech(this.data.content)

  },

  popConfirm1: function(){
    var that = this;
    wx.showModal({      
      content: '请仔细听',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {  
          innerAudioContext.pause()
          console.log('点击确认回调');       
        } else {   
          console.log('点击取消回调')
        }
      }
    })
    this.textToSpeech(this.data.one_phrase)
  },


  onLoad: function (options) {
    this.popConfirm()
   
  },

 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   var path = ""
    let that = this
    manager.onRecognize = function (res) {}
    manager.onStop = function (res) {
      that.setData({
        voice_path: res.tempFilePath,
        result: res.result,
      })
      console.log(that.data.voice_path)
      console.log('语音内容 --> ' + res.result)
      wx.showToast({
        title: '录音完成',
      })
      // console.log(res) //语音识别信息打印
    }
    manager.onError = function (res) {
      console.log('manager.onError')
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      })
      console.log(res) //报错信息打印
    }
  },
  //开始录音
  touchdown_plugin: function () {
    var _this = this
    manager.start({
      duration: 30000,
      lang: "zh_CN"
    })
    this.setData({
      status: 1
    })
  },

  //结束录音
  touchup_plugin: function () {
    manager.stop();
    this.setData({
      status: 0
    })
  }
})