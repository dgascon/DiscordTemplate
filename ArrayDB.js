const Util = require('./Util.js')

/**
 * Contains Array database management methods based on a guild_id
 * @type {ArrayDB}
 */
module.exports = class ArrayDB {

	/**
	 * Get data based on a guild_id in array
	 * @param data - Array of data
	 * @param guild_id - Id of guild server
	 * @returns data or undefined
	 */
	static getDataByGuild(data, guild_id)
	{
		if (data === undefined)
			throw new TypeError(`Cannot read property 'data' of undefined`);
		if (guild_id === undefined)
			throw new TypeError(`Cannot read property 'guild_id' of undefined`);
		for (let i = 0; i < data.length; i++)
		{
			if (data[i].guild_id !== guild_id)
				continue;
			return data[i];
		}
	}

	/**
	 * Add key in the data based on guild_id. If data doesn't exist, shee created it.
	 * @param data - Array of data
	 * @param guild_id - Id of guild server
	 * @param key
	 * @param value
	 */
	static add(data, guild_id, key, value)
	{
		if (data === undefined)
			throw new TypeError(`Cannot read property 'data' of undefined`);
		if (Util.isArrayOrIsObject(data) !== 0)
			throw new TypeError(`'data' should be a type Array`);
		if (guild_id === undefined)
			throw new TypeError(`Cannot read property 'guild_id' of undefined`);
		if (key === undefined)
			throw new TypeError(`Cannot read property 'key' of undefined`);
		if (value === undefined)
			throw new TypeError(`Cannot read property 'value' of undefined`);

		let dataByGuild = this.getDataByGuild(data, guild_id);

		if (dataByGuild)
			dataByGuild[key] = value;
		else
			data.push({"guild_id": guild_id, [key]: value});
	}

	/**
	 * Delete key in the data based on the guild_id
	 * @param data - Array of data
	 * @param guild_id - Id of guild server
	 * @param key
	 */
	static deleteKey(data, guild_id, key)
	{
		if (data === undefined)
			throw new TypeError(`Cannot read property 'data' of undefined`);
		if (Util.isArrayOrIsObject(data) !== 0)
			throw new TypeError(`'data' should be a type Array`);
		if (guild_id === undefined)
			throw new TypeError(`Cannot read property 'guild_id' of undefined`);
		if (key === undefined)
			throw new TypeError(`Cannot read property 'key' of undefined`);
		let dataByGuild = this.getDataByGuild(data, guild_id);

		delete dataByGuild[key];
	}

	/**
	 * Removes data from a server
	 * @param data - Array of data
	 * @param guild_id - Id of guild server
	 */
	static remove(data, guild_id)
	{
		if (data === undefined)
			throw new TypeError(`Cannot read property 'data' of undefined`);
		if (Util.isArrayOrIsObject(data) !== 0)
			throw new TypeError(`'data' should be a type Array`);
		if (guild_id === undefined)
			throw new TypeError(`Cannot read property 'guild_id' of undefined`);
		for (let i = 0; i < data.length; i++)
		{
			if (data[i].guild_id !== guild_id)
				continue;
			data.splice(i, 1);
		}
	}

	/**
	 * Delete all data
	 * @param data - Array of data
	 */
	static clear(data)
	{
		if (data === undefined)
			throw new TypeError(`Cannot read property 'data' of undefined`);
		if (Util.isArrayOrIsObject(data) !== 0)
			throw new TypeError(`'data' should be a type Array`);
		data.splice(0, data.length);
	}
}