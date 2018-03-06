
var Utils = require("../../utils/util.js");

var data = {
        animationData: {},   // 动画
        data: [],        // 接收的本地的数据
        parame: "",      // 传递的参数名字缩写
        Stars: [     // 星星
                "",
                "",
                "",
                "",
                ""
        ],
        indexData: [   // 底部数据
                {
                        text: "首页",
                        cls: "icon-home",
                        ncls: "",
                        id: "1",
                },
                {
                        text: "咨询",
                        cls: "icon-zixunweixuanzhongzhuangtai",
                        ncls: "",
                        id: "2",
                },
                {
                        text: "找律师",
                        cls: "icon-sourencai-weixuanzhong",
                        ncls: "icon-sourencai-xuanzhong",
                        id: "3",
                },
                {
                        text: "我的",
                        cls: "icon-tag-wode-weixuanzhong",
                        ncls: "",
                        id: "4",
                }
        ],
        Ndata: false,  // 没有数据显示
};

let mun = 0;

Page({
        data: data,
        onLoad(parameter) {
                if (parameter.data == "") return false;

                let value = wx.getStorageSync('lvs');
                if (!value.length) {
                        this.setData({ Ndata: true })
                } else {
                        this.setData({
                                data: value,
                                parame: parameter.data,
                                Ndata: false
                        })
                }
        },
        onShow() {
                var value = wx.getStorageSync('lvs');
                this.setData({
                        data: value
                })
        },
        onUnload: function () {  // 每次离开页面清空数据
                Utils.setStorage("lvs", "");
        },
        getData() {
                return wx.getStorageSync('login');
        },
        request() {     // 请求接口进行刷新
                let value = wx.getStorageSync('login');
                var josn = {
                        sdk: value.sdk,
                        uid: value.uid,
                        small: this.data.parame
                }
                Utils.requestFn({
                        url: "/index.php/quickl?server=1",
                        data: josn,
                        success(res) {
                                if (res.data.status) {
                                        Utils.setStorage("lvs", res.data.data);
                                } else {
                                        Utils.showModal("请求失败")
                                }
                        }
                })
        },
        fllowFn(e) { // 关注

                var _this = this;
                let value = wx.getStorageSync("login");
                var lvs = wx.getStorageSync('lvs');

                let obj = {   // 请求的数据
                        attid: e.target.id,
                        uid: value.uid,
                        sdk: value.sdk
                }
                Utils.requestFn({   // 请求关注的接口
                        url: "/index.php/collecta?server=1",
                        method: "POST",
                        data: obj,
                        success(res) {
                                var status = res.data.status;
                                if (status) {
                                        _this.request();
                                        _this.setData({
                                                data: lvs,
                                        })
                                }
                        }
                })
        },
        TconsultationFn(e) {    // 电话咨询
                var res = this.getData();
                let value = wx.getStorageSync("login");
                let telphone = e.currentTarget.dataset.telphone;
                var josn = {
                        uid: res.uid,
                        sdk: res.sdk,
                        attid: e.currentTarget.id
                };
                if (!!value.openid) {
                        Utils.requestFn({
                                url: "/index.php/checkp?server=1",
                                data: josn,
                                success(res) {
                                        var types = res.data.data;
                                        if (res.data.status) {
                                                if (types) {   // 需要购买
                                                        wx.navigateTo({
                                                                url: `/pages/Lawyerpayment/Lawyerpayment?data=${josn.attid}`
                                                        })
                                                } else {  // 不需要直接打电话
                                                        wx.makePhoneCall({
                                                                phoneNumber: telphone,
                                                                success(res) {
                                                                        Utils.showModal("欧耶，成功啦！")
                                                                },
                                                                fail(res) {
                                                                        Utils.showModal("sorry,失败啦！")
                                                                }
                                                        })
                                                }
                                        } else {
                                                Utils.reLaunch(res.data.message, "/pages/login/login")
                                        }
                                }
                        })
                } else {
                        wx.navigateTo({ url: '/pages/login/login' })
                }

        },
        start(e) {
        },
        move(e) {
        },
        end(e) {
        },
        tab(e) {  // 点击切换

                this.setData({
                        value: e.currentTarget.id
                })
                var animation = wx.createAnimation({
                        duration: 300,
                        timingFunction: "linear"
                });

                this.animation = animation;
                this.animation.translateX(-500).scale(1, 1).step();

                this.setData({
                        animationData: this.animation.export()
                });
                mun++;
                setTimeout(function () {
                        var cardInfoList = this.data.data;
                        this.animation.translateX(0).step();

                        var slidethis = cardInfoList[mun % 3];
                        cardInfoList.push(slidethis);
                        this.setData({
                                animationData: this.animation.export(),
                                data: cardInfoList
                        });

                }.bind(this), 500)

        },
        Jump(url) { // 跳转的公共的方法
                wx.redirectTo({
                        url: url
                })
        },
        tabFn(e) {   // 切换链接
                let id = e.currentTarget.id;
                switch (id) {
                        case "1":
                                this.Jump("/pages/home/home");
                                break;
                        case "2":
                                this.Jump("/pages/Consultation/Consultation");
                                break;
                        case "3":
                                this.Jump("/pages/lookLvs/lookLvs");
                                break;
                        case "4":
                                this.MyMessage();
                                break;
                }
        },
        MyMessage() {  // 判断有没有登陆的信息
                let login = wx.getStorageSync('login');
                if (login) {
                        this.Jump("/pages/myList/myList");
                } else {
                        this.Jump("/pages/login/login");
                }
        },
        skipFn() {   // 点击我跳转律师库
                this.Jump("/pages/LawyersLibrary/LawyersLibrary")
        },
})