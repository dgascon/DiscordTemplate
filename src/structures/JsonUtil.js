const fs = require('fs');

/**
 * Contains json methods
 * @type {JsonUtils}
 */
module.exports = class JsonUtils
{
	/**
	 * Read the file passed in "path" or create it by putting either an array or an object.
	 * @param path
	 * @param fillWithEmptyArray - if false creates an empty object
	 * @returns {*}
	 */
	static read(path, fillWithEmptyArray = true)
	{
		let data;
		try {
			data = JSON.parse(fs.readFileSync(path, 'utf-8'));
		} catch (e) {
			let fill;
			if (fillWithEmptyArray)
				fill = [];
			else
				fill = {};
			fs.writeFileSync(path, JSON.stringify(fill,null,4), "utf-8");
			data = JSON.parse(fs.readFileSync(path, "utf-8"));
		}

		return data;
	}

	/**
	 * Write files.
	 * @param path
	 * @param content
	 */
	static write(path, content)
	{
		fs.writeFileSync(path, JSON.stringify(content,null,4), "utf-8");
	}



}