
(function () {

  var items = [
      {id:1,title:'服装/内衣/配件',subItems : [
        {text:'女装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'内衣',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'羽绒',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'呢大衣',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'毛衣',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'保暖',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'睡衣',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男羽绒',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男毛衣',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:2,title:'鞋/箱包',subItems : [
        {text:'女鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'雪地靴',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'靴子',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'休闲鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'箱包',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'女包',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男包',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'拉杆箱',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'钱包',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:3,title:'珠宝饰品/手表眼镜',subItems : [
        {text:'珠宝',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'足金',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'钻戒',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'玉镯',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'珍珠',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'手表',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'饰品',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'毛衣链',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'手链',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'瑞士军刀',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:4,title:'化妆品',append:{text:'美容馆',href:'http://book.tmall.com/?spm=3.1000473.294515.133.AYJRPv&prt=1346727469564&prc=2'},
      subItems : [
        {text:'护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'彩妆',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'洗护',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'美体',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男士护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面膜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'眼霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'BB霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'套装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'精油',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:5,title:'运动户外',subItems : [
        {text:'运动鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'运动服',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'户外',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'用品',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'板鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'跑步鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'羽绒服',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'冲锋衣',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'跑步机',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:6,title:'手机数码',subItems : [
        {text:'手机',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'相机',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'笔记本',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'平板',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'硬件',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'配件',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'试听',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'移动存储',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'台式机',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:7,title:'家用电器',subItems : [
        {text:'大家电',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'影音',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'电视机',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'耳机',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'厨房',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'生活电器',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'取暖器',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'个人护理/保健',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:8,title:'家具建材',subItems : [
        {text:'灯具',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'卫浴',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'油漆',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'开关',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'地板',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'墙纸',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'沙发',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'床',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'衣柜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'套装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'床垫',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:9,title:'家纺/家居',append:{text:'家装馆',href:'http://book.tmall.com/?spm=3.1000473.294515.133.AYJRPv&prt=1346727469564&prc=2'},
      subItems : [
        {text:'四件套',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'蚕丝被',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'冬被',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'枕头',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'家饰',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'厨房',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'杯子',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'清洁',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'收纳',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'宠物',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'居家',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:10,title:'母婴玩具',subItems : [
        {text:'奶粉',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'尿裤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'童装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'孕产',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'玩具',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'车床',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'辅食',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'用品',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'童鞋',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'月子',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'大人玩乐',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:11,title:'食品',subItems : [
        {text:'护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'彩妆',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'洗护',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'美体',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男士护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面膜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'眼霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'BB霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'套装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'精油',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:12,title:'医药保健',subItems : [
        {text:'护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'彩妆',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'洗护',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'美体',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男士护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面膜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'眼霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'BB霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'套装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'精油',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:13,title:'汽车配件',subItems : [
        {text:'护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'彩妆',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'洗护',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'美体',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男士护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面膜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'眼霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'BB霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'套装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'精油',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]},
      {id:14,title:'图书音像',append:{text:'书城',href:'http://book.tmall.com/?spm=3.1000473.294515.133.AYJRPv&prt=1346727469564&prc=2'},
      subItems : [
        {text:'护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'彩妆',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'洗护',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'美体',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'男士护肤',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面膜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'面霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'眼霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'BB霜',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'套装',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'},
        {text:'精油',href:'http://list.tmall.com/search_product.htm?spm=3.1000473.294515.21.AYJRPv&q=&start_price=&end_price=&catName=&search_condition=16&cat=50026473&sort=s&style=g&vmarket=0&active=1'}
      ]}
    ];

   var overlay = new BUI.Menu.PopMenu({
        content : $('#j_Sub'),
        elCls:'subCategory',
        autoHideType:'leave',
        autoHide:true,
        height:450,
        width:755
      });
  $.each(items,function(index,item){
    item.elCls = 'item item' + item.id + ' j_MenuItem';
    item.subMenu = overlay;
    item.subMenuAlign = {
       points: ['tr','tl'], 
       offset: [-1, -7] 
    };
    item.arrowTpl = '<s class="menuIcon"></s>';
  });

  var tmenu = new BUI.Menu.Menu({
        render : '#tm',
        items : items,
        itemStatusCls : {
          hover:'selected',
          collapsed : 'itemSelected'
        },
        selectedEvent: 'mouseenter',
        itemTplRender : function(data){
          var subItems = data.subItems,
            arr1 = [],
            append = '',
            arr2 = [];
          if(data.append){
            append = '<a href="'+data.append.href+'">'+data.append.text+'</a>'
          }
          $.each(subItems,function(index,item){

            var cls = (index % 5) == 0 ? 'item-col1' : '',
              str = '<a href="'+item.href+'" target="_blank" class="' + cls + '" data-spm-anchor-id="3.1000473.294515.21">'+item.text+'</a>'
            if(index < 5){
              arr1.push(str);
            }else{
              arr2.push(str);
            }
          });

          var rst = '<h3 class="item-hd item-hd' + data.id + '">'+
                    '<s></s>' + data.title + append +
                  '</h3>' +
                  '<p class="item-col  itemCol1">' + arr1.join('') + '</p>' +
                  '<p class="item-col">' + arr2.join('') + '</p>'
                  ;
          return rst;
        }
      });

  tmenu.render();

  var expandEl = $('.j_ExpandCat'),
    simpleEl = $('.j_SimpleCat');

  expandEl.on('click',function(){
    $('.selectedCat').removeClass('selectedCat');
    $(this).addClass('selectedCat');
    var items = tmenu.getItems();
    $.each(items,function(index,item){
      item.set('collapsed',false);
    })
  });

  simpleEl.on('click',function(){
     $('.selectedCat').removeClass('selectedCat');
    $(this).addClass('selectedCat');
    var items = tmenu.getItems();
    $.each(items,function(index,item){
      item.set('collapsed',true);
    })
  });

  var CELL_HEIGHT = 78;
  $(window).on('scroll',function(){
    if(expandEl.hasClass('selectedCat')){
      var top = BUI.scrollTop(),
        items = tmenu.getItems(),
        count = parseInt((top - 30) / CELL_HEIGHT);
      $(items).each(function(index,item){
        if(index < count){
          item.set('collapsed',true);
        }else{
          item.set('collapsed',false);
        }
      });
      if(count >= items.length){
        simpleEl.hide();
        expandEl.hide();
      }else{
        simpleEl.show();
        expandEl.show();
      }
    }
  });

  //显示子菜单

  overlay.on('mouseenter',function(){
    var _self = this,
      curTrigger = _self.get('align').node;
      curTrigger.addClass('selected');
  });

   overlay.on('mouseleave',function(){
    var _self = this,
      curTrigger = _self.get('align').node;
      curTrigger.removeClass('selected');
  });

})();