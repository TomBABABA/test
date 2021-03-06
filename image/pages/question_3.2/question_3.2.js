// pages/index2/index2.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const plugin = requirePlugin("WechatSI");
const innerAudioContext = wx.createInnerAudioContext();
var context = null; // 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false; //是否在绘制中
var arrx = []; //动作横坐标
var arry = []; //动作纵坐标
var arrz = []; //总做状态，标识按下到抬起的一个组合
var canvasw = 0; //画布宽度
var canvash = 0; //画布高度
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasw: 0,
    canvash: 0,
    screenWidth: 0,
		screenHeight:0,
		imgwidth:0,
		imgheight:0,
    content: '第3.2题。。请您在下图的圆中，按钟表顺序填写数字1到12',
    canvasimgsrc: "",
    imgurl: app.globalData.imgurl,
  },
//文本转语音
textToSpeech: function () {
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: this.data.content,
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

next: function (e) {
  var that = this;
  if (arrx.length == 0) {
    wx.showModal({
      title: '提示',
      content: '您还未答题哟',
      showCancel: false
    })
  } else {
    console.log("不是空的，canvas即将生成图片")
    //生成图片
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      fileType: 'png',
      quality: 1, //图片质量
      success:(res)=> {
          console.log(res.tempFilePath, 'canvas生成图片地址');
          //保存图片的生成地址
          this.setData({canvasimgsrc:res.tempFilePath});
          //图片地址存入缓存中
          wx.setStorageSync('3-2', this.data.canvasimgsrc);
          //console.log(wx.getStorageSync('1-1'));
          //console.log(wx.getStorageSync('1-2'));
      },
      fail: function () {
        console.log("canvas不可以生成图片")
        wx.showModal({
          title: '提示',
          content: '微信当前版本不支持，请更新到最新版本！',
          showCancel: false
        });
      },
      complete: function () {
        that.cleardraw()
      }
    })
    wx.navigateTo({
      url: '../question_3.3/question_3.3',
    })
  }
},
startCanvas: function () {
  var that = this;
  //创建canvas
  this.initCanvas();
  //获取系统信息
  wx.getSystemInfo({
    success: function (res) {
      canvasw = res.windowWidth - 0; //设备宽度
      canvash = canvasw;
      that.setData({
        'canvasw': canvasw
      });
      that.setData({
        'canvash': canvash
      });
    }
  });

},
//初始化函数
initCanvas: function () {
  // 使用 wx.createContext 获取绘图上下文 context
  context = wx.createCanvasContext('canvas');
  context.beginPath()
  context.setStrokeStyle('#000000');
  context.setLineWidth(2);
  context.setLineCap('round');
  context.setLineJoin('round');
},
//事件监听
canvasIdErrorCallback: function (e) {
  console.error(e.detail.errMsg)
},
canvasStart: function (event) {
  isButtonDown = true;
  arrz.push(0);
  arrx.push(event.changedTouches[0].x);
  arry.push(event.changedTouches[0].y);

},
canvasMove: function (event) {
  if (isButtonDown) {
    arrz.push(1);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);

  };

  for (var i = 0; i < arrx.length; i++) {
    if (arrz[i] == 0) {
      context.moveTo(arrx[i], arry[i])
    } else {
      context.lineTo(arrx[i], arry[i])
    };

  };
  context.clearRect(0, 0, canvasw, canvash);
  context.setStrokeStyle('#000000');
  context.setLineWidth(2);
  context.setLineCap('round');
  context.setLineJoin('round');
  context.stroke();

  context.draw(false);
},
canvasEnd: function (event) {
  isButtonDown = false;
},
  /**
   * 生命周期函数--监听页面加载
   */
  cleardraw: function () {
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
  },
  onLoad: function (options) {
    this.startCanvas();
    this.testinfo();
    this.textToSpeech();
    // var _this = this;
		// wx.getSystemInfo({
		// 	success: function(res) {
		// 		_this.setData({
		// 			screenHeight: res.windowHeight,
		// 			screenWidth: res.windowWidth,
		// 		});
		// 	}
    // });
    // Dialog.alert({
    //   message: '正在播放······',
    //   confirmButtonText: "退出播放",
    // }).then(() => {
    //   innerAudioContext.stop();
    // })
    // innerAudioContext.onEnded(() => {
    //   Dialog.close()
    // });
  },
  testinfo:function(){
    var that=this;
    wx.showModal({
      title:'考试题目',
      content:'第3.2题，请您在下图的圆中按钟表顺序填写数字1-12',
      showCancel:false,
      cancelColor: 'cancelColor',
      confirmText:'退出播放',
      success (res) {
       if (res.confirm){
         innerAudioContext.stop()
       }
      }
    })
    this.textToSpeech(this.data.question);
},
    tolast:function(options){
      wx.navigateTo({
        url: '../question_3.1/question_3.1',
      })
    },
    tonext:function(options){
      wx.navigateTo({
        url: '../question_3.3/question_3.3',
      })
    },
  // imageLoad: function(e) {
  //   var _this=this;
  // var $width=e.detail.width,    //获取图片真实宽度
  //     $height=e.detail.height,
  //     ratio=$width/$height;   //图片的真实宽高比例
  // var viewWidth=500,           //设置图片显示宽度，
  //         viewHeight=500/ratio;    //计算的高度值   
  // this.setData({
  //   imgwidth:viewWidth,
  //     imgheight:viewHeight
  // })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.testinfo();
    // this.textToSpeech();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})