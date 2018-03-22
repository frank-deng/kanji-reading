const fs = require('fs');
const StringDecoder = require('string_decoder');
const Sha256 = require('js-sha256');
function sha256sum(filename){
	var data = new StringDecoder.StringDecoder('utf8').write(fs.readFileSync(filename));
	return Sha256.sha256(data);
}

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
		index: __dirname + '/data/gendata.js',
	},
	output: {
		path: __dirname,
		filename: 'gendata.temp.js',
	},
	optimization: {
		minimize: false,
	},
}, (err, stats) => {
	webpackErrorHandler(err, stats);
	require('./gendata.temp');
	var sha256readings = sha256sum('./readings.txt');
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
		plugins: [
			new webpack.DefinePlugin({
				READINGS_SHA256: sha256readings,
			}),
		],
	}, webpackErrorHandler);
});
