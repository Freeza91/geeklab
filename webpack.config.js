var path = require('path'),
    webpack = require('webpack');

var config = module.exports = {
  context: __dirname,
  entry: {
    'main': './app/frontend/javascripts/main.js',
    'sign': './app/frontend/javascripts/user/sign.js',
    //password: './app/frontend/javascripts/users/password.js',
    'assignment-index': './app/frontend/javascripts/assignment/assignment-index.js',
    'assignment-join': './app/frontend/javascripts/assignment/assignment-join.js'
  }
};

config.output = {
  // 编译完成的文件的文件名和存放路径
  path: path.join(__dirname, 'app', 'assets', 'javascripts'),
  filename: '[name]-bundle.js',
  publicPaht: '/assets'
};

config.resolve = {
  extensions: ['', '.js']
};

config.module = {

};

config.plugins = [
]
