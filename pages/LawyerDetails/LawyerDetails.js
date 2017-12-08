
let Utils = require("../../utils/util.js"); //  引入函数库

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
                blocks: "", // 标签
                disables: null,   // 是否关注
                disablesTest: '关注',
                address: "", // 地区
        },
        address: "",   // 地区
        description: "",   // 律师简介
        count: [     // 服务人次好评
                {
                        num: "",
                        txt: ""
                },
                {
                        num: "",
                        txt: ""
                },
                {
                        num: "",
                        txt: ""
                }
        ],
        appraise_allcount: "",   // 律师评价个数
        appraise: "",      // 律师评价的标签
        appraiseList: [],   // 律师评价下面列表
        markStars: ["", "", "", "", ""],  // 律师评价下面列表星星
        downs: false,    // 显示展开详情
        isHeight: false,   // 点击展开
        downTest: "展开详情",  // 展开详情
        attid: "",       // 律师的uid
        Ldetails: {},    // 详情数据
        loading: false,    // 加载
        Firm1: "",    // 律所
        Firm2: "",    // 证号
        Firm3: "",   // 地址
};

let timer = null;

Page({
        data: data,
        onLoad: function (data) {
                let Ldetails = wx.getStorageSync("Ldetails");
                if (!Ldetails) {
                        Utils.showModal("没有数据哎");
                } else {
                        this.setData({ attid: data.attid, Ldetails: Ldetails, loading: true })
                        this.loadData();
                        this.setData({ loading: false })
                }
        },
        loadData() {   // 加载渲染数据

                let Ldetails = this.data.Ldetails;
                let collect = Ldetails.collect;

                this.setData({    // 头部的信息数据
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
                        address: Ldetails.address,
                        description: Ldetails.description,
                        count: Ldetails.count,
                        appraise_allcount: Ldetails.appraise_allcount,
                        appraise: Ldetails.appraise,
                        appraiseList: Ldetails.appraiseList,
                        Firm1: Ldetails.practice_address,
                        Firm2: Ldetails.practice_number,
                        Firm3: Ldetails.lvsuo
                })
                this.commonData();
        },
        commonData() {   // 公共获取律师简介的处理

                let data = this.data.description;
                if (data == "") return false;

                let re = /.[^\s]+/g;
                let sting = '';
                data.match(re).forEach((item) => { sting += item });
                this.setData({ downs: sting.length > 75 })
        },
        downFn() { // 点击展开收起
                let isHeight = this.data.isHeight;
                this.setData({ isHeight: true, downTest: "点击向上收起" })
                if (isHeight) {
                        this.setData({ isHeight: false, downTest: "展开详情" })
                }
        },
        lvsFollow() {    // 关注，利用异步原理获取到数据并且刷新
                var _this = this;
                this.againDta();
                this.setRequest().then(function (data) {
                        if (data) {
                                _this.setData({ Ldetails: data })
                                _this.loadData();
                        }
                })
        },
        againDta() {     // 关注请求数据
                let getVal = wx.getStorageSync('login');
                let attid = this.data.attid;
                let _this = this;
                if (!!getVal.openid) {
                        Utils.requestFn({
                                url: "/index.php/collecta?server=1",
                                method: "POST",
                                data: {
                                        uid: getVal.uid,
                                        sdk: getVal.sdk,
                                        attid: attid
                                },
                                success(res) {
                                        if (!res.data.status) {
                                                Utils.reLaunch(res.data.message, "/pages/login/login");
                                        }
                                }
                        })
                } else {
                        wx.navigateTo({ url: '/pages/login/login' })
                }
        },
        onUnload: function () {  // 每次离开页面清空数据
                Utils.setStorage("Ldetails", "");
        },
        setRequest() {    // 请求律师详情的接口刷新本地存储的数据
                let details = wx.getStorageSync("login");
                let uid = this.data.attid;
                let josn = {
                        attid: uid,
                        uid: details.uid,
                        sdk: details.sdk
                };
                let load = new Promise(function (resolve, reject) {
                        Utils.requestFn({
                                url: "/index.php/layerdetail?server=1",
                                data: josn,
                                success(res) {
                                        let rData = res.data;
                                        if (rData.status) {
                                                Utils.setStorage("Ldetails", rData.data);
                                                resolve(rData.data);
                                        } else {
                                                Utils.showModal("再刷新一下啦，页面报错啦");
                                        }
                                }
                        })
                })
                return load;
        },
        Consultation(e) {   // 电话咨询跳转

                let res = wx.getStorageSync('login');
                let telphone = e.currentTarget.dataset.telphone;
                let attid = this.data.attid;
                var josn = {
                        uid: res.uid,
                        sdk: res.sdk,
                        attid: attid,
                };

                if (!res.openid){
                        wx.navigateTo({ url: '/pages/login/login' })
                }else{
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
                }
               
        },
        MoreFn() {   // 点击更多评价

                let aList = this.data.appraiseList;
                let _this = this;
                if (aList.length > 5) return false;

                clearTimeout(timer);
                this.MoreData().then(function (data) {
                        _this.setData({ appraiseList: aList.concat(data) });
                        timer = setTimeout(function () {
                                if (wx.pageScrollTo) {
                                        wx.pageScrollTo({
                                                scrollTop: 999999
                                        })
                                }
                        }, 300)
                });
        },
        MoreData() {   // 请求更多评价接口
                let attid = this.data.attid;
                let promise = new Promise((resolve, reject) => {
                        Utils.requestFn({
                                url: "/index.php/allcomment?server=1",
                                data: { attid: attid },
                                success(res) {
                                        let resData = res.data;
                                        if (resData.status) {
                                                resolve(resData.data)
                                        } else {
                                                Utils.showModal("在点击一下啦");
                                        }
                                }
                        })
                })
                return promise;
        },
        onShareAppMessage(res) {    // 转发
                return {
                        title: '律师帮帮',
                        path: '/pages/LawyerDetails/LawyerDetails'
                }
        },
})