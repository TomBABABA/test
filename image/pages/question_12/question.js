// pages/question_9/question.js
const app = getApp();
var pageSelf = undefined;
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext()
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "第12题 请回忆第5题播放的5组词，录音开始前点击提示无效。录音开始后，请尽量说出知道的词，最后可以点击提示！",
    voice_text: ['鼻子', '丝绸', '寺庙', '菊花', '红色'],
    hint1: ['身体的一部分', '一种纺织品', '一种建筑物', '一种花', '一种颜色'],
    hint2: ['鼻子，手掌，面孔', '尼龙，棉布，丝绸', '寺庙, 学校, 医院', '玫瑰，菊花，郁金香', '红色，蓝色，绿色'],
    voice_path: String,
    result: String,
    status: 0,
    record_status: 0,
    imgurl: app.globalData.imgurl,
  },

  onLoad: function () {
    this.gotoQues();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    manager.onRecognize = function (res) {}
    manager.onStop = function (res) {
      that.setData({
        voice_path: res.tempFilePath,
        result: res.result,
      })
      console.log(that.data.result)
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
      status: 1,
      record_status: 1,
    })
  },

  //结束录音
  touchup_plugin: function () {
    if (this.data.status == '1') {
      if (this.data.record_status == '1') {
        manager.stop();
      }
      wx.showToast({
        title: '录音完成',
      })
      this.setData({
        status: 0,
        record_status: 0,
      })
    }
  },

  gotoQues: function () {
    var text = this.data.question;
    this.textToSpeech(text)
    let event = {
      title: '考试题目',
      message: this.data.question
    }
    this.dialogAlert(event)
  },

  // 提示
  showHint1: function (event) {
    if (this.data.status == '1') {
      var index = event.currentTarget.dataset.index;
      var text = "提示" + index + "：" + this.data.hint1[index - 1]
      Dialog.alert({
        title: text,
        confirmButtonText: "退出",
      }).then(() => {})
      if (this.data.record_status == '1') {
        manager.stop()
        this.setData({
          record_status: 0,
        })
      }

    }
  },
  showHint2: function (event) {
    if (this.data.status == '1') {
      var index = event.currentTarget.dataset.index;
      var text = "提示" + index + "：" + this.data.hint2[index - 1]
      Dialog.alert({
        title: text,
        confirmButtonText: "退出",
      }).then(() => {})
      if (this.data.record_status == '1') {
        manager.stop()
        this.setData({
          record_status: 0,
        })
      }
    }
  },

  //弹窗
  dialogAlert: function (event) {
    Dialog.alert({
      title: event.title,
      message: event.message,
      confirmButtonText: "退出播放",
    }).then(() => {
      innerAudioContext.stop();
    })
    innerAudioContext.onEnded(() => {
      Dialog.close()
    });
  },

  //文字转语音
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

  // 导航函数
  gotoUpperQues: function () {
    wx.navigateTo({
      url: "/pages/question_11.3/question"
    })
  },
  gotoNextQues: function () {
    var answer = {
      text: this.data.result,
    }
    wx.setStorageSync('12-1', this.data.voice_path)
    wx.setStorageSync('12-2', answer)
    wx.navigateTo({
      url: "/pages/question_13/question"
    })
  }
})