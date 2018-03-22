let _index = 1;

Page({
    data: {
        imgUrls: [
            {
                img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                cls:"",
                Zindex:1,
                animationData: {}
            },
            {
                img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
                cls: "",
                Zindex:2,
                animationData: {}

            },
            {
                img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
                cls: "",
                Zindex:3,
                animationData: {}
            }
        ],
        clientX:0,     // X轴
        
        mun:0,
        value:null,
        _zindex:3
    },
    onLoad(){
        
    },
    touchstart(event){
        this.setData({ clientX: event.touches[0].clientX})
    },
    touchmove(event){
       
        let getClientX = this.data.clientX;
        let getThisClientX = event.touches[0].clientX;
        let getId = event.currentTarget.id;
        let imgUrls = this.data.imgUrls;
        
        // imgUrls[getId].Zindex = getId - 2 ;

        console.log(event)
        let animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease'
        })
      
        this.animation = animation;
      
        if (getThisClientX - getClientX < 0 ) {
            this.setData({ value:-1000});
        }else{
            this.setData({ value: 1000 });
        }
        let value = this.data.value;
        this.animation.left(value).step();
        
        imgUrls[getId].animationData = this.animation.export();
        
        this.setData({
            imgUrls: imgUrls, 
            mun: getId
        });
        // this.animation.currentTransform["style.left"].args[1] = "0";
        
    },
})

