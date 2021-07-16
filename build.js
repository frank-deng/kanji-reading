const fs = require("fs");

const webpack = require('webpack');
function webpackErrorHandler(err, stats){
	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		process.exit(1);
	}
	const info = stats.toJson();
	if (stats.hasErrors()) {
		console.error(info.errors);
		process.exit(1);
	}
	if (stats.hasWarnings()) {
		console.warn(info.warnings);
	}
}

webpack({
	mode: 'production',
	target: "node",
	entry: {
		index: __dirname + '/data/index.js',
	},
	output: {
		path: __dirname,
		filename: 'gendata.temp.js',
		library: 'gendata',
		libraryTarget: 'umd',
	},
	optimization: {
		minimize: false,
	},
}, (err, stats) => {
	webpackErrorHandler(err, stats);
	var gendata = require('./gendata.temp').default();
	webpack({
		mode: 'production',
		entry: {
			index: __dirname + '/app/index.js',
		},
		output: {
			path: __dirname,
			filename: 'index.min.js',
		},
		module: {
			rules: [
				{
					test: /(\.jsx|\.js)$/,
					use: {
						loader: "babel-loader",
						options: {
						  presets: ["@babel/preset-env"]
						}
					},
					exclude: /node_modules/
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'READINGS_DATA': '\"'+gendata.r+'\"',
				'VARIANTS_DATA': '\"'+gendata.v+'\"'
			}),
		],
	}, webpackErrorHandler);
});
