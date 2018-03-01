let Utils = require("../../utils/util.js");

let data = {
        user: {   // 头部显示的用户的信息
                images: "/images/user.png",  // 头像
                name: "用户",    // 姓名
        },
        browse: [  // 浏览的数据
                {
                        text: "3天任意浏览",
                        money: "￥8",
                        id: "vip1"
                },
                {
                        text: "1月任意浏览",
                        money: "￥18",
                        id: "vip2"
                },
                {
                        text: "3月任意浏览",
                        money: "￥28",
                        id: "vip3"
                }
        ],
        record: {},    // 获取登陆的数据结果
        value: "0"   // 当前选中的状态
};
Page({
        data: data,
        onLoad(options) {
                this.loadData();   // 加载数据
        },
        loadData() {   // 加载本地储存的login的数据
                const userData = wx.getStorageSync("login");
                // 删除更多案例记录指定的字段
                wx.removeStorageSync("NotLogin")
                this.setData({
                        user: {
                                images: userData.image,
                                name: userData.nickname,
                        },
                        record: userData
                })
        },
        browseFn(event) {    // 点击切换
                let ID = event.currentTarget.dataset.id;
                let NAME = event.currentTarget.dataset.name;
                this.setData({ value: ID })
        },
        confirm() {
                const datas = this.data.record;
                const index = this.data.value;
                const types = this.data.browse[index].id;

                const obj = {
                        uid: datas.uid,
                        sdk: datas.sdk,
                        openid: datas.openid,
                        type: types
                }
                this.onRequest(obj)
        },
        onRequest(obj) {    // 请求vip购买
                Utils.requestFn({
                        url: "/index.php/vipbuy?server=1",
                        method: "POST",
                        data: obj,
                        success(res) {
                                if (res.data.status) {
                                        let payModel = res.data.data;    // 返回数据 进行微信支付
                                        wx.requestPayment({
                                                'timeStamp': payModel.timeStamp,
                                                'nonceStr': payModel.nonceStr,
                                                'package': payModel.package,
                                                'signType': 'MD5',
                                                'paySign': payModel.paySign,
                                                'success': function (res) {   // 成功的状态
                                                        Utils.reLaunch("支付成功", "/pages/Consultation/Consultation")
                                                        return false;
                                                },
                                                'fail': function (res) {      // 失败的状态
                                                        Utils.reLaunch("支付失败", "/pages/Consultation/Consultation")
                                                        return false;
                                                }
                                        })
                                } else {
                                        Utils.showModal(res.data.message)
                                }
                        }
                })
        },
        information() {    // 跳转VIP服务规则

                wx.navigateTo({
                        url: '/pages/myListStatic/VIPinformation/VIPinformation'
                })
        }
})