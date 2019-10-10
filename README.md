# rolling-number
一个上下滚动的数字插件

```
  <div class="wrapper"></div>
  <script src="./index.js"></script>
  
  let rolling = new Rolling({
    el: '.wrapper', // 存放滚动数字的盒子
    target: '123789',  // 最终数字滚动到的数字 超过16位请使用字符串形式传入
    delay: 300, // 动画结束以后 延迟多久执行回调函数 默认 300s 0为立即执行
    direction: 'up', // 上下滚动还是随机滚动 [up, down, random] 默认随机 (其实滚动的速度太快根本看不出来)
    duration: 2000 // 滚动动画持续滚动多久 默认 2000 毫秒
  }, function(nums){
    // 动画结束后做点什么 nums 为设置的目标值 字符串类型
    console.log(nums);
  });
```
