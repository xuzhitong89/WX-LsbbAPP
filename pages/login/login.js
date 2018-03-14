// 走起 我的函数库~
var Utils = require("../../utils/util.js");
var loginArr = {        // 本地存储的手机号、密码
    phone: "",
    pasd: ""
};
var loginJson = {       // 存储登陆返回的信息
    image: "",
    nickname: "",
    sdk: "",
    status: "",
    telphone: "",
    types: "",
    uid: "",
    openid: ""
}
// 默认数据
var defaultData = {
    loginBtnTxt: "登录",
    btndisabled: false,
    btnLoading: false,
    loginBtnBgBgColor: "#577eff",
    checkboxVal: "0",
    pasd: "",    // 密码
    phone: "", // 手机号码
    consulsURl: "",         // 快速咨询跳转的url
    bool: true,
    ztBool: false,   // 点击一键微信登陆按钮的点击状态
    code: ""     // 获取login的code 
    // userphone:""    // 获取到微信权限的手机号                   
}
Page({                                                  // page项
    data: defaultData,
    formSubmit: function (e) {
        var formVal = e.detail.value;
        this.mysubmit(formVal);
    },
    onLoad: function (options) {
        if (JSON.stringify(options) != "{}") {
            this.setData({ consulsURl: options })
        }
        //   页面加载的时候判断 记住手机号密码是否勾选
        var doBool = this.data.bool;
        var loginValue = wx.getStorageSync("success");
        this.loginFn(); // 加载登陆信息的接口
        if (doBool) {
            this.setData({
                phone: loginValue.phone,
                pasd: loginValue.pasd
            })
        } else {
            Utils.removeStorage('success');
        }
    },
    loginFn: function () {     // 判断是否是登陆的状态
        var _this = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    _this.setData({
                        code: res.code
                    })
                } else {
                    Utils.showModal("获取用户登录态失败！");
                }
            }
        });
    },
    hrefFn: function () {  // 点击页面记录跳转
        let Reset = wx.getStorageSync("Reset");
        let getconsta = wx.getStorageSync("NotLogin"); // 获取咨询列表点击更多案例的记录
        let consulsURl = this.data.consulsURl;  // 快速咨询的url
        let redPacket = wx.getStorageSync("redPacket"); // 获取红包的跳转的路径

        if (Reset) {
            wx.redirectTo({               // 跳转别的页面，关闭当前页面
                url: Reset
            })
        } else if (getconsta) {
            // 有咨询列表更多案例的记录，直接跳转VIP的购买页面
            wx.redirectTo({
                url: "/pages/Member/Member"
            })
        } else if (consulsURl.Reset) {
            // 如果是从快速咨询跳转过来，那么返回快速咨询页面
            wx.redirectTo({
                url: consulsURl.Reset
            })
        } else if (redPacket) {
            // 跳转到红包打赏页面
            wx.navigateTo({
                url: "/pages/RedPacket/RedPacket?id=2"
            })
        } else {
            wx.redirectTo({      // 跳转别的页面，关闭当前页面
                url: "/pages/Consultation/Consultation"
            })
        }
    },
    mysubmit: function (param) {                   // 提交
        var _this = this;
        var flag = this.checkPhone(param) && this.checkPassword(param);
        loginArr = {        // 本地存储的手机号、密码
            phone: param.tel,
            pasd: param.pasd
        }
        if (!!flag) {
            var checkVal = param.checkboxval.join("");
            if (!checkVal.length) {
                Utils.removeStorage('success');
            }
            Utils.requestFn({
                url: '/index.php/Login/index?server=1',
                method: "POST",
                data: {         // 传递的参数
                    userphone: param.tel,
                    passwd: param.pasd
                },
                success: function (res) {           // 成功、返回的数据
                    if (res.data.status) {             // 登陆成功
                        Utils.setStorage('success', loginArr);
                        _this.hrefFn();
                        loginJson = {     // 存储登陆状态      
                            image: res.data.data.image,
                            nickname: res.data.data.nickname,
                            sdk: res.data.data.sdk,
                            status: res.data.data.status,
                            telphone: res.data.data.telphone,
                            types: res.data.data.type,
                            uid: res.data.data.uid,
                            openid: res.data.data.xiaochengxuopenid
                        }
                        Utils.setStorage("login", loginJson);     // 存储到本地缓存
                    } else {
                        Utils.showModal(res.data.message);
                        return false;
                    }
                },
                fail: function () {                      // 失败、调取状态 
                    console.log("请求失败")
                    _this.failFn();
                }
            })
        }
    },
    SuccessFn: function () {                 // 验证成功的状态
        this.setData({
            loginBtnTxt: "登陆中",
            btndisabled: true,
            btnLoading: true,
            loginBtnBgBgColor: "#666"
        })
    },
    failFn: function () {                        // 验证失败的状态、回复到默认状态
        this.setData({
            loginBtnTxt: "登陆",
            btndisabled: false,
            btnLoading: false,
            loginBtnBgBgColor: "#e64444",
            checkboxVal: 0
        })
        Utils.showModal("账号密码错误");
        return false;
    },
    checkPhone: function (val) {            // 验证手机号
        var checkVal = Utils.Verification.phone;
        var thisVal = val.tel;
        if (!checkVal.test(thisVal)) {
            Utils.showModal("请输入正确的手机号码");
            return false;
        }
        return true;
    },
    checkPassword: function (val) {          // 验证密码
        var thisVal = val.pasd.trim();
        if (thisVal.length < 6) {
            Utils.showModal("请输入至少6位的密码");
            return false;
        }
        return true;
    },
    checkboxChange: function (e) {            // 记住密码
        var val = e.detail.value;
        Utils.removeStorage('success');
    },
    getPhoneNumber: function (e) {     // 取得授权的手机号码

        this.loginFn();      // 每次点击的获取最新的code
        this.setData({ ztBool: true })  // 点击的时候过程中不让点击
        let iv = e.detail.iv;       // 获取权限的加密iv信息
        let encryptedData = e.detail.encryptedData;  // 获取权限的加密用户信息
        let code = this.data.code;  // 获取login的登陆返回的code

        if (typeof encryptedData == "undefined" && typeof iv == "undefined") {
            Utils.showModal("授权失败");
            this.setData({ ztBool: false }) // 点击的时候过程中不让点击
        } else {
            this.getPhoneRequest(iv, encryptedData, code);  // 执行
        }
    },
    getPhoneRequest: function (iv, encryptedData, code) {    // 请求接口解密用户信息
        var _this = this;
        Utils.requestFn({
            url: '/index.php/wxencrypt?server=1',
            data: {
                content: encryptedData,
                iv: iv,
                code: code
            },
            success: function (res) {
                if (res.data.status) {
                    var userphone = res.data.data.phoneNumber;
                    var openids = res.data.data.openid;
                    _this.getPhoneLoginFn(userphone, openids);   // 穿参请求登录接口
                } else {
                    Utils.showModal(res.data.message);
                }
                _this.setData({      // 点击的时候过程中不让点击
                    ztBool: false
                })
            }
        })
    },
    getPhoneLoginFn: function (mun, openid) {     // 获取登陆手机完成登陆
        var _this = this;
        Utils.requestFn({
            url: '/index.php/phonelogin?server=1',
            method: "POST",
            data: {
                userphone: mun,
                openid: openid
            },
            success: function (res) {
                if (res.data.status) {
                    _this.hrefFn();
                    loginJson = {                // 存储登陆状态      
                        image: res.data.data.image,
                        nickname: res.data.data.nickname,
                        sdk: res.data.data.sdk,
                        status: res.data.data.status,
                        telphone: res.data.data.telphone,
                        types: res.data.data.type,
                        uid: res.data.data.uid,
                        openid: res.data.data.xiaochengxuopenid
                    }
                    Utils.setStorage("login", loginJson);     // 存储到本地缓存
                } else {
                    Utils.showModal(res.data.message);
                }
            }
        })
    },
    onShareAppMessage(res) {    // 转发
        return {
            title: '律师帮帮',
            path: 'pages/login/login'
        }
    },
    enroll() {       // 注册跳转
        wx.redirectTo({               // 跳转别的页面，关闭当前页面
            url: '/pages/forgot_password/forgot_password'
        })
    }
})