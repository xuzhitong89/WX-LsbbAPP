var Utils = require("../../utils/util.js");
const ctx = wx.createCanvasContext('myCanvas'); // 压缩图片
let timer = null;

// 整个录音的api
const recorderManager = wx.getRecorderManager();

let datalist = {
    textareaFocus: false,                              // 文本域的自动调取键盘
    doVoice: true,    // 语音的弹出层
    textareaVal: "",                                     // 文本域的val
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 4,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    successArr: [],      // 存储上传返回的img的url =>发送的数据
    questions: {},        // 提交数据存储到本地的josn
    bool: true,  // 是否通过上传的权限
    mun: 0,
    tempFilePath: "",   // 录音文件
    icos: [      // 底部的ico
        {
            class: "icon-weibiaoti118",
            id: "0"
        },
        {
            class: "icon-yuyin",
            id: "1"
        }
    ],
    value: "1",    // 底部的默认选中的状态
    dataTouch: { // 底部的语音数据
        texts: "按住说话",  // 文本
        data: false,  // 判断按住的是否选中
    },
    heightmun: "130rpx",
    placeholder: "您好，请详细描述你的问题...",    // 默认的显示的提示文本
    switchs: false,      // 转换文字的时候 不能点击的遮罩层
    LoadData: "语音识别中...."          // 语音转换文字的时候加载
}
Page({
    data: datalist,
    onLoad(options) {
        // 页面初始化 options为页面跳转所带来的参数
        Utils.removeStorage("tw");
    },
    submitFn() {   // 提交数据
        let Reset = `/pages/questions/questions`;
        var _this = this;
        // 获取到  textarea的val
        var textareaVal = this.data.textareaVal;
        // 获取到上传成功返回的img的src the list
        var imgsList = this.data.successArr;
        // 获取到本地存储的数据
        var questions = _this.data.questions;
        // 提交的数据 不为空的话 那么就存储到本地

        if (textareaVal.trim() != "") {
            questions.textareaVal = textareaVal;
            questions.url = imgsList;
            Utils.setStorage("tw", questions);

            var value = wx.getStorageSync('login');
            if (value.sdk && value.uid) {
                wx.navigateTo({ url: '/pages/questions/questions' })
            } else {
                wx.redirectTo({ url: `/pages/land/land?Reset=${Reset}` })
            }
        } else {
            Utils.showModal("问题不能空");
            return false
        }
    },
    textareaFn(ev) {        // 输入动态获取textarea的value
        this.setData({
            textareaVal: ev.detail.value
        })
    },
    chooseimage(e) {
        this.chooseImageFn();   // 上传的fn
    },
    chooseImageFn() {   // 上传的fn
        var _this = this;
        var len = _this.data.len;   // 获取data的上传的总个数
        var mun = _this.data.index;  // 获取data的上传完成的个数
        var arr = _this.data.arrimg;         // 获取data的img的list 
        var suArr = _this.data.successArr; // 存储上传返回的img的src

        // 调取手机的上传
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {       // 成功
                console.log(res)
                var tempFilePaths = res.tempFilePaths[0].toString();
                len == mun ? mun = 4 : mun++;
                if (_this.data.index <= 3) {// 上传之前的验证个数
                    arr.push(tempFilePaths);
                    _this.setData({
                        arrimg: arr,
                        index: mun
                    })
                    wx.uploadFile({   // 上传
                        url: Utils.url + '/index.php/upload?server=1',
                        filePath: arr[arr.length - 1],
                        name: 'file',
                        formData: {
                            'user': 'test',
                            "from": "LSBBFLZX"
                        },
                        success: function (res) {
                            // 返回上传完成的img的src
                            var path = Utils.url + JSON.parse(res.data).data.path;

                            suArr.push(path);
                            _this.setData({
                                successArr: suArr
                            })
                        }
                    })
                }
            }
        })
    },
    closeImgFn(e) {
        var doId = e.currentTarget.id;      // 对应的img的唯一id
        var doarrimg = this.data.arrimg;    // 页面显示的img the list    
        var doindex = this.data.index;   // 上传显示的个数
        var suArr = this.data.successArr;      // 发送的img的list的数组
        doarrimg.splice(doarrimg[doId], 1);     // 删除当前的下标的数组
        suArr.splice(suArr[doId], 1);
        doindex--;       // 删除一个上传的个数就递减
        this.setData({
            arrimg: doarrimg,
            index: doindex,
            successArr: suArr
        })
    },
    getSetting() {  // 请求权限
        var _this = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting["scope.record"]) {
                    if (_this.data.bool) {
                        wx.startRecord({
                            success: function (res) {
                                var tempFilePath = res.tempFilePath;
                                _this.setData({
                                    tempFilePath: tempFilePath
                                })
                            }
                        })
                        _this.setData({
                            bool: false
                        })
                    } else {
                        wx.stopRecord()
                        _this.setData({
                            bool: true
                        })
                    }

                }
            }
        })
    },
    onShareAppMessage(res) {    // 转发
        return {
            title: '律师帮帮',
            path: 'pages/addimages/addimages'
        }
    },
    tFocus() {    // 文本域弹开
        this.setData({
            value: "0",
            doVoice: false,
            textareaFocus: true,
            heightmun: "500rpx"
        });
    },
    icosFn(ev) {  // 点击底部的切换
        this.setData({
            value: ev.target.id
        });
        var val = this.data.value;
        if (val != "0") {

            this.setData({
                doVoice: true,
                textareaFocus: false,
                heightmun: "130rpx"
            })
        } else {
            this.setData({
                doVoice: false,
                textareaFocus: true,
                heightmun: "500rpx"
            })
        }
    },
    start() {   // 开始录音
        recorderManager.stop();
        recorderManager.start({ format: "mp3" });
    },
    stop() {     // 停止录音
        let _this = this;
        recorderManager.stop();
        let promises = new Promise(function (resolve, reject) {
            recorderManager.onStop(function (res) {
                resolve(res.tempFilePath)
            })
        })
        return promises;
    },
    touchstart() {   // 语音-按住
        wx.stopRecord();
        this.setData({
            dataTouch: {
                texts: "正在说话",
                data: true
            }
        })
        this.start();
    },
    touchmove() {   //  语音-移动
        this.setData({
            dataTouch: {
                texts: "正在说话",
                data: true
            }
        })
        this.start();
    },
    touchend() {  //  语音-松开 
        let _this = this;
        this.stop().then(function (data) {
            _this.touchUploadFile(data)
        })
        this.setData({
            dataTouch: { texts: "按住说话", data: false }
        })
    },
    touchUploadFile(data) {  // 语音识别
        let _this = this;
        // 转换文字的时候等待
        this.setData({ switchs: true });
        wx.uploadFile({
            url: Utils.url + `/index.php/transaudio?server=1`,
            filePath: data,
            name: 'file',
            header: {
                'content-type': 'application/json',
                "from": "YSZLSFLZX"
            },
            formData: {
                'user': 'test'
            },
            success: function (res) {
                console.log(res)
                var data = JSON.parse(res.data);

                if (data.status) {
                    _this.setData({
                        textareaVal: _this.data.textareaVal + data.data[0],
                        switchs: false,
                        LoadData: "语音识别中...."
                    })
                } else {
                    _this.setData({ switchs: false, LoadData: "抱歉没听清..." })
                }
            }
        })
    }
});