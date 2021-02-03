// pages/page2/page2.js
const app = getApp()
//引入插件：微信同声传译
const plugins = requirePlugin("WechatSI")
const innerAudioContext = wx.createInnerAudioContext()
import dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({
  data: {
    canvasWidth:'600',
    canvasHeight: '550',
    boldVal:5,
    colors: ['black'],
    curColor:'black',
    isEraser:false,
    isDelete:false,
    isSuc:true,
    isTap:true,
    question:"第2题....，请在图片下方的画板上画出图片中物体的形状",
    canvasImgsrc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text = this.data.question;
    this.textToSpeech(text);
    this.testinfo();
    this.context = wx.createCanvasContext('canvas');
    this.isMouseDown=false
    this.lastLoc={ x: 0, y: 0 }
    this.lastTimestamp = 0;
    this.lastLineWidth = -1;
    this.drawBgColor();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow:function(){
    
  },
  drawBgColor(){
    this.context.save();
    this.context.setFillStyle('#ffffff');
    this.context.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    this.context.restore();
    this.context.draw({
      reserve: true
    })
  },
  changeBold:function(e){
    this.setData({boldVal: e.detail.value})
  },
  selectColor:function(e){
    this.setData({ curColor: e.currentTarget.dataset.value })
    this.setData({ isEraser: false })
  },
  beginStroke(event) {
      this.isMouseDown = true
      this.lastLoc = { x: event.touches[0].x, y: event.touches[0].y }
      this.lastTimestamp = event.timeStamp;
      this.setData({ isTap: true })
      // //draw
      this.context.arc(this.lastLoc.x, this.lastLoc.y, this.data.boldVal / 2, 0, 2 * Math.PI)
      this.context.setFillStyle(this.data.curColor);
      this.context.fill();
      wx.drawCanvas({
        canvasId: 'canvas',
        reserve: true,
        actions: this.context.getActions() // 获取绘图动作数组
      })
 
      // if (event.touches.length>1){
      //   var xMove = event.touches[1].x - event.touches[0].x;
      //   var yMove = event.touches[1].y - event.touches[0].y;
      //   this.lastDistance = Math.sqrt(xMove * xMove + yMove * yMove);
 
      // }
     
  },
  endStroke(event) {
    // console.log(this.data.isTap)
    // if (this.data.isTap){
    //   this.lastLoc = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
    //   this.lastTimestamp = event.timeStamp;
    //   //draw
    //   this.context.arc(this.lastLoc.x, this.lastLoc.y, this.data.boldVal / 2, 0, 2 * Math.PI)
    //   this.context.setFillStyle(this.data.curColor);
    //   this.context.fill();
    //   wx.drawCanvas({
    //     canvasId: 'canvas',
    //     reserve: true,
    //     actions: this.context.getActions() // 获取绘图动作数组
    //   })
 
    // }
    this.isMouseDown= false
  },
 
  moveStroke(event) {
    if (this.isMouseDown && event.touches.length == 1) {
      var touch = event.touches[0];
      var context = this.context;
      var curLoc = { x: touch.x, y: touch.y };
      var curTimestamp = event.timeStamp;
      var s = this.calcDistance(curLoc, this.lastLoc)
      var t = curTimestamp - this.lastTimestamp;
      var lineWidth = this.calcLineWidth(t, s)
      //draw
   
      context.setStrokeStyle(this.data.curColor);
      context.setLineWidth(lineWidth);
      context.beginPath()
      context.moveTo(this.lastLoc.x, this.lastLoc.y)
      context.lineTo(curLoc.x, curLoc.y)
 
      // locHistory.push({ x: curLoc.x, y: curLoc.y, with: lineWidth, t: t })
 
 
      context.setLineCap("round")
      context.setLineJoin("round")
      context.stroke();
  
      this.lastLoc=curLoc;
      // this.setData({ lastTimestamp: curTimestamp })
      // this.setData({ lastLineWidth: lineWidth })
 
      wx.drawCanvas({
        canvasId: 'canvas',
        reserve: true,
        actions: this.context.getActions() // 获取绘图动作数组
      })
    
    } else if (event.touches.length > 1){
      this.setData({isTap:false})
 
      var xMove = event.touches[1].x - event.touches[0].x;
      var yMove = event.touches[1].y - event.touches[0].y;
      var newdistance = Math.sqrt(xMove*xMove + yMove*yMove);
      // if (newdistance - this.lastDistance>0){
      //   this.setData({ canvasWidth: this.data.canvasWidth * 1.2 })
      //   this.setData({ canvasHeight: this.data.canvasHeight * 1.2 })
      // }else{
      //   this.setData({ canvasWidth: this.data.canvasWidth * 0.8 })
      //   this.setData({ canvasHeight: this.data.canvasHeight * 0.8})
      // }
 
    }
  },
  calcLineWidth(t, s){
    var v = s / t;
    var resultLineWidth = this.data.boldVal;
    if(v <= 0.1) {
      resultLineWidth = resultLineWidth * 1.2;
    }else if(v >= 10) {
      resultLineWidth = resultLineWidth/1.2
    }else{
      resultLineWidth = resultLineWidth - (v - 0.1) / (10 - 0.1) * (resultLineWidth * 1.2 - resultLineWidth / 1.2)
    }
    return resultLineWidth
  },
 calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
  },
  //清除画布上的内容
 clearCanvas:function(){
   this.drawBgColor()
   this.setData({ isEraser:false})
   this.setData({ curColor:'black'})
  },
  //橡皮擦的方法
 eraser:function () {
   this.setData({ isEraser: !this.data.isEraser})
   if(this.data.isEraser)
   {
    this.setData({ curColor:'#ffffff'})
   }
   else{
    this.setData({ curColor:'black'})
   }
  // this.context.clearActions();
  // this.context.draw()
 },
 saveImg:function(){
   
 },
 //考试信息弹出方法
 testinfo:function(){
     var that=this;
     wx.showModal({
       title:'考试信息',
       content:'第2题 请在画板上画出以下图片中三维物体',
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
 //点击按钮，进行重定向
 redrec:function()
 {
   wx.redirectTo({
     url: '../../pages/question_3.1/question_3.1',
   })
 },
 //上传
 uploadCanvasImg() {
  wx.canvasToTempFilePath({
      canvasId: 'canvas',
      fileType: 'png',
      quality: 1, //图片质量
      success:(res)=> {
          console.log(res.tempFilePath, 'canvas生成图片地址');
          //保存图片的生成地址
          this.setData({canvasImgsrc:res.tempFilePath});
          //图片地址存入缓存中
          wx.setStorageSync('2', this.data.canvasImgsrc);
          console.log(wx.getStorageSync('1'));
          console.log(wx.getStorageSync('2'));
      }
  })
},
textToSpeech:function(e){
  plugins.textToSpeech({
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
tolast(){
  wx.redirectTo({
    url: '../../pages/question_1/question_1',
  })
},
tonext(){
    this.uploadCanvasImg()
    wx.redirectTo({
      url: '../question_3.1/question_3.1'
    })
}
})