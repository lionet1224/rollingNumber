# rolling-number
一个上下滚动的数字插件 (可用作数据流量展示、或者数字滚动抽奖)

[GitHub](https://github.com/Colorfule/rollingNumber)      

#### 可通过 rolling.start() 来执行动画滚动
#### 在调用方法时可传入想要滚动到的数字 前面可用0补位
 

```html
  <link rel="stylesheet" href="./src/index.css"/>

  <div class="wrapper"></div>
```

```javascript
  import Rolling from './index.js';

  let rolling = new Rolling({
    el: document.query, // 存放滚动数字的盒子
    target: '123789',  // 最终数字滚动到的数字 超过16位请使用字符串形式传入
    delay: 300, // 动画结束以后 延迟多久执行回调函数 默认 300s 0为立即执行
    duration: 2000, // 滚动动画持续滚动多久 默认 2000 毫秒
  });

  rolling.start(456789).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  }); // 调用 可传参
```
#### 想立即执行可以在实例化后直接调用方法 new Rolling({ ... }).start(); 
#### 可在index.html查看详细
