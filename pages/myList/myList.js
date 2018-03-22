
var Utils = require("../../utils/util.js");
// 加载地图
var map = require('../../map/mappos.js');

var commData = {
    indexData: [     // 底部的样式数据
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
            ncls: "",
            id: "3",
        },
        {
            text: "我的",
            cls: "icon-tag-wode-weixuanzhong",
            ncls: "icon-tag-wode-xuanzhong",
            id: "4",
        }
    ],
    image: "/images/user.png",       // 头像
    usrename: "路人",            // 姓名
    positions: "北京",      // 默认位置
    pos: 1,      // 判断是不是定位中的状态
    sex: "男",     //性别
    news: "0"       // 是否有消息
}
Page({
    data: commData,
    onLoad: function () {
        const _this = this;
        this.getStorage();       // 加载登陆的信息
        this.newsFn();          // 请求登陆信息 获取消息中心的推送

        const positions = wx.getStorageSync("position-type");
        if (!positions || positions == null) {
            this.coordinate().then((data) => {
                if (data) {
                    _this.posFn();
                }
            });
        } else {
            _this.posFn();
        }
    },
    onShow: function () {  // 显示的时候加载数据
        this.PersonalCenter();
        this.newsFn();          // 请求登陆信息 获取消息中心的推送
    },
    posFn: function () {
        let pos = wx.getStorageSync("position-type");
        if (pos) {
            this.setData({ positions: pos.split("-")[0] })
        } else {
            this.setData({ positions: "定位失败" })
        }
    },
    getStorage: function () {
        var _this = this;
        var commDatas = _this.data;
        var loginData = wx.getStorageSync("login");
        var imageSrc = loginData.image != null ? loginData.image : commDatas.image;
        var nickname = loginData.nickname != null ? loginData.nickname : commDatas.usrename

        this.setData({
            image: imageSrc,
            usrename: nickname
        })
    },
    JumpFn: function () {            // 跳转
        wx.redirectTo({
            url: '/pages/Consultation/Consultation'
        })
    },
    xgUserFn: function () {   // 跳转
        wx.navigateTo({
            url: '/pages/myListModify/myListModify'
        })
    },
    PersonalCenter: function () {  // 获取修改的个人信息
        var loginData = wx.getStorageSync("login");
        var _this = this;
        Utils.requestFn({
            url: '/index.php/modifygetuser?server=1',
            data: {
                sdk: loginData.sdk,
                uid: loginData.uid
            },
            success: function (res) {
                var res = res.data.data.user;
                var imageSrc = res.image != null ? res.image : _this.data.image;

                if (res.email != null) {
                    _this.setData({
                        image: imageSrc,
                        usrename: res.nickname,
                        sex: res.sex_txt
                    })
                }

            }
        })
    },
    onNews: function () {
        wx.navigateTo({
            url: '/pages/myListStatic/news/news'
        })
    },
    newsFn: function () {  // 请求登陆消息接口的推送
        var _this = this;
        var loginData = wx.getStorageSync("login");
        Utils.requestFn({
            url: '/index.php/profile?server=1',
            data: {
                sdk: loginData.sdk,
                uid: loginData.uid
            },
            success: function (res) {
                var resData = res.data.data.msgcount;
                _this.setData({
                    news: resData
                })
            }
        })
    },
    onOrder: function () {   // 跳转到咨询的订单列表
        wx.navigateTo({
            url: '/pages/myListStatic/order/order'
        })
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
                this.Jump("/pages/LawyersLibrary/LawyersLibrary?tab=1");
                break;
            case "4":
                this.Jump("/pages/myList/myList");
                break;
        }
    },
    setupFn() {  // 设置页面的跳转
        wx.navigateTo({
            url: '/pages/setUp/setUp'
        })
    },
    opinionFn() {  // 意见反馈的跳转
        wx.navigateTo({
            url: '/pages/static/feedback/feedback'
        })
    },
    coordinate() {   // 页面初始的时候请求位置
        let _this = this;
        let p = new Promise((success) => {
            let qqmapsdk = map.map();
            qqmapsdk.reverseGeocoder({
                complete: function (res) { // 获取位置成功返回
                    if (res.result) {
                        var province = res.result.address_component.province;   // 省
                        var city = res.result.address_component.city;   // 市
                        var district = res.result.address_component.district;   // 区
                        province = province.substring(0, province.length - 1);  // 去掉“省”的后缀
                        city = city.substring(0, city.length - 1);       // 去掉“市”的后缀
                        Utils.setStorage("position-type", `${province}-${city}-${district}`);
                        success(true);
                    }
                },
                fail: function (res) {  // 获取位置失败
                    Utils.showModal("获取位置失败网络错误");
                    Utils.setStorage("position-type", "")
                    _this.coordinate();
                }
            })
        })
        return p;
    },
})