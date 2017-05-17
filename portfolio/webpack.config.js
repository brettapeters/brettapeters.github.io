const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'source-map',

	context: resolve(__dirname, 'src'),

	entry: './index.js',

	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, 'dist'),
		publicPath: '/'
	},

	module: {
		rules: [
			{test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /(\.css|\.scss)$/, loaders: [ 'style-loader', 'css-loader', 'sass-loader']},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src/index.html'),
      filename: resolve(__dirname, 'dist/index.html')
    })
	]
};