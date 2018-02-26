
let Utils = require("../../utils/util.js");

let data = {
  usedConetent:"",    // 传输过来的数据
  newConetent:"",   // 这次发送的修改数据
  faqid: "",   // 存储faqid
  isBool:true,   // 提交判断
};

Page({
  data:data,
  onLoad (options) {
    this.loadData();
  },
  loadData(){
    let value = wx.getStorageSync("ReplyData");
    if (!value) return false;
    this.setData({
      faqid: value.faqid,
      usedConetent: value.content
    })
  },
  onUnload(){
    Utils.setStorage("ReplyData", "");
  },
  onHide(){
    Utils.setStorage("ReplyData", "");
  },
  Release(){    // 确定发布
    let value = wx.getStorageSync("login");
    let isBool = this.data.isBool;
    let res = {};
    res = {
      faqid: this.data.faqid,
      content: this.data.newConetent,
      uid: value.uid,
      sdk: value.sdk
    }
    if (!isBool){
      Utils.showModal("修改内容不能为空");
    }
    this.ReleaseData(res);
  },
  entryFn(event){   // 修改内容输入的时候验证
    let value = event.detail.value;
    if (value.trim() != "") {
      this.setData({ newConetent: value, isBool:true})
    }else{
      this.setData({ isBool:false});
    }
  },
  ReleaseData(res){  // 发布请求的接口
    Utils.requestFn({
      url:"/index.php/modifyfaq?server=1",
      method:"POST",
      data: res,
      success(res){
        if (res.data.data){
          wx.navigateTo({
            url: "/pages/Consultation_details/Consultation_details"
          })
        }else{
          Utils.showModal("修改失败");
        }
      }
    })
  }
})