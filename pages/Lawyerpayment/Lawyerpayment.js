
//  引入函数库
var Utils = require("../../utils/util.js");
let data = {
        lvsData: {   // 头部全部的数据
                img: "/images/user.png", // 头像
                ico: "/images/v.png",
                userName: "王律师",  // name
                ages: "3", // 年限
                money: "30", // 钱
                star: "0", // 星星选中的个数
                stars: [ // 星星
                        "",
                        "",
                        "",
                        "",
                        ""
                ],
                blocks: ["", "", ""], // 标签
                disables: null,   // 是否关注
                disablesTest: '关注',
                address: "",   // 地区
        },
        attid: "",     // 律师的id
        openid: "",    // 获取到的openid
        getData: {}    // 加载本地登陆的数据
};

Page({
        data: data,
        onLoad(options) {

                if (options.data != "") {
                        this.setData({
                                attid: options.data
                        })
                }

                this.loadRequest();   // 默认加载接口
                this.loadCode();      // 加载登陆的接口
        },
        onShow() {

        },
        loadRequest() {    // 默认加载接口

                let _this = this;
                let attid = this.data.attid;

                this.setData({
                        getData: wx.getStorageSync("login")
                })

                let josn = {    // 传输的数据
                        uid: _this.data.getData.uid,
                        attid: attid,
                        sdk: _this.data.getData.sdk
                }

                Utils.requestFn({   // 请求的接口
                        url: "/index.php/getpagep?server=1",
                        method: "GET",
                        data: josn,
                        success(res) {
                                let resData = res.data;
                                if (resData.status) {

                                        let Ldetails = resData.data;
                                        let collect = Ldetails.collect;

                                        _this.setData({
                                                lvsData: {
                                                        img: Ldetails.image,
                                                        userName: Ldetails.nickname,
                                                        money: Ldetails.price,
                                                        star: Ldetails.star,
                                                        ages: Ldetails.year,
                                                        stars: ["", "", "", "", ""],
                                                        ico: "/images/v.png",
                                                        blocks: Ldetails.small_class,
                                                        disables: Ldetails.collect,
                                                        disablesTest: collect ? '已关注' : "关注",
                                                        address: Ldetails.address
                                                },

                                        })

                                } else {
                                        Utils.showModal("请求失败")
                                }
                        }
                })
        },
        confirmFn() {    // 点击支付

                let getData = this.data.getData;
                let openid = this.data.openid;
                let attid = this.data.attid;

                let josn = {
                        uid: getData.uid,
                        attid: attid,
                        sdk: getData.sdk,
                        openid: openid,
                }
                Utils.requestFn({   // 请求的接口
                        url: "/index.php/prepayp?server=1",
                        method: "POST",
                        data: josn,
                        success(res) {
                                let resData = res.data;
                                if (resData.status) {
                                        let payModel = resData.data;    // 返回数据 进行微信支付
                                        wx.requestPayment({
                                                'timeStamp': payModel.timeStamp,
                                                'nonceStr': payModel.nonceStr,
                                                'package': payModel.package,
                                                'signType': 'MD5',
                                                'paySign': payModel.paySign,
                                                'success': function (res) {   // 成功的状态
                                                        Utils.reLaunch("支付成功", "/pages/lookLvs/lookLvs")
                                                        return false;
                                                },
                                                'fail': function (res) {      // 失败的状态
                                                        Utils.reLaunch("支付失败", "/pages/lookLvs/lookLvs")
                                                        return false;
                                                }
                                        })
                                } else {
                                        Utils.showModal(resData.message)
                                }
                        }
                })

        },
        loadCode() {   // 加载登陆接口获取登陆信息
                let _this = this;

                let dosdk = this.data.getData.sdk;
                let douid = this.data.getData.uid;

                wx.login({
                        success(res) {
                                if (res.code) {
                                        Utils.requestFn({
                                                url: '/index.php/getopenid?server=1',
                                                method: "POST",
                                                data: {
                                                        code: res.code,
                                                        sdk: dosdk,
                                                        uid: douid
                                                },
                                                success: function (res) {
                                                        _this.setData({
                                                                openid: res.data.data.openid
                                                        })
                                                }
                                        })
                                }
                        }
                })
        }
})