
//  引入函数库
var Utils = require("../../utils/util.js");

let record = {    // 数据
  Consultation: [],    // 整体的数据
  subclass: [],        // 对应子类的数据
  BroadValue: "0",     // 大类对应的索引
  SmallID: "",         // 获取小类的id
  SmallValue: "-1",    // 小类对应的索引
};
let attr = [];

Page({
  data: record,
  onLoad: function (options) {
    this.CommonRequest();     // 默认请求的数据
  },
  CommonRequest() {    // 数据接口

    let _this = this;

    Utils.requestFn({
      url: "/index.php/faqmorecata?server=1",
      success(res) {
        var resData = res.data.data;

        resData.forEach((obj) => { attr.push(obj.small) })
        _this.setData({ Consultation: resData, subclass: attr[0] })

      }
    })
  },

  BroadFn(event) {    // 大类的点击事件

    let Index = event.target.dataset.index;

    this.setData({ subclass: attr[Index], BroadValue: Index, SmallValue: "-1" })

  },
  SmallFn(event) {   // 小类的点击事件

    let ID = event.target.id;
    let Index = event.target.dataset.index;

    this.setData({ SmallID: ID, SmallValue: Index })

    Utils.setStorage("screen", ID)

    wx.navigateBack({
      delta: 1
    })
    console.log(ID)
  }

})