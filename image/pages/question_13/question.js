var plugin = requirePlugin("WechatSI")
const innerAudioContext = wx.createInnerAudioContext()
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()

function uploadFile(fileTemp, NUMBER) {
  console.log(fileTemp)
  wx.uploadFile({
    url: app.globalData.url + 'multifile/',
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
          url: app.globalData.url + 'multifile/',
          method: 'GET',
          //此处上传的data为非文件数据
          data: {
            'openId': wx.getStorageSync('openId'),
            'loginfo':wx.getStorageSync('loginfo'),
            '1': wx.getStorageSync('1'),
            '4': wx.getStorageSync('4-2'),
            '5': wx.getStorageSync('5-2'),
            '7': wx.getStorageSync('7'),
            '8': wx.getStorageSync('8'),
            '9.1_1': wx.getStorageSync('9.1_1'),
            '9.2_1': wx.getStorageSync('9.2_1'),
            '10': wx.getStorageSync('10'),
            '11.1': wx.getStorageSync('11.1'),
            '11.2': wx.getStorageSync('11.2'),
            '12': wx.getStorageSync('12-2'),
            '13': wx.getStorageSync('13')
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
    question: "第13题 请输入今天的日期信息，以及当前您在什么地方和所处的城市。",
    loc: '',
    city: '',
    latitude: '',
    longitude: '',
    year: 0,
    month: 0,
    date: 0,
    day: 0,
    imgurl: app.globalData.imgurl,
  },
  onLoad: function () {
    var date = new Date()
    this.setData({
      year: date.getFullYear(), //获取完整的年份(4位)
      month: date.getMonth(), //获取当前月份(0-11,0代表1月)
      date: date.getDate(), //获取当前日(1-31)
      day: date.getDay() //获取当前星期X(0-6,0代表星期天)
    })
    // 腾讯地图API Key设置
    qqmapsdk = new QQMapWX({
      key: 'LJABZ-UKU6G-VBSQD-I4DLQ-NJ3AZ-IVFCF' //这里自己的key秘钥进行填充
    });
    this.gotoQues()
  },
  //交卷及表单提交
  formSubmit(e) {
    let cur_answer = {
      loc: this.data.loc,
      city: this.data.city,
      year: this.data.year,
      month: this.data.month,
      date: this.data.date,
      day: this.data.day
    }
    let answer = {
      answer: e.detail.value,
      cur_answer: cur_answer
    }
    wx.setStorageSync('13', answer)
    console.log(wx.getStorageSync('9'))
    Dialog.confirm({
        title: '交卷',
        confirmButtonText: '确认交卷',
        cancelButtonText: '取消交卷'
      })
      .then(() => {
        //此处上传文件数据
        let uploadData = [
          wx.getStorageSync('2'),
          wx.getStorageSync('3-1'),
          wx.getStorageSync('3-2'),
          wx.getStorageSync('3-3'),
          wx.getStorageSync('4-1'),
          wx.getStorageSync('5-1'),
          wx.getStorageSync('6.1'),
          wx.getStorageSync('6.2'),
          wx.getStorageSync('9.1'),
          wx.getStorageSync('9.2'),
          wx.getStorageSync('10_1'),
          wx.getStorageSync('11.1_1'),
          wx.getStorageSync('11.2_1'),
          wx.getStorageSync('12-1'),
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
  gotoQues: function () {
    let text = this.data.question;
    this.textToSpeech(text)
    let event = {
      title: '考试题目',
      message: this.data.question
    }
    this.dialogAlert(event)
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
  // 导航函数
  gotoUpperQues: function () {
    wx.redirectTo({
      url: "/pages/question_12/question"
    })
  },
  // 测试13题上传数据函数，不用管
  uploadData: function () {
    wx.request({
      url: app.globalData.url + 'test/',
      method: 'GET',
      data: {
        '13': wx.getStorageSync('13'),
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
  //获取地理位置
  onShow: function () {
    let vm = this;
    vm.getUserLocation();
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined  表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false  表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true  表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res)
        vm.setData({
          loc: res.result.address,
          city: res.result.address_component.city,
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {}
    });
  }
})
