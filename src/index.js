import templateItem from './template.js'; // 组件模板

function errors() {
  return {
    TARGET_NUMBER_EMPTY: '请输入目标数字，如果不确定，可传入与结果位数相同的字符串！',
    TARGET_NUMBER_INVALID: '请输入合法的值，允许传入的值为[String|Number] 0-9 支持小数！',
    TARGET_MOUNTE_INVALID: '元素不可用，请选择可被正确挂载的元素！它必须是一个element元素且不能为document和body!'
  }
}

export default class Rolling {
  constructor(opt) {
    this.errors = errors();

    this.options = {
      IMG_NUMBER_COUNT: 11, // 一共有多少个滚动的数字
      FONT_SIZE_AND_HEIGHT: Rolling._parseTargetNumber(opt.size, '16'), // 滚动框显示多大
      MOUNTED_WRAPPER: Rolling._findTargetElement(opt.el), // 目标挂载元素
      TARGET_NUMBER: Rolling._parseTargetNumber(opt.target),  // 最后需要滚动到的元素
      ANIMATION_DURATION: +Rolling._parseTargetNumber(opt.duration, 2000) // 动画持续时间
    }

    this.timeoutTimer = null; // 延时器
    this.intervalTimer = null; // 计时器

    Rolling.initPluginOptions(this.options);
  }

  // 初始化插件配置
  static initPluginOptions(options) {
    const { FONT_SIZE_AND_HEIGHT, TARGET_NUMBER, MOUNTED_WRAPPER } = options
    MOUNTED_WRAPPER.classList.add('rolling-number'); // 添加组件特有类名
    MOUNTED_WRAPPER.style.fontSize = FONT_SIZE_AND_HEIGHT + 'px'; // 设置显示的基准值

    Rolling._setTemplateAndTarget({
      options,
      target: options.TARGET_NUMBER,
      template: Rolling._renderTargetTemplate(TARGET_NUMBER)
    });
  }

  // 重新开始滚动 并跳转至原值或者新值
  start(number) {
    // 如果在后续调用的时候存在新的数字
    if (number !== '0' && Rolling._parseTargetNumber(number) !== '0') {
      const STRINGIFY_NUMBER = Rolling._parseTargetNumber(number);

      if (STRINGIFY_NUMBER.length !== this.options.TARGET_NUMBER.length) {
        Rolling._renderTargetTemplate(STRINGIFY_NUMBER);
        // 设置模板以及目标数字
        Rolling._setTemplateAndTarget({
          options: this.options,
          target: STRINGIFY_NUMBER,
          template: Rolling._renderTargetTemplate(STRINGIFY_NUMBER)
        });
      }

      return new Promise(resolve => {
        Rolling._startAnimation({
          timers: {
            interval: this.intervalTimer,
            timeout: this.timeoutTimer
          },
          options: this.options,
          target: STRINGIFY_NUMBER
        }, resolve);
      })
    } else {
      return Promise.reject(this.errors.TARGET_NUMBER_INVALID);
    }
  }

  // 开始滚动动画
  static _startAnimation({ options, target, timers }, resolve) {
    const { MOUNTED_WRAPPER, FONT_SIZE_AND_HEIGHT, IMG_NUMBER_COUNT } = options;
    const ROLLING_CHILDRENS = MOUNTED_WRAPPER.children;

    let length = target.length, item, pos, i;

    timers.interval = setInterval(() => {
      for (i = 0; i < length; i++) {
        item = ROLLING_CHILDRENS[i].style;
        pos = -FONT_SIZE_AND_HEIGHT * Math.floor(Math.random() * IMG_NUMBER_COUNT)

        item.transform = `translateY(${pos}px)`
      }
    }, 30);

    // 多长时间以后停止动画
    timers.timeout = setTimeout(() => {
      Rolling._rollingToTarget({
        target,
        options,
        childrens: ROLLING_CHILDRENS,
      });

      // 清除定时器
      Rolling._clearTimers(timers);

      resolve({
        target: target,
        wrapper: options.MOUNTED_WRAPPER,
        duration: options.ANIMATION_DURATION,
      })
    }, options.ANIMATION_DURATION);
  }

  // 把数字滚动到目标设定的值
  static _rollingToTarget({ options, childrens, target }) {
    const { FONT_SIZE_AND_HEIGHT } = options
    let length = target.length, item, pos, i;

    for (i = 0; i < length; i++) {
      item = childrens[i].style;
      pos = -target[i] * FONT_SIZE_AND_HEIGHT;

      if (target[i] === '.') { pos = -10 * FONT_SIZE_AND_HEIGHT }

      item.transform = `translateY(${pos}px)`
    }
  }

  // 返回选择的元素
  static _findTargetElement(element) {
    const TYPE = typeof element

    if (TYPE === 'string') {
      return document.querySelectorAll(element)
    } else if (TYPE === 'object') {
      if (
        element !== null &&
        element !== document &&
        element.nodeType === 1 &&
        element !== document.body
      ) {
        return element
      } else {
        throw new Error(this.errors.TARGET_MOUNTE_INVALID);
      }
    } else {
      throw new Error(this.errors.TARGET_MOUNTE_INVALID);
    }
  }

  // 解析目标数字字符串
  static _parseTargetNumber(number, defaultVal = '0') {
    const TYPE = typeof number;

    if (
      (!number) ||
      (TYPE === 'object') ||
      (TYPE === 'boolean') ||
      (TYPE === 'function') ||
      (TYPE === 'number' && isNaN(number)) ||
      (TYPE === 'string' && isNaN(parseFloat(number)))
    ) {
      return defaultVal
    } else {
      return String(number);
    }
  }

  // 根据位数生成模板
  static _renderTargetTemplate(target) {
    const TARGET_LENGTH = target.length;
    let templateString = '',
      i;

    for (i = 0; i < TARGET_LENGTH; i++) {
      templateString += templateItem
    }

    return templateString;
  }

  // 重置模板元素以及重置目标数字
  static _setTemplateAndTarget({ options, template, target }) {
    options.MOUNTED_WRAPPER.innerHTML = template;
    options.TARGET_NUMBER = target;
  }

  // 清除动画定时器
  static _clearTimers(timers) {
    clearInterval(timers.timeout);
    clearInterval(timers.interval);
    timers.timeout = null;
    timers.interval = null;
  }
}
