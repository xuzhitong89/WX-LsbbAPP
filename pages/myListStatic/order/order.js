var Utils = require("../../../utils/util.js");

var datas = {
  nickname: "",        // 姓名
  image: "",           // logo
  orderArr: []         // 数据
};

Page({
  data: datas,
  onLoad: function (options) {
    this.request();
  },
  onShow: function () {

  },
  request: function () { // 请求列表接口
    var _this = this;
    var loginData = wx.getStorageSync("login");
    Utils.requestFn({
      url: '/index.php/myfaqs?server=1',
      data: {
        sdk: loginData.sdk,
        uid: loginData.uid
      },
      success: function (res) {
        if (res.data.status) {
          var datas = res.data.data;
          _this.setData({
            nickname: datas.user.nickname,
            image: datas.user.image,
            orderArr: datas.faqs
          })

        }

      }
    })
  },
  Jump: function (e) {
    var id = e.currentTarget.dataset.id;
    this.JumpRequest(id);
  },
  JumpRequest: function (id) {
    var loginData = wx.getStorageSync("login");
    var loginJosn = {};
    Utils.requestFn({
      url: '/index.php/consultdetail?server=1',
      data: {
        sdk: loginData.sdk,
        uid: loginData.uid,
        id: id
      },
      success: function (res) {
        // 记录一下传入详情的值，为详情刷新做准备
        loginJosn = {id: id}
        Utils.setStorage("details", loginJosn)
        Utils.setStorage("LawyerParticulars", res.data.data)  // 改为本地储存数据
        wx.navigateTo({
          url: "/pages/Consultation_details/Consultation_details"
        })
      }
    })
  }
})