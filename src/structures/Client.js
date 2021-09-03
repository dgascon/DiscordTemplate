const Discord = require('discord.js');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const path = require('path');
const ms = require('ms')

const Event = require('./Event.js');
const Command = require('./Command.js');
const Util = require('./Util.js');
const JsonUtil = require('./JsonUtil.js');

/**
 * Client based on Client of Discord.js. EventHandler, CommandHandler
 * @type {Client}
 */
module.exports = class Client extends Discord.Client {
	constructor(options = {}) {
		if (options.intents === undefined)
			options.intents = 32767
		super(options);

		if (this.config_path === undefined)
			this.config_path = "./config.json";
		this.config = JsonUtil.read(this.config_path, false);

		if (Object.keys(this.config).length <= 0 )
			this.#defaultConfig();

		//catches ctrl+c event
		process.on('SIGINT', this.exitHandler.bind(null, this, ""));

		this.#validate();
	}

	/**
	 * Check basic data for the bot
	 */
	#validate()
	{
		if (typeof this.config !== 'object')
			throw new TypeError(`Config should be a type of Object.`);

		if (!this.config.token)
			throw new Error('You must pass the token for the client.');

		if (!this.config.prefix)
			throw new Error('You must pass a prefix for the client.');

		if (typeof this.config.prefix !== 'string')
			throw new TypeError('Prefix should be a type of String.');
		this.prefix = this.config.prefix;

		if (this.config.delete_time && typeof this.config.delete_time !== 'number')
			throw new TypeError('Delete_time should be a type of Integer.')
		if (this.config.delete_time && this.config.delete_time <= 0)
			throw new TypeError('Delete_time must be a positive number')
		if (!this.config.delete_time)
			this.delete_time = 5000;
		else
			this.delete_time = this.config.delete_time;
	}

	/**
	 * Start the bot
	 * @param token - Default token of the class
	 */
	start(token = this.config.token)
	{
		super.login(token);
	}

	/**
	 * Load the events contained in the folder
	 * @param folder - By default "events"
	 * @returns {Promise<void>}
	 */
	async loadEvents(folder = "events")
	{
		let directory = `${Util.directory}${folder}/**/*.js`;
		if (this.events === undefined)
			this.events = new Discord.Collection();
					console.log(directory);
		await glob(directory).then(events => {
			if (!events.length)
				throw Error(`Event list is empty, the folder [${folder}] may not exist`)
			for (const eventFile of events)
			{
				delete require.cache[eventFile];

				const { name } = path.parse(eventFile);
				const File = require(eventFile);

				if (!Util.isClass(File))
					throw new TypeError(`Events [${name}] doesn't export a class.`);

				const event = new File(this, name.toLowerCase());
				if (!(event instanceof Event))
					 throw new TypeError(`Event [${name}] doesn't belong in events.`);
				this.events.set(event.name, event);

				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		})
	}

	/**
	 * Load the commands contained in the folder
	 * @param folder - By default "commands"
	 * @returns {Promise<void>}
	 */
	async loadCommands(folder = "commands")
	{
		let directory = `${Util.directory}${folder}/**/*.js`;
		if (this.commands === undefined)
			this.commands = new Discord.Collection();
		await glob(directory).then(commands => {
			if (!commands.length)
				throw Error(`Command list is empty, the folder [${folder}] may not exist`)
			for (const commandFile of commands)
			{
				delete require.cache[commandFile];

				const { name } = path.parse(commandFile);
				const File = require(commandFile);

				if (!Util.isClass(File))
					throw new TypeError(`Command [${name}] doesn't export a class.`);

				const command = new File(this, name.toLowerCase());
				if (!(command instanceof Command))
					 throw new TypeError(`Command [${name}] doesn't belong in commands.`);
				this.commands.set(command.name, command);

				if (command.aliases.length)
				{
					for (const alias of command.aliases) {
						if (this.commands.has(alias))
							throw Error(`Duplicate commands or aliases [${alias}]`);
						this.commands.set(alias, command);
					}
				}
			}
		})
	}

	/**
	 * Exit process with predefined message.
	 * @param client
	 * @param message
	 */
	exitHandler(client, message)
	{
		if (message.length > 0)
			console.log(message);
		else
		{
			console.log(`The bot remained active for ${ms(client.uptime, { long: true })}`)
		}
		process.exit(0)
	}

	/**
	 * Create the configuration file with default keys
	 */
	#defaultConfig()
	{
		this.config.token = "INSERT_TOKEN_HERE";
		this.config.prefix = "$";
		this.config.delete_time = 5000;
		JsonUtil.write(this.config_path, this.config);
	}
}