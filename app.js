// TODO: 用户名称需修改为自己的名称
var userName = '张涛';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和', 
    avatar: './img/avatar2.png'
  }, 
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  }, 
  reply: {
    hasLiked: true,
    likes: ['Guo封面', '源小神','张涛'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  }, 
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');
var $currentMI = '';//当前被点击的MomentsItem
var $currentMII = '';//当前被点击的MomentsItemIndex

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item show-big-img" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}

/**
 * 分享消息模版 
 * @param {Object} share 分享消息的图片链接和文字内容
 * @return {String} 返回的Html字符串
 */
function shareMsgTpl(share){
  var htmlText = `<div class="item-share">
            <img src="${share.pic}" alt="分享的图片" class="share-img">
            <span class="share-text">${share.text}</span>
          </div>`;
  return htmlText;
}
/**
 * 单图片消息模版
 * @param {String} pics 数列
 * @return {String} 返回的Html字符串
  */
 function sigPicTpl(pics) {
   return `<img src="${pics[0]}" alt="分享的单个图片" class="single-img show-big-img">`;
 }

/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 * @param {Number} message-item的索引值，用来区分不同message-item，此值与data的索引值对盈
 */ 
function messageTpl(messageData,messageIndex) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push(`<div class="moments-item" data-index="${messageIndex}">`);
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareMsgTpl(content.share)
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = sigPicTpl(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
      contentHtml = ``;
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  // var messageHtml = messageTpl(data[0]);
  // $momentsList.html(messageHtml);
  var messageHtml = data.map(function (item, index) {
    return (messageTpl(item, index))
  });
  $momentsList.html(messageHtml);
  // 更改我的名字
  $('span.user-name').text(userName);
}

/* 分析每个组件的行为，将其可能出现的渲染方式写成独立的函数，在总体的绑定事件中调用这些写好的行为 */
/**
 * 将点赞评论按钮显示出来（带动画）showItemLike
 */
function showItemLike(){
  $currentMI.find('div.item-reply-btn').append(
      `
          <div class="item-like item-like-show">
            <span class="like-btn iconfont icon-xin">${data[$currentMII].reply.hasLiked ? '取消':'点赞'}</span>
            <span class="commit-btn iconfont icon-xinxi">评论</span>
          </div>
      `);
}
/**
 * 将点赞评论按钮移除（不带动画）直接移除。
 */
function removeItemLike(){
  if ($currentMI) {
    $currentMI.find('div.item-like').remove();
  }
}
/**
 * 点赞评论按钮退出，(带动画)
 */
 function ItemLikeHiden(){
   $currentMI.find('div.item-like').removeClass('item-like-show');
   $currentMI.find('div.item-like').addClass('item-like-hidden');
   // 退出动画结束后删除DOM
   setTimeout(() => {
     $currentMI.find('div.item-like').remove();
   }, 400);
 }
 /**
  * 重新渲染点赞按钮,根据data的值改变点赞 | 取消样式
  */
function reRenderLike(){
  var str = data[$currentMII].reply.hasLiked ? '取消' : '点赞'; 
  $currentMI.find('span.like-btn').text(str);
}
/**
 * 重新渲染点赞列表
 */
function reRenderLikeList(){
  var htmlText = likesHtmlTpl(data[$currentMII].reply.likes);
  $currentMI.find('div.reply-like').remove()
  $currentMI.find('div.reply-zone').prepend(htmlText);
}
/**
 * 评论框退出（实际上没有真的退出，只是高度设置为零了）
 */
function commitFormHidden(){
  $('.commit-form').removeClass('commit-form-show');
}
/**
 * 显示评论框（实际上就是把高度重新设置回来）
 */
function commitFormShow(){
  $('.commit-form').addClass('commit-form-show');
}
/**
 * 重新渲染评论列表
 */
function reRenderCommitList() {
  var htmlText = commentsHtmlTpl(data[$currentMII].reply.comments);
  $currentMI.find('div.reply-comment').remove()
  $currentMI.find('div.reply-zone').append(htmlText);
}
/**
 * 激活评论按钮（设置样式，同时取消disabed属性
 */
function activeCommitBtn(){
  $('.commit-button').css({
    'background-color': '#59BB3B',
    'color': 'white'});
  $('.commit-button').attr('disabled', false);
}
/**
 * 禁用评论按钮（设置样式，同时设置disabed属性
 */
function diabaledCommitBtn() {
  $('.commit-button').css({
    'background-color': '#ccc',
    'color': 'whitesmoke'
  });
  $('.commit-button').attr('disabled', true);
}
/**
 * 显示遮罩层层，同时插入需要方法的照片，并将其放大
 * @param {Object} $this 当前选中的图片
 */
function showPic($this){
  $('.wrap').addClass('wrap-show');
  var imgLeft = $this.offset().left;
  var imgTop = $this.offset().top;
  var imgWidth = $this.outerWidth();
  var imgSrc = $this.attr('src');
  var htmlText = `<img class="show-img" src=${imgSrc}>`;
  $('.wrap').append(htmlText);
}
/* 工具函数 */
/**
 * 从数组中删除某个元素(将其绑定在原型上方便调用)
 * @param{String} item 具体需要删除的元素的内容
 */
Array.prototype.remove = function(item){
  var i = -1;
  this.forEach(function(n,index){
    if(item === n){
       i = index;
    }
  })
  if(i >= 0 ){
    this.splice(i,1);
  }
}
/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
  //使用事件委托的方式，避免添加新的消息动态后，不具备点赞or评论的功能。
  $('div.moments-list').on('click','div.item-reply-btn',function(event){
    event.stopPropagation();
    // 判断这个ment-list中是否有item-like,有的话，加退出动画，并退出
    if($(this).find('div.item-like').length){
      // 点赞评论按钮退出
      ItemLikeHiden();
      return;
    }
    // 移除之前打开的点赞评论按钮
    removeItemLike();
    // 更行当前的mentlist索引
    $currentMI = $(this).parents("div.moments-item"); 
    $currentMII = $(this).parents("div.moments-item").attr("data-index");
    // 在当前的ment-list中添加点赞评论按钮
    showItemLike();
      // 点击‘点赞’按钮,为好友点赞
    $(this).find('span.like-btn').on('click',function(){
      data[$currentMII].reply.hasLiked = !data[$currentMII].reply.hasLiked;
      if(data[$currentMII].reply.hasLiked){
        data[$currentMII].reply.likes.push(userName);
      }else{
        data[$currentMII].reply.likes.remove(userName);
      }
      // 重新渲染点赞按钮
      reRenderLike();
      // 重新渲染点赞列表
      reRenderLikeList();
      // 点赞评论按钮退出
      ItemLikeHiden();
    });
    // 点击评论按钮，打开评论键入框
    $(this).find('.commit-btn').on('click',function(){
      // 显示评论键入框
      commitFormShow();
      // 自动将焦点对其到input框上
      $('.commit-input').focus();
      $('.commit-input').on('keyup',function(){
        // 激活评论按钮
        activeCommitBtn();
      });
    });
  });

  // 写入评论
  $('.commit-button').on('click', function () {
    // 禁止使用Commitbutton
    diabaledCommitBtn()
    // 将评论内容写入data中
    var cmtString = $('.commit-input').val().trim();
    data[$currentMII].reply.comments.push({
      author: userName,
      text: cmtString
    });
    // 重新渲染评论列表
    reRenderCommitList();
    // 去掉commit-input里的值并关闭评论框
    $('.commit-input').val('');
    commitFormHidden();
    return false;
  })
  // 点击任何其他地方的时候移除点赞评论按钮
  $('.page-moments').on('click',function(event){
    // 移除之前打开的点赞评论按钮
    removeItemLike();
  });
  // 滚动窗口时，移除点赞评论按钮
  $(window).on("scroll", function () {
    // 移除之前打开的点赞评论按钮
    removeItemLike();
  });
  // 事件委托，点击多图片放大,（多图方法和单图放大远离是一样的，需要为这连个img标签添加一个共同的class（show-big-img）用来同时选中这两个元素）
  $momentsList.on('click','.show-big-img',function () {
    //页面禁止滚动
    $('html').addClass('forbin-scroll');
    var $this = $(this);
    showPic($this);
  })
  // 点击退出
  $('.wrap').on('click',function(){
    $(this).empty();
    $(this).removeClass('wrap-show');
    // 允许页面滚动
    $('html').removeClass('forbin-scroll');
  });
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();