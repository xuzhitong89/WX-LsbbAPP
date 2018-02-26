//再刷新一下啦，页面报错啦走起 我的函数库~
var Utils = require("../../utils/util.js");
// 加载地图
var map = require('../../map/mappos.js');

let page = 1;       // 页数

let distance1 = 0;    // 滚动的距离
let distance2 = 0;    // 时间滚动的距离
let timer = null;     // 定时器

// 默认加载数据
let defaultData = {
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
                        ncls: "icon-zixun1",
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
        results: [], // 加载默认的数据
        value: "0",  //nav点击的时候对应的value 
        doVal: false,   // 隐藏显示二级弹层
        newNavArrays: [],  //  获取的是更多案例的数据
        newNavArray: ["最新", "最热", "更多案例"],  //  加载的默认数据
        newMoreData: "",   // 存放更多的案例的list数据的id
        isToggle: true,    // 下拉的时候隐藏快速提问的弹层
        loading: false,  // 加载中的状态
        firstLoad:false,       // 初次加载 
        MemberVip: null,    // 是否购买了VIP   
}
Page({
        data: defaultData,
        onLoad (options) {
                // 加载的时候显示默认的图片
                this.loadDatas();
        },
        loadDatas(){       // 加载本地储存的数据
                const positions = wx.getStorageSync("position-type").split("-")[2];
                const defaultMores = wx.getStorageSync("defaultMore");

                if (!positions || positions== null) {
                        this.coordinate();      // 加载定位城市的位置
                }
                if (!defaultMores) {
                        this.defaultMore();   // 默认加载的获取更多案例的数据
                } else {
                        this.setData({ newNavArrays: defaultMores })
                }
                this.oneReqLoads();  // 加载最新的数据接口
        },
        onPullDownRefresh () {          // 解决下拉不能缩放的BUG
                wx.stopPullDownRefresh()
        },
        onShow() { // 页面跳转过来不刷新页面获取到更多的key的id
                let _this = this;
                wx.getStorage({
                        key: 'screen',
                        success: function (res) {
                                let screen = res.data;
                                if (screen) {
                                        _this.setData({ newMoreData: screen, doVal: false })
                                        _this.emptyData();
                                        _this.defaultRequestFn({ name: screen })
                                } 
                        }
                })
        },
        coordinate() {   // 页面初始的时候请求位置
                var _this = this;
                var qqmapsdk = map.map();
                qqmapsdk.reverseGeocoder({
                        complete: function (res) { // 获取位置成功返回
                                if (res.result) {
                                        var province = res.result.address_component.province;   // 省
                                        var city = res.result.address_component.city;   // 市
                                        var district = res.result.address_component.district;   // 区
                                        province = province.substring(0, province.length - 1);  // 去掉“省”的后缀
                                        city = city.substring(0, city.length - 1);       // 去掉“市”的后缀
                                        Utils.setStorage("position-type", `${province}-${city}-${district}`)
                                }
                        },
                        fail: function (res) {  // 获取位置失败
                                Utils.showModal("获取位置失败网络错误");
                                Utils.setStorage("position-type", "")
                                _this.coordinate();
                        }
                })
        },
        onReachBottom () {   // 下拉加载触发

                let value = this.data.value;    // 获取到导航的每个id
                let doID = this.data.newMoreData; // 获取到点击之后更多案例的list下每个id

                page++;   // 每次滚动的时候页数增加
                this.setData({ isToggle: false })   // 滚动控制快速提问的弹层隐藏

                switch (value) {
                        case "0":   // 最新的排序数据
                                this.defaultRequestFn({ page: page });
                                break;
                        case "1": // 最热的排序数据
                                this.defaultRequestFn({ id: 2, page: page });
                                break;
                        default:
                                this.defaultRequestFn({ name: doID, id: 1, page: page });
                }
        },
        jumpFn (event) { // 点击进入详情
                var DoId = event.currentTarget.id;          // 发送的对应详情的唯一ID值
                var datas = "";
                var loginDatas = wx.getStorageSync("login");    // 获取登陆信息
                var loginJosn = {};
                var bool = event.currentTarget.dataset.bool;
                if (bool){
                        Utils.showModal("50元以上的付费咨询仅发布人和律师可看");
                        return false;
                }
                Utils.requestFn({
                        url: '/index.php/consultdetail?server=1',
                        data: {
                                sdk: loginDatas.sdk || "",
                                uid: loginDatas.uid || '',
                                id: DoId
                        },
                        success: function (res) {
                                // 记录一下传入详情的值，为详情刷新做准备
                                loginJosn = { id: DoId }
                                Utils.setStorage("details", loginJosn)      // 存储律师的
                                Utils.setStorage("LawyerParticulars", res.data.data)  // 改为本地储存数据
                                wx.navigateTo({
                                        url: "/pages/Consultation_details/Consultation_details"
                                })

                        }
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
                        wx.navigateTo({ url: '/pages/login/login' })
                }
        },
        defaultMore() {// 获取更多案例接口的数据
                var _this = this;
                Utils.requestFn({
                        url: '/index.php/faqcata?server=1',
                        success(res) {
                                let record = res.data;
                                let objData = record.data;
                                if (record.status) {
                                        Utils.setStorage("defaultMore", objData);
                                        _this.setData({newNavArrays: objData })
                                } else {
                                        Utils.showModal("再刷新一下啦，页面报错啦");
                                }
                        }
                })

        },
        emptyData() {   // 清空数据
                this.setData({ results: [] });    // 清空数据
                page = 1; // 回复默认页数
        },
        newNavFn(event) {   // 点击导航切换请求接口更新
                this.setData({ value: event.currentTarget.id });
                this.commonNewNavFn(event.currentTarget.id)
                let doVal = this.data.doVal;

                if (event.currentTarget.id == 2) {
                        this.setData({ doVal: !doVal });
                } else {
                        if (doVal) {
                                this.setData({ doVal: false });
                        }
                }
        },
        commonNewNavFn(value) {  // 点击导航切换请求接口更新 => 封装
                switch (value) {
                        case "0":   // 最新的排序数据
                                this.emptyData();
                                this.defaultRequestFn({ page: 1 });
                                break;
                        case "1": // 最热的排序数据
                                this.emptyData();
                                this.defaultRequestFn({ id: 2, page: 1 });
                                break;
                }
        },
        LayerFn(event) {    // 点击很多案例的数据选项
                this.setData({ doVal: false })
                let login = wx.getStorageSync('login');
           
                if (!!login.openid) {    // 判断是够登陆了
                   
                        let _this = this;
                        let doID = event.target.id;
                        let MemberVip = this.data.MemberVip;

                        // 判断是否购买了VIP
                        if (!MemberVip) {
                                wx.navigateTo({ url: "/pages/Member/Member" })
                        } else {
                                this.setData({ newMoreData: doID, doVal: false })
                                this.emptyData();
                                this.defaultRequestFn({ name: doID });
                        }
                } else {
                        console.log("失败" + login)
                        console.log("失败" + login.openid)
                        wx.navigateTo({url: "/pages/login/login" })
                }
        },
        defaultRequestFn({ name = '', id = 1, page = 1 } = {}) {
                let login = wx.getStorageSync('login');
                var _this = this;
                this.setData({ loading: true })
                Utils.requestFn({
                        url: '/index.php/consult?server=1',
                        data: {
                                small: name,
                                order: id,
                                p: page,
                                uid: login.uid,
                                sdk: login.sdk
                        },
                        success: function (res) {
                                _this.setData({ loading: false })
                                let redata = res.data.data.list;
                                let revip = res.data.data.vip;

                                _this.setData({
                                        results: _this.data.results.concat(redata),
                                        MemberVip: revip
                                })
                        }
                })
        },
        quiz() {   // 跳转到快速提问
                wx.navigateTo({url: "/pages/addimages/addimages" })
        },
        screenFn() { // 点击更多跳转
                this.setData({ doVal: false })
                let MemberVip = this.data.MemberVip;
                let login = wx.getStorageSync('login');

                if (!!login.openid) {
                        if (!MemberVip) {
                                wx.navigateTo({ url: "/pages/Member/Member" })
                        } else {
                                wx.navigateTo({ url: "/pages/screen/screen" })
                        }
                }else{
                        wx.navigateTo({ url: "/pages/login/login" })
                }
        },
        onPageScroll(res) {   // 滚动的事件

                this.setData({ isToggle: false })
                distance1 = res.scrollTop;
                clearTimeout(timer);

                timer = setTimeout(function () {
                        distance2 = res.scrollTop;
                        this.setData({ isToggle: distance1 == distance2 })
                }.bind(this), 1000)
        },
        onShareAppMessage(res) {    // 转发
                return {
                        title: '律师帮帮',
                        path: '/pages/Consultation/Consultation'
                }
        },
        oneReqLoads(){           // 初次加载默认的数据
                let login = wx.getStorageSync('login');
                var _this = this;
                this.setData({ firstLoad: true })
                Utils.requestFn({
                        url: '/index.php/consult?server=1',
                        data: {
                                small: "",
                                order: 1,
                                p: 1,
                                uid: login.uid,
                                sdk: login.sdk
                        },
                        success: function (res) {
                                _this.setData({ firstLoad: false })
                                let redata = res.data.data.list;
                                let revip = res.data.data.vip;
                                _this.setData({
                                        results: _this.data.results.concat(redata),
                                        MemberVip: revip
                                })
                        }
                })
        }
})
