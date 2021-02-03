// pages/newMusic/index.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
const innerAudioContext = wx.createInnerAudioContext();
let manager = plugin.getRecordRecognitionManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '第9题 第四问，请说出图中的动物',//内容
    question:'第9题 第四问，请说出图中的动物',
    status:0,
    imgurl: app.globalData.imgurl,
    voice_path: String,
    result: String
   },

  //页面导航
  gotoPage1: function() {
    wx.redirectTo({
      url: '../../pages/question_b9.3/question',
    })
  },
  gotoPage2: function() {
    var answer = {
      text: this.data.result,
    }
     wx.setStorageSync('b9.4-1', this.data.voice_path)
    wx.setStorageSync('b9.4-2', answer)
    wx.redirectTo({
      url: '../../pages/question_b10.1/question_b10.1',
    })
  
  },

  //文本播放
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

  //弹窗跳出 
  popConfirm: function(){
    Dialog.alert({
      title:'考试题目',
      message: '第9题 请说出图中的动物',
      confirmButtonText: "退出播放",
    }).then(() => {
      innerAudioContext.stop();
    })
    
    innerAudioContext.onEnded(() => {
      Dialog.close()
    });
    this.textToSpeech(this.data.content)

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