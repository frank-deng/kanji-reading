const loaderUtils = require("loader-utils");
const Sha256 = require('js-sha256');
const fs = require("fs");
const StringDecoder = require('string_decoder');
module.exports = function(content){
	const { filename } = loaderUtils.getOptions(this);
	var data = new StringDecoder.StringDecoder('utf8').write(fs.readFileSync(filename));
	var sha256sum = Sha256.sha256(data);
	return `'${sha256sum}'`;
}
