//  引入函数库
var Utils = require("../../utils/util.js");
var payModel = {};
// 定义数据
var data = {
    Marr: ['2', '5', '8', '18', '28', '58'],   // 打赏的金额
    value: "2",   // 选中的id、进行对比
    money: "",  // 选中的金钱
    close: false,  // 是否关闭其他金额的弹层
    imageSrc: "/images/user.png",    // 打赏头像
    imageName: "你瞅啥",   // 打赏name
    dataJson: "",        // load过来的数据
    txmoeny: "",     // 其他金额输入值
    ismoney: "0",    // 判断金额是否正确
}
Page({
    data: data,
    onLoad: function (options) {
        // 清除红包路径
        Utils.removeStorage("redPacket");
        let redPacketData = wx.getStorageSync("redPacketData");
        this.setData({
            dataJson: redPacketData
        })
        this.loadValue(this.data.dataJson); // 加载数据

    },
    loadValue(obj) {  // 点击红包进来加载头像、name
        var _this = this;
        this.setData({
            imageSrc: obj.img,
            imageName: obj.name,
            money: _this.data.Marr[_this.data.value].split("元")[0]
        })
    },
    actionFn(event) {   // 选择金额
        var Doid = event.currentTarget.id;
        var Marr = this.data.Marr;

        this.setData({
            value: Doid,
            money: Marr[Doid].split("元")[0]
        })
    },
    otherFn() {    // 其他金额
        this.setData({ close: true });
    },
    closeFn() {     //关闭其他金额的弹层 
        this.setData({ close: false });
    },
    smReward() {   // 确定支付
        var money = this.data.money;
        this.request(money);
    },
    request(money) {    // 请求接口
        var _this = this;
        let login = wx.getStorageSync("login");
        let redPacketData = wx.getStorageSync("redPacketData");
        Utils.requestFn({ // 重新获取数据
            url: '/index.php/redfaq?server=1',
            method: "POST",
            data: {
                sdk: login.sdk,
                uid: login.uid,
                faqid: redPacketData.faqid,
                ansid: redPacketData.ansid,
                attid: redPacketData.attid,
                money: money,
                openid: login.openid,
            },
            success: function (res) {
                if (res.data.status) {
                    //  返回的支付信息
                    var data = res.data.data;
                    payModel = {
                        appId: data.appId,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        paySign: data.paySign,
                        signType: data.signType,
                        timeStamp: data.timeStamp
                    }
                    _this.requestPayment(payModel);
                } else {
                    Utils.showModal(res.data.message);
                }
            }
        })
    },
    sumbtn() { // 其他金额塞钱
        var isBool = this.data.ismoney;
        var txmoeny = this.data.txmoeny
        if (isBool) {
            this.request(txmoeny);
        } else {
            Utils.showModal("请输入正确的金额、谢谢");
        }
    },
    inputFn(e) {    // 输入金额
        var value = e.detail.value;
        var re = Utils.Verification.money;
        this.setData({
            ismoney: re.test(value),
            txmoeny: value
        })
    },
    requestPayment(payModel) {
        //  获取微信支付的数据
        wx.requestPayment({
            'timeStamp': payModel.timeStamp,
            'nonceStr': payModel.nonceStr,
            'package': payModel.package,
            'signType': 'MD5',
            'paySign': payModel.paySign,
            "total_fee": "8",
            'success': function (res) {   // 成功的状态
                wx.navigateBack({
                    delta: 2
                })
            },
            'fail': function (res) {      // 失败的状态
                // wx.reLaunch({      // 跳转别的页面，关闭当前页面
                //         url: "/pages/Consultation_details/Consultation_details"
                // })
                wx.navigateBack({
                    delta: 2
                })
            }
        })
    },
})