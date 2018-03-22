var Utils = require("../../utils/util.js");
var loginJson = {       // 存储登陆返回的信息
    image: "",
    nickname: "",
    sdk: "",
    status: "",
    telphone: "",
    types: "",
    uid: "",
    openid: ""
}
Page({
  data: {
      ztBool: false,
      consulsURl:""
  },
  onLoad: function (options) {
      this.loginFn();
      if (JSON.stringify(options) != "{}") {
          this.setData({ consulsURl: options })
      }
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  jumpfn(){
      wx.navigateTo({
          url: '/pages/login/login'
      })
  },
  show (){
      console.log("222")
  },
  getPhoneNumber: function (e) {     // 取得授权的手机号码
      this.loginFn();      // 每次点击的获取最新的code
      this.setData({ ztBool: true })  // 点击的时候过程中不让点击
      let iv = e.detail.iv;       // 获取权限的加密iv信息
      let encryptedData = e.detail.encryptedData;  // 获取权限的加密用户信息
      let code = this.data.code;  // 获取login的登陆返回的code

      if (typeof encryptedData == "undefined" && typeof iv == "undefined") {
          Utils.showModal("授权失败");
          this.setData({ ztBool: false }) // 点击的时候过程中不让点击
      } else {
          this.getPhoneRequest(iv, encryptedData, code);  // 执行
      }
  },
  loginFn: function () {     // 判断是否是登陆的状态
      var _this = this;
      wx.login({
          success: function (res) {
              if (res.code) {
                  _this.setData({
                      code: res.code
                  })
              } else {
                  Utils.showModal("获取用户登录态失败！");
              }
          }
      });
  },
  getPhoneRequest: function (iv, encryptedData, code) {    // 请求接口解密用户信息
      var _this = this;
      Utils.requestFn({
          url: '/index.php/wxencrypt?server=1',
          data: {
              content: encryptedData,
              iv: iv,
              code: code
          },
          success: function (res) {
              if (res.data.status) {
                  var userphone = res.data.data.phoneNumber;
                  var openids = res.data.data.openid;
                  _this.getPhoneLoginFn(userphone, openids);   // 穿参请求登录接口
              } else {
                  Utils.showModal(res.data.message);
              }
              _this.setData({      // 点击的时候过程中不让点击
                  ztBool: false
              })
          }
      })
  },
  getPhoneLoginFn: function (mun, openid) {     // 获取登陆手机完成登陆
      var _this = this;
      Utils.requestFn({
          url: '/index.php/phonelogin?server=1',
          method: "POST",
          data: {
              userphone: mun,
              openid: openid
          },
          success: function (res) {
              if (res.data.status) {
                  _this.hrefFn();
                  loginJson = {                // 存储登陆状态      
                      image: res.data.data.image,
                      nickname: res.data.data.nickname,
                      sdk: res.data.data.sdk,
                      status: res.data.data.status,
                      telphone: res.data.data.telphone,
                      types: res.data.data.type,
                      uid: res.data.data.uid,
                      openid: res.data.data.xiaochengxuopenid
                  }
                  Utils.setStorage("login", loginJson);     // 存储到本地缓存
              } else {
                  Utils.showModal(res.data.message);
              }
          }
      })
  },
  hrefFn: function () {  // 点击页面记录跳转
  
      let Reset = wx.getStorageSync("Reset");
      let getconsta = wx.getStorageSync("NotLogin"); // 获取咨询列表点击更多案例的记录
      let consulsURl = this.data.consulsURl;  // 快速咨询的url
      let redPacket = wx.getStorageSync("redPacket"); // 获取红包的跳转的路径
      let lvsCenter = wx.getStorageSync("lvs-center"); // 获取律师购买时候的记录

      if (Reset) {
          wx.redirectTo({  // 跳转别的页面，关闭当前页面
              url: Reset
          })
      } else if (getconsta) {
          // 有咨询列表更多案例的记录，直接跳转VIP的购买页面
          wx.redirectTo({
              url: "/pages/Member/Member"
          })
      } else if (consulsURl.Reset) {
          // 如果是从快速咨询跳转过来，那么返回快速咨询页面
          wx.redirectTo({
              url: consulsURl.Reset
          })
      } else if (redPacket) {
          // 跳转到红包打赏页面
          wx.navigateTo({
              url: "/pages/RedPacket/RedPacket?id=2"
          })
      } else if (lvsCenter){    
        // 在律师详情里面 是否没有登陆
          wx.navigateTo({
              url: `/pages/LawyerDetails/LawyerDetails`
          })

      } else {
          wx.redirectTo({      // 跳转别的页面，关闭当前页面
              url: "/pages/Consultation/Consultation"
          })
      }
  },
})