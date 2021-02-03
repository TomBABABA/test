// pages/results/results.js
const app = getApp();
Page({
  data: {
    totalScore: null, // 分数
    wrongList: [], // 错误的题数-乱序
    wrongListSort: [],  // 错误的题数-正序
    chooseValue: [], // 选择的答案
    remark: ["您已完成抑郁自评量表的（SDS）的评估", "您已完成焦虑自评量表（SAS）的评估"], // 评语
    modalShow: false,
    imgurl: app.globalData.imgurl,
    // testId: null
  },
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({ title: options.testId }) // 动态设置导航条标题
    
    let wrongList = JSON.parse(options.wrongList);
    let wrongListSort = JSON.parse(options.wrongListSort);
    let chooseValue = JSON.parse(options.chooseValue);
    this.setData({
      totalScore: options.totalScore != ""?options.totalScore:"无",
      wrongList: wrongList,
      wrongListSort: wrongListSort,
      chooseValue: chooseValue,
      questionList: app.globalData.questionList[options.testId],  // 拿到答题数据
      testId: options.testId  // 课程ID
    })
    console.log("总分为：" + this.data.totalScore)
    console.log("量表类型为：" + this.data.testId)
    let score = this.data.totalScore;
    let type = this.data.testId;

    // 将数据传到后端
    wx.request({
      url: app.globalData.url+'sdsResolve/',
      data: {"sc" : score, "id" : type, 'openId':wx.getStorageSync('openId'),},
      method: 'GET',
      success: (result) => {
        console.log("数据传输成功：" + score + " " + type)
      },
      fail: (res) => {
        console.log("数据传输失败")
      },
    })
    // console.log(this.data.chooseValue);
  },
  // 查看错题
  toView: function(){
    // 显示弹窗
    this.setData({
      modalShow: true
    })
  },
  // 返回首页
  toIndex: function(){
    wx.redirectTo({
      url: '../sds_index/sds_index'
    })
  }
})