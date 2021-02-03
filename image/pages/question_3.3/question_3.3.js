// pages/index3/index3.js
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
const plugin = requirePlugin("WechatSI");
const innerAudioContext = wx.createInnerAudioContext();
const ctx = wx.createCanvasContext('canvas')

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
    width: 0,
    height: 0,
    content: '第3.3题。。请您在下面的表盘中，画出时针分针，显示9点10分',
    //canvas生成的图片路径
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
//保存文件
next: function(e){
  wx.canvasToTempFilePath({
    canvasId: 'canvas',
    fileType: 'png',
    quality: 1, //图片质量
    success:(res)=> {
        console.log(res.tempFilePath, 'canvas生成图片地址');
        //保存图片的生成地址
        this.setData({canvasimgsrc:res.tempFilePath});
        //图片地址存入缓存中
        wx.setStorageSync('3-3', this.data.canvasimgsrc);
        //console.log(wx.getStorageSync('1-1'));
        //console.log(wx.getStorageSync('1-2'));
    }
})
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
  onLoad: function (options) {
    // Dialog.alert({
    //   message: '正在播放······',
    //   confirmButtonText: "退出播放",
    // }).then(() => {
    //   innerAudioContext.stop();
    // })
    // innerAudioContext.onEnded(() => {
    //   Dialog.close()
    // });
    // var that = this
    //获取系统信息  
    // wx.getSystemInfo({
    //   //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
    //   success: function (res) {
    //     that.width = res.windowWidth
    //     // console.log(that.width)   375
    //     that.height = res.windowHeight
    //     // console.log(that.height)  625
    //     // 这里的单位是PX，实际的手机屏幕有一个Dpr，这里选择iphone，默认Dpr是2
    //   }
    // })
    this.startCanvas();
    this.testinfo();
    this.textToSpeech();
    //this.drawCircle();
    //let that = this;
    //that.bgImg();
  },
  /** canvas设置背景图片 */
  // bgImg: function () {
  //   //注意这里的 canvas 要与wxml文件的canvas-id属性命名一样
  //     const ctx = wx.createCanvasContext('canvas'); 
  //     let width = 250;
  //     let height = 200;
  //     let bgPicturePath = "../../image/circle1.png";//图片路径不要出错
  //     ctx.drawImage(bgPicturePath, 0, 0, width, height);
  //     ctx.draw();//绘制背景图片
  //   },
  testinfo:function(){
    var that=this;
    wx.showModal({
      title:'考试题目',
      content:'第3.3题，请您在下面的表盘中画出时针分针，显示11点10分',
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
    // setInterval(show, 1000);
    // function show(){
    //   backshow()
    //   numbershow()
    //   drawDot();
    //   ctx.draw()
    // }
  },
//清除画布
cleardraw: function () {
  //清除画布
  arrx = [];
  arry = [];
  arrz = [];
  context.clearRect(0, 0, canvasw, canvash);
  context.draw(true);
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

  },
  tolast:function(options){
    wx.navigateTo({
      url: '../question_3.2/question_3.2',
    })
  },
  tonext(){
    wx.navigateTo({
      url: '../../pages/question_4.1/question',
    })
   }
})

//显示表盘
function backshow() {
  ctx.beginPath()
  ctx.setLineWidth(3)
  ctx.arc(150, 150, 110, 0, 2 * Math.PI)
  //ctx.arc(0, 0, width / 2 - 30, 0, 2 * Math.PI, false);
  ctx.closePath()
  ctx.stroke()
}
//数字
function numbershow() {
  ctx.beginPath()
  ctx.setFontSize(20)
  for (var i = 1; i < 13; i++) {
      var angle = i * Math.PI / 6
      var x = 100 * Math.sin(angle) + 145//微调
      var y = 158 - 100 * Math.cos(angle)
      ctx.fillText(i, x, y)
  }
}
//画出中间那个灰色的圆
function drawDot() {
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, 2 * Math.PI, false);
  ctx.setFillStyle('lightgrey');
  ctx.fill();
  ctx.closePath();
}