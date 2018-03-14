
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
    guideType: true,                // 指引的状态显示
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
    loadOne:"load", // 记录初次加载的状态
};

let mun = 0;

Page({
    data: data,
    onLoad(parameter) {
        if (parameter.data == "") return false;
        let value = wx.getStorageSync('lvs');
        let app = getApp();
        let mun = app.globalData.loadOne;
        
        if (!value.length) {
            this.setData({ Ndata: true, guideType:false })
        } else {
            this.setData({
                data: value,
                parame: parameter.data,
                Ndata:false
            })
            if (mun == 1) {
                this.setData({ guideType: true });
                app.globalData.loadOne++;
            }else{
                this.setData({ guideType: false })
            }
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
    onPullDownRefresh() {          // 解决下拉不能缩放的BUG
        wx.stopPullDownRefresh()
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
                        if (!types) {   // 需要购买
                            wx.navigateTo({
                                url: `/pages/Lawyerpayment/Lawyerpayment?data=${josn.attid}`
                            })
                        } else {  // 不需要直接打电话
                            wx.makePhoneCall({
                                phoneNumber: telphone
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
    Jump(url) { // 跳转的公共的方法
        wx.redirectTo({
            url: url
        })
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
    guideClick() {
        this.setData({ guideType: false });
    }
})