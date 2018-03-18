
var webpack = require('webpack');
module.exports = {
	mode: 'production',
	entry: {
		index: __dirname + '/app/main.js',
	},
	output: {
		path: __dirname + '/public',
		filename: 'main.min.js',
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				use: {
					loader: "babel-loader"
				},
				exclude: /node_modules/
			},
			{
				test: /(\.css)$/,
				use: {
					loader: "css-loader"
				},
				exclude: /node_modules/
			},
		],
	},
	resolveLoader: {
		alias: {
			"demo-loader": path.resolve(__dirname, "app/css-loader.js"),
		},
	},
};

