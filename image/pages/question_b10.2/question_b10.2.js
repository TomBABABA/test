// pages/question_b10.2/question_b10.2.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
const innerAudioContext = wx.createInnerAudioContext();
let manager = plugin.getRecordRecognitionManager();

function uploadFile(fileTemp, NUMBER) {
  console.log(fileTemp)
  wx.uploadFile({
    url: app.globalData.url + 'multifile2/',
    filePath: fileTemp[NUMBER],
    name: 'file',
    header: {
      'content-type': 'multipart/form-data',
      'Cookie': wx.getStorageSync('cookieKey')
    },
    formData: {
      //上传数据
      'NUMBER': NUMBER,
      'openid': wx.getStorageSync('openId')
    },
    success(res) {
      console.log(res);
      if (NUMBER + 1 == fileTemp.length) {
        wx.request({
          url: app.globalData.url + 'multifile2/',
          method: 'GET',
          //此处上传的data为非文件数据
          data: {
            'openId': wx.getStorageSync('openId'),
            'loginfo':wx.getStorageSync('loginfo'),
            '1': wx.getStorageSync('b1'),
            'b2-2':wx.getStorageSync('b2-2'),
            'b3':wx.getStorageSync('b3'),
            '4': wx.getStorageSync('4'),
            '5': wx.getStorageSync('5'),
            'b6.1':wx.getStorageSync('b6.1'),
            'b6.2':wx.getStorageSync('b6.2'),
            'b6.3_1':wx.getStorageSync('b6.3_1'),
            '7': wx.getStorageSync('7-2'),
            'b8-2':wx.getStorageSync('b8-2'),
            'b9-2':wx.getStorageSync('b9-2'),
            'b10.1_text':wx.getStorageSync('b10.1_text'),
            'b10.2_answer': wx.getStorageSync('b10.2_answer'),
          },
          header: {
            'content-type': 'application/json',
            'Cookie': wx.getStorageSync('cookieKey')
          },
        })
        wx.showToast({
          title: '上传成功',
        })
      } else {
        uploadFile(fileTemp, NUMBER + 1);
      }
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '第10.2题 请按行说出圆形和正方形中的数字',//内容
    question:'第10.2题 请按行说出圆形和正方形中的数字',
    status:0,
    voice_path: String,
    imgurl: app.globalData.imgurl,
    result: String
   },

  //页面导航
  gotoPage1: function() {
    wx.redirectTo({
      url: '../../pages/question_b10.1/question_b10.1',
    })
  },
  submit: function() {
    var answer = {
      text: this.data.result
    }
    // console.log(answer)
    wx.setStorageSync('10.2', this.data.voice_path)
    wx.setStorageSync('b10.2_answer', answer)
    Dialog.confirm({
      title: '交卷',
      confirmButtonText: '确认交卷',
      cancelButtonText: '取消交卷'
    })
    .then(() => {
      //此处上传文件数据
      let uploadData = [
        wx.getStorageSync('b2-1'),
        wx.getStorageSync('b3_1'),
        wx.getStorageSync('b6.1_1'),
        wx.getStorageSync('b6.2_1'),
        wx.getStorageSync('b6.3'),
        wx.getStorageSync('7-1'),
        wx.getStorageSync('b8-1'),
        wx.getStorageSync('b9-1'),
        wx.getStorageSync('b10.1'),
        wx.getStorageSync('10.2'),
      ]
      uploadFile(uploadData, 0)
      // this.uploadData() //自己测试的13题函数，不用管
      wx.showToast({
        title: '交卷成功',
      })
      wx.navigateTo({
        url: '../results_moca/results_moca'
      })
    })
    .catch(() => {
      // on cancel
    });
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
      message: '第10.2题 请按行说出圆形和正方形中的数字',
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
      console.log(that.data.result)
      console.log(that.data.voice_path)
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