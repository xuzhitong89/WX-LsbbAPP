var Utils = require("../../utils/util.js");
// const recorderManager = wx.getRecorderManager()
// const ctx = wx.createCanvasContext('myCanvas')


// recorderManager.onStart(() => {
//   console.log('recorder start')
// })
// Page({
//   data: {
//           mun:""
//   }, 
//   onLoad(){
        
        
//   },           
//   show(){    // 点击我
//           let _this = this;
//           wx.chooseImage({
//                   success: function (res) {
//                           ctx.drawImage(res.tempFilePaths[0], 0, 0, 88, 88)
//                           ctx.draw();
//                           console.dir(ctx)
//                           resolve(ctx)
//                   }
//           })
        
//   },
// //   hide(){
// //           wx.canvasToTempFilePath({
// //                   canvasId: 'myCanvas',
// //                   success: function (res) {
// //                           console.log(res.tempFilePath)
// //                   }
// //           })
// //   }

// })

Page({

data:{
        attendSuccessImg:"",
        val:""
},
show: function() {
        var that = this;
        wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed','original'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['camera','album'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                        const ctx = wx.createCanvasContext('myCanvas');
                        var tempFilePaths = res.tempFilePaths[0];
                        ctx.drawImage(tempFilePaths, 0, 0, 94, 96);
                        ctx.draw();
                        // ctx.draw(false,function(){
                        //         console.log("不能执行")
                        // });
                        // ctx.draw(true, function () {
                        //         console.log("不能执行")
                        // });
                        that.hide();           // 也不能执行
                }
        });
},
// 生成图片
hide: function() {
        var that = this;        
        wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                success: function(res) {
                        that.setData({
                                val: res.tempFilePath
                        });
                        console.log(res.tempFilePath)
                }
        });
      
      
},
})