// pages/question1/question1.js
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
const innerAudioContext = wx.createInnerAudioContext();
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '第11题，第一问。请说出橘子和苹果的共同点',//语音播放的内容
    question:'第11.1题 请说出橘子和苹果的共同点',//滚动条内容
    status:0,
    imgurl: app.globalData.imgurl,
  },
  gotoPage:function(options){
    wx.redirectTo({
      url: '../question_10/question',
    })
  },

  gotoPage1:function(options){
    wx.setStorageSync('11.1', res.tempFilePath);
    wx.redirectTo({
      url: '../question_11.2/question',
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

    // wx.showModal({
    //   title: '第四题',
    //   content: '请说出橘子和苹果的共同点',
    //   confirmText:"跳过读题",
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {  
    //       innerAudioContext.pause()
    //       console.log('点击确认回调')
        
    //     } else {   
    //       console.log('点击取消回调')
    //     }
    //   }
    // })
    this.textToSpeech(this.data.content)
    Dialog.alert({
      title:'考试题目',
      message: '第11题，第一问。请说出，橘子和苹果的共同点',
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
        src: res.tempFilePath 
      })
      wx.setStorageSync('11-1', res.tempFilePath)
      console.log(res.tempFilePath )
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
, startRecordMp3: function () {
  this.recorderManager.start({
    format: 'mp3'
  });
  this.setData({
    status:1
  })
}

/**
 * 停止录音
 */
,stopRecord: function(){
  this.recorderManager.stop()
  this.setData({
    status:2
  })
  
}

/**
 * 播放录音
 */
, playRecord: function(){
  var that = this;
  var src = this.data.src;
  if (src == '') {
    this.tip("请先录音！")
    return;
  }
  this.innerAudioContext.src = this.data.src;
  this.innerAudioContext.play()
}
})