var Utils = require("../../utils/util.js");
const recorderManager = wx.getRecorderManager();
const options = {
        duration: 10000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
        frameSize: 500
}
Page({
data:{
        attendSuccessImg:"",
        val:""
},
onLoad(){
        
},
start(){
        recorderManager.start({ format:"mp3"});
        recorderManager.onStart(function (res) {
                console.log(res)
        })
},
stop(){
        recorderManager.stop();
        recorderManager.onStop(function(res){
                console.log(res)
        })
}       
})