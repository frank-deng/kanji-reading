
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
		],
	},
	resolveLoader: {
		alias: {
			'css-loader': __dirname + "/app/css-loader.js",
		},
	},
};

