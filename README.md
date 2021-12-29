<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-12-29 16:19:35
 * @Description: 高德地图代理
-->
## amap-proxy
当部署的环境不能上网，但是有一台代理服务器可以上网，可以使用代理服务器加载高德地图
代理服务器需要部署一套服务，用于转发高德地图相关请求，逻辑是：截取下面传入地址后面的所有路径在其前面加上https://去请求高德地图资源，然后转回来
### 使用方法
```javascript
import ap from '@huangjs888/amap-proxy';

ap(
  'http://10.5.10.106:9800/web-proxy/proxy-hs/', // 代理地址
  /(https?:)?\/\/(([A-Za-z0-9_]+\.)+(amap|autonavi)\.com)/g, // 匹配规则
);
```
