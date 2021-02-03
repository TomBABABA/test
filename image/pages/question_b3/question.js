// pages/question1/question1.js
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
let manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext();
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setInter:'',//存储计时器
    time: 0, //录音时长
    tempFilePath: "", //音频路径
    content: '第3题 请您在一分钟内说出尽可能多的水果',
    question:'第3题 请您在一分钟内说出尽可能多的水果',//滚动条内容
    status:0,
    voice_path:String,
    result: String,
    imgurl: app.globalData.imgurl,
  },
  gotoPage1:function(options){
    wx.redirectTo({
      url: '../../pages/question_b2/question',
    })
  },

  gotoPage2:function(options){
    wx.setStorageSync('b3', this.data.result)
    wx.setStorageSync('b3_1', this.data.voice_path)
    wx.redirectTo({
      url: '../../pages/question_b4/question',
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
      message: '第3题 请您在一分钟内说出尽可能多的水果',
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
},

/**
 * 录制mp3音频
*/
onShow: function () {
  var path = ""
  let that = this
  manager.onRecognize = function (res) {}
  manager.onStop = function (res) {
    that.setData({
      voice_path: res.tempFilePath,
      result: res.result,
      status: 2
    })
    console.log(that.data.voice_path)
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
    that.data.status=1
  }
},

//开始录音
touchdown_plugin: function () {
  var that = this
  //将计时器赋值给setInter
  that.data.time=0
  clearInterval(that.data.setInter)
  that.data.setInter = setInterval(
    function () {
        var numVal = that.data.time + 1;
        that.setData({ time: numVal });
        //console.log('setInterval==' + that.data.time);//可删  
        if(that.data.status==2 || numVal==60)     {
          clearInterval(that.data.setInter)
        }
    }
  , 1000); 


  manager.start({
    duration: 60000,
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
},

onUnload: function () {
  var that =this;
  //清除计时器  即清除setInter
  clearInterval(that.data.setInter)
},


})