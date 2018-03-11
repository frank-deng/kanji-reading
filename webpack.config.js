var webpack = require('webpack');
module.exports = {
	entry: {
		index: __dirname + '/app/main.js',
	},
	output: {
		path: __dirname + '/public',
		filename: 'main.min.js',
	},
};

