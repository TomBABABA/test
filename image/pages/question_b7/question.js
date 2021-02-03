// pages/question_9/question.js
var pageSelf = undefined;
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext()
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "第7题：请回忆第2题播放的5组词，录音开始前点击提示无效。录音开始后，请尽量说出知道的词，最后可以点击提示！",
    voice_text: ['梅花', '萝卜', '沙发', '蓝色', '筷子'],
    hint1: ['一种花', '一种蔬菜', '一种背椅', '一种颜色', '一种餐具'],
    hint2: ['菊花，梅花，玫瑰', '香蕉，苹果，萝卜', '桌子，沙发，台灯', '蓝色，红色，白色', '汤勺，筷子，茶杯'],
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
    wx.redirectTo({
      url: "/pages/question_b6.3/question"
    })
  },
  gotoNextQues: function () {
    var answer = {
      text: this.data.result,
    }
    wx.setStorageSync('7-1', this.data.voice_path)
    wx.setStorageSync('7-2', answer)
    // this.uploadData()  //第7题上传测试
    wx.redirectTo({
      url: "/pages/question_b8/question"
    })
  },
  // 测试7题上传数据函数
  uploadData: function () {
    wx.request({
      url: app.globalData.url + 'test/',
      method: 'GET',
      data: {
        '7': wx.getStorageSync('7-2'),
      },
      header: {
        'content-type': 'application/json',
        'Cookie': wx.getStorageSync('cookieKey')
      },
    })
    wx.showToast({
      title: '上传成功',
    })
  }
})