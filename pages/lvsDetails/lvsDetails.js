
var Utils = require("../../utils/util.js");

let datas = {
  Stars:[     // 星星
    "",
    "",
    "",
    "",
    ""
  ],
  StarsData:0,  // 星星的数据
  users:[   // 评价标签
    {
      text:"解答清晰",
      cls:"active",
      m:0
    },
    {
      text: "专业认真",
      cls: "",
      m:0
    },
    {
      text: "建议有用",
      cls: "",
      m:0
    },
    {
      text: "回复及时",
      cls: "",
      m:0
    },
    {
      text: "态度热情",
      cls: "",
      m:0
    },
    {
      text: "服务一般",
      cls: "",
      m:0
    }
  ],
  usersData:["0"],   // 评价的数据
  lvsData:{   // 头部全部的数据
    img:"/images/user.png", // 头像
    ico:"/images/v.png",
    userName: "王律师",  // name
    ages:"3", // 年限
    money:"30", // 钱
    stars:[ // 星星
      {
        uClass: "icon-xingxing1",
        nClass: "icon-xingxing"
      },
      {
        uClass: "icon-xingxing1",
        nClass: "icon-xingxing"
      },
      {
        uClass: "icon-xingxing1",
        nClass: "icon-xingxing"
      },
      {
        uClass: "icon-xingxing1",
        nClass: "icon-xingxing"
      },
      {
        uClass: "icon-xingxing1",
        nClass: "icon-xingxing"
      }
    ],
    blocks:[
      {
        text:"劳动纠纷"
      },
      {
        text: "劳动纠纷"
      },
      {
        text: "劳动纠纷"
      }
    ]
  },
  TareaVal:""
};
Page({
  data: datas,
  onLoad (options) {
  },
  userFn(e){    // 用户评价的多选

    var id = e.target.id;
    var users = this.data.users;
    var arr = this.data.usersData

    users[id].m++;  // 次数的累加 %2 判断奇偶数 
    users[id].cls = users[id].m % 2 ? "active" : '';

    if (users[id].m % 2 ) {
      arr.push(id)
    }else{
      arr.splice(arr.indexOf(id), 1);
    }

    this.setData({
      users: users,
      usersData: arr
    })
  },
  StarFn(e){   // 服务评价

      var id = e.target.id;
      var Stars = this.data.Stars;

      Stars = ["","","","",""]; // 每次点击还原数据

      for (let i = 0; i < id; i++){
        Stars[i] = "icon-xingxing"
      }

      this.setData({
        Stars: Stars,
        StarsData: id
      })

  },
  submitFn(){  // 提交的数据的接口
    var textareaVal = this.data.TareaVal;
    if (textareaVal != "") {
      
    }
  },
  Tareafn(e){  // 表单输出
    let value = e.detail.value;

    if (value != "") {
      this.setData({
        TareaVal: value
      })
    }
  }
})