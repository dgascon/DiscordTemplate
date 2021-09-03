const path = require('path');

/**
 * Contains utility methods
 * @type {Util}
 */
module.exports = class Util {
	constructor(client) {
		this.client = client;
	}

	/**
	 * Check if input is a Class
	 * @param input is a file
	 * @returns {boolean} true if input is a class else false
	 */
	static isClass(input) {
		return typeof input === 'function'
			&& typeof input.prototype === 'object'
			&& input.toString().substring(0, 5) === 'class';
	}

	/**
	 * -1 is not object, 0 is Array, 1 is Object
	 * @param input
	 * @returns {number}
	 */
	static isArrayOrIsObject(input) {
		if (typeof input !== 'object')
			return -1;
		if (Array.isArray(input))
			return 0;
		else
			return 1;
	}

	/**
	 * Reture absolute path
	 * @returns {string}
	 */
	static get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}
}