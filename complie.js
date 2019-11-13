// 此文件只是测试 将app.js es6转成es5 输出到本文件，不用关心
"use strict";

var _express = _interopRequireDefault(require("express"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 導入需要的資源，包括自己定義的配置文件
// 實例化一個服務對象
var app = (0, _express.default)();
console.log(_config.default); // 設置views文件夾路徑，默認在根目錄下

app.set("views", _config.default.viewPath); // 往外暴露靜態資源

app.use('/node_modules', _express.default.static(_config.default.node_modules_path)); // node_modules中的引入的靜態文件

app.use('/public', _express.default.static(_config.default.public_path)); // public中的引入的自己的靜態文件
// 配置ejs模板引擎，目前主要用來render頁面

app.set('view engine', 'ejs'); // 路由

app.get('/', function (req, res) {
  res.render('index');
}); // 端口開啓服務

app.listen(3000, function () {
  console.log("server is run on port 3000");
});
