//  引入函数库
var Utils = require("../../utils/util.js");

var data = {
        indexData: [     // 底部的样式数据
                {
                        text: "首页",
                        cls: "icon-home",
                        ncls: "icon-home1",
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
                        ncls: "",
                        id: "4",
                }
        ],
        dataText: [
                "136****3701购买了颜忠军律师的商品服务！",
                "136****3701购买了颜忠军律师的商品服务！",
                "136****3701购买了颜忠军律师的商品服务！"
        ],
        faqCount: { today: "1000", total: "50000" },   // 在线咨询数据
        layer: { layer: "10000", phone: "500" },   // 一键找律师
        indicatorDots: false,    // swiper 是否显示面板指示点
        autoplay: true,         // swiper 是否自动播放
        interval: 2000,          // swiper 自动切换时间间隔
        duration: 1000,          // swiper 滑动动画时长
        circular: true,          // swiper 是否采用衔接滑动
        vertical: true,          // swiper 滑动方向是否为纵向
        loading: false,            // 加载中的状态
};
Page({
        data: data,
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
                                this.Jump("/pages/LawyersLibrary/LawyersLibrary");
                                break;
                        case "4":
                                this.MyMessage();
                                break;
                }
        },
        MyMessage() {  // 判断有没有登陆的信息
                let login = wx.getStorageSync('login');
                if (login.sdk && login.uid) {
                        this.Jump("/pages/myList/myList");
                } else {
                        wx.navigateTo({url: '/pages/login/login'})
                }
        },
        juzxfn() {   // 在线咨询的跳转
                this.Jump("/pages/Consultation/Consultation");
        },
        onLoad (options) {
                this.setData({ loading: true });
                this.loadData();    // 加载数据
                this.setData({ loading: false });
        },
        loadData() { // 请求接口数据
                let _this = this;

                Utils.requestFn({
                        url: "/index.php?server=1",
                        success(res) {
                                if (res.data.status) {
                                        _this.setData({
                                                dataText: res.data.data.scroll,
                                                faqCount: res.data.data.faqCount,
                                                layer: res.data.data.layer
                                        })
                                } else {
                                        Utils.showModal("数据加载失败");
                                }
                        }
                })

        },
        skipFn1() {    // 跳转咨询
                this.Jump("/pages/Consultation/Consultation");
        },
        skipFn2() {    // 跳转找律师
                // this.Jump("/pages/lookLvs/lookLvs");
                this.Jump("/pages/LawyersLibrary/LawyersLibrary");
        },
        onShareAppMessage(res) {    // 转发
                return {
                        title: '律师帮帮',
                        path: '/pages/home/home'
                }
        },
})