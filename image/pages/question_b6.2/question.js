// pages/question1/question1.js
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
const innerAudioContext = wx.createInnerAudioContext();
let manager = plugin.getRecordRecognitionManager()
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '第6.2题 请回答锣鼓和笛子属于什么类别',//滚动条内容
    question:'第6.2题 请回答锣鼓和笛子属于什么类别',
    status:0,
    voice_path:String,
    result: String,
    imgurl: app.globalData.imgurl,
  },
  gotoPage:function(options){
    wx.redirectTo({
      url: '../question_b6.1/question',
    })
  },

  gotoPage1:function(options){
    wx.setStorageSync('b6.2', this.data.result)
    wx.setStorageSync('b6.2_1', this.data.voice_path)
    wx.redirectTo({
      url: '../question_b6.3/question',
    })
  },
  
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

    this.textToSpeech(this.data.content)
    Dialog.alert({
      title:'考试题目',
      message: '第6.2题，请回答锣鼓和笛子属于什么类别',
      confirmButtonText: "退出播放",
    }).then(() => {
      innerAudioContext.stop();
    })
    
    innerAudioContext.onEnded(() => {
      Dialog.close()
    });
  },

  onLoad: function (options) {
  this.popConfirm()
    var that = this;
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function(){
      that.tip("录音失败！")
    });
    this.recorderManager.onStop(function(res){
      that.setData({
        voice_path: res.tempFilePath,
      result: res.result, 
      })
      console.log(that.data.result)
      that.tip("录音完成！")
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
    })
  },


   /**
  * 提示
  */
 tip: function (msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false
  })
}

/**
 * 录制mp3音频
*/
,  onShow: function () {
  var path = ""
  let that = this
  manager.onRecognize = function (res) {}
  manager.onStop = function (res) {
    that.setData({
      voice_path: res.tempFilePath,
      result: res.result,
    })
    console.log(that.data.result)
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
    status: 2
  })

}
})