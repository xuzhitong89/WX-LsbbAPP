var Utils = require("../../utils/util.js");

var data = {
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
    logoDatas: [   // 导航的数据
        {
            test: "婚姻家庭",
            id: "hycc",
            img: "/images/c5.png"
        },
        {
            test: "劳动人事",
            id: "ldrs",
            img: "/images/c8.png"
        },
        {
            test: "房产土地",
            id: "fctd",
            img: "/images/c2.png"
        },
        {
            test: "交通事故",
            id: "jtsg",
            img: "/images/c6.png"
        },
        {
            test: "借贷债务",
            id: "jdzw",
            img: "/images/c7.png"
        },
        {
            test: "合同纠纷",
            id: "htjf",
            img: "/images/c4.png"
        },
        {
            test: "损害赔偿",
            id: "shpc",
            img: "/images/c9.png"
        },
        {
            test: "公司设立",
            id: "gssl",
            img: "/images/c11.png"
        },
        {
            test: "消费维权",
            id: "xfwq",
            img: "/images/c3.png"
        },
        {
            test: "商标注册",
            id: "sbzc",
            img: "/images/c10.png"
        },
        {
            test: "保险理赔",
            id: "bxlp",
            img: "/images/c1.png"
        },
        {
            test: "医疗纠纷",
            id: "yljf",
            img: "/images/c12.png"
        },
    ]
};
Page({
    data: data,
    onLoad: function (options) {
        console.log("aaa")
    },
    T_dataFn(e) {   // 跳转的页面数据传输
        var value = wx.getStorageSync('details');
        var eId = e.currentTarget.id;
        var josn = {
            sdk: value.sdk,
            uid: value.uid,
            small: eId
        }
        this.request(josn);
    },
    request(josn) {
        Utils.requestFn({
            url: "/index.php/quickl?server=1",
            method: "GET",
            data: josn,
            success(res) {
                if (res.data.status) {
                    Utils.setStorage("lvs", res.data.data);

                    wx.navigateTo({
                        url: `/pages/RecommendLsv/RecommendLsv?data=${josn.small}`
                    })
                } else {
                    Utils.showModal("请求失败")
                }
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
                this.Jump("/pages/lookLvs/lookLvs");
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
    categoriesFn() {   // 跳转到律师库
        wx.navigateTo({
            url: '/pages/LawyersLibrary/LawyersLibrary'
        })
    },
    onShareAppMessage(res) {    // 转发
        return {
            title: '律师帮帮',
            path: '/pages/lookLvs/lookLvs'
        }
    },
})