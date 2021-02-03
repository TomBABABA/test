//index.js
//获取应用实例
const app = getApp()
//引入插件：微信同声传译
const plugins = requirePlugin("WechatSI")
const innerAudioContext = wx.createInnerAudioContext()
let _list = ['1', '2', '3', '4', '5','甲','乙','丙','丁','戊']
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({
    data: {
        list:_list.slice(0),
        canvasWidth:'700',
        canvasHeight: '1050',
        top_distance:['890','20','1000','670','230','780','340','120','450','560'],
        left_distance:['100','20','220','350','600','320','650','250','420','550'],
        string:"",
        src:"",
        question:"第1题 请按 1 甲 2 乙 ...的顺序点击以下按钮",
        questionToSpeak:"第1题。。请按。。1。。。甲。。。2。。。乙 。。。的顺序，点击以下按钮",
    },
    onLoad:function()
    {
        wx.removeStorageSync('1');
        wx.removeStorageSync('2');
        let arr=this.data.list;
        let temparr1=this.data.top_distance;
        let temparr2=this.data.left_distance;
        for (let i=arr.length;i;i--){
            // 产生三个随机位置
            let j = Math.floor(Math.random() * i);
            let n = Math.floor(Math.random() * i);
            let m = Math.floor(Math.random() * i);
             // 交换位置
             [arr[i-1],arr[j]] = [arr[j],arr[i-1]];
             [temparr1[i-1],temparr1[n]] = [temparr1[n],temparr1[i-1]];  
             [temparr2[i-1],temparr2[m]] = [temparr2[m],temparr2[i-1]];    
         }
         _list = arr.slice(0)
         this.setData({
             list: arr,
             top_distance:temparr1,
             left_distance:temparr2
         })
         var text = this.data.question;
         this.textToSpeech(text)
         this.testinfo();
    },
    onShow:function(){
      this.setData({string:""})
    },
    //点击提交按钮的事件
    redrec:function()
    {
      wx.setStorageSync('1', this.data.string);
        wx.redirectTo({
          url: '../question_2/question_2',
        })
    },
    testinfo:function(){
      var that=this;
      Dialog.alert({
        title:'考试题目',
        message: '第1题 请按1甲2乙的顺序点击以下按钮',
        confirmButtonText: "退出播放",
      }).then(() => {
        innerAudioContext.stop();
      })
      innerAudioContext.onEnded(() => {
        Dialog.close()
      });
      this.textToSpeech(this.data.questionToSpeak)
      },
    //对序列图标的按钮点击事件
    handleClicks:function(e){
      if(this.data.string.length>=10)
      {
        
      }
      else{
        let i=e.currentTarget.dataset.info;
        let s=this.data.string;
        s+=i;
        this.setData({string:s});
      }
    },
    //对已经点击的序列进行删除
    deleteOne:function()
    {
      let tempstring=this.data.string.slice(0,this.data.string.length-1);
      this.setData({string:tempstring});
    },
    //
    textToSpeech:function(e){
      plugins.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: e,
        success: function (res) {
          innerAudioContext.autoplay = true
          innerAudioContext.src = res.filename
          console.log(innerAudioContext.src )
          innerAudioContext.onCanplay(() => {
            console.log('can play')
        })
        },
        fail: function (res) {
          console.log("fail tts", res)
        }
      })
    },
    tolast(){
      wx.redirectTo({
        url: '../../pages/moca_Sds_index/moca_Sds_index',
      })
    },
    tonext(){

    this.redrec();
    }

})
