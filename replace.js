
const fs = require('fs')
const filePath = './dist/index.css'
fs.readFile(filePath, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/url\("\/iconfont/ig, "url(\"./iconfont")
  fs.writeFile(filePath, result, 'utf8', function (err) {
     if (err) return console.log(err);
     console.log("路径修改成功")
  });
});
