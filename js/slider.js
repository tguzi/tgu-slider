(function ($) {
  /**
   * 图片轮播切换
   */
  var sliders = {
    // 初始值
    imgCount: 0,           // 图片数量
    scrollIndex: 0,        // 轮播索引
    sliderInterval: null, // 定时器
    sliderElement: null,   // 轮播元素
    imgWidth: 0,           // 轮播图片宽度
    /**
     * 初始化方法
     * @param options 传入的值
     * @param element DOM元素
     */
    init: function (options, element) {
      var _root = this;
      // 图片数量
      _root.imgCount = $(element).children('img').length;
      // 选择器
      _root.sliderElement = element;
      // 图片宽度
      _root.imgWidth = parseInt($(element).children('img').first().css('width'));
      // 合并参数
      _root.options = $.extend({}, initOptions, options);
       // 默认样式
      $(element)
        .css({
          'transitionDuration': _root.options.speed + 'ms',
          'left': 0
        })
        .parent()
        .children('#imgOrder')
        .children('li')
        .first()
        .css('background', 'red');
      // 开始轮播
      _root.beginSlider().mouserEvent().clickEvent();
    },
    // 开始执行轮播
    beginSlider: function () {
      var _root = this;
      // 定时循环
      _root.sliderInterval = setInterval(function () {  
        // 改变索引值
        _root.scrollIndex = (_root.scrollIndex + 1) % _root.imgCount;
        // 继续轮播
        _root.next().orderSlider();
      }.bind(this), _root.options.speed + _root.options.delay);
      return _root;
    },
    // 下一张函数
    next: function () {
      var _root = this;
      // 判断轮播方式
      if (_root.options.sliderEvent === 'fade') {
        // 渐隐方式切换图片
        _root.fadeImg();
      }
      else {
        // 默认使用过度方式切换
        _root.scrollImg();
      }
      return _root;
    },
    // 默认的图片切换方式
    scrollImg: function () {
      var _root = this;
      // 获取图片元素
      var sliderImg = $(_root.sliderElement).children('img');
      // 改变图片定位方式
      $(sliderImg)
        .css('position', 'absolute')
        .parent()
        .css({
          'position' : 'relative',
          'left' : -_root.imgWidth*2
        });
      // 根据索引设置图片位置
      for (var i = 0; i < _root.imgCount; i++) {
        $(sliderImg)
          .eq((i + _root.scrollIndex) % _root.imgCount)
          .css('left',_root.imgWidth * i);
      }
      // 改变样式
      $(sliderImg)
        .eq(_root.scrollIndex)
        .css('zIndex', -10)
        .siblings()
        .css('zIndex', 0);
    },
    // 渐隐方式切换图片
    fadeImg: function () {
      var _root = this;
      // 获取图片元素
      var sliderImg = $(_root.sliderElement).children('img');
      // 改变图片定位方式
      sliderImg
        .css('position', 'absolute')
        .parent()
        .css('position', 'relative');
      // 改变图片样式
      $(_root.sliderElement)
        .children('img')
        .eq(_root.scrollIndex)
        .css('opacity', 1)
        .siblings()
        .css('opacity', 0);
      return _root;
    },
    // 改变序号
    orderSlider: function () {
      var _root = this;
      // 获取到所有表示序号的li
      var order = $(_root.sliderElement).parent().children('#imgOrder').children('li');
      // 点击序号
      order.on('click', function () {
        // 更改索引
        _root.scrollIndex = $(this).index();
        // 继续轮播
        _root.next().orderSlider();
      })
      // 改变序号
      order
        .eq(_root.scrollIndex)
        .css('background', 'red')
        .siblings()
        .css('background', '#ccc');
      return _root;
    },
    // 鼠标移入移出事件
    mouserEvent: function () {
      var _root = this;
      // 上级盒子
      var parentBox = $(this.sliderElement).parent();
      // 鼠标移入
      $(parentBox).on('mouseover', function () {
        // 清除定时器
        clearInterval(_root.sliderInterval); 
        // 鼠标移出
      }).on('mouseout', function () {
        // 继续轮播
        _root.beginSlider();
      })
      return _root;
    },
    // 点击上下张事件
    clickEvent: function () {
      var _root = this;
      // 点击上下张的按钮
      var prevOne = $(this.sliderElement).parent().children('#prevImg');
      var nextOne = $(this.sliderElement).parent().children('#nextImg');
      // 点击上下张改变索引
      $(nextOne).on('click', function () {
        // 索引+1
        _root.scrollIndex = (_root.scrollIndex + 1) % _root.imgCount;
        _root.next().orderSlider();
      })
      $(prevOne).on('click', function () {
        // 索引-1
        _root.scrollIndex = (_root.scrollIndex + _root.imgCount - 1 ) % _root.imgCount;
        _root.next().orderSlider();
      })
      return _root;
    }
  };
  $.fn.Slider = function (options) {
    return this.each(function () {
      // 创建一个具有对象原型和属性的空对象
      var Slider = Object.create(sliders);
      // 初始化
      Slider.init(options, this);
    })
  }
  var initOptions = {
    sliderEvent: 'scroll', // 动画播放方式 
    speed: 500,            //轮播过渡时间
    delay: 1000            // 播放间隔
  }
})(jQuery);