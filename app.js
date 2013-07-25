var fs = require('fs'),
	ConfigurineClient = require('configurine-client'),
	_ = require('underscore'),
	jsBeautifier = require('js-beautify'),
	async = require('async'),
	opter = require('opter'),
	version = require('./package.json').version,
	options = {
		configurineHost: {
			argument: 'host',
			description: 'The Configurine protocol, host, and port',
			required: true
		},
		configurineClientId: {
			argument: 'id',
			description: 'The Configurine client ID',
			required: true
		},
		configurineKey: {
			argument: 'key',
			description: 'The Configurine shared key',
			required: true
		},
		configFile: {
			argument: 'location',
			description: 'The location of the file to sync',
			required: true
		},
		indentSize: {
			argument: 'number',
			description: 'The number of spaces to indent the JSON with. 0 sets the indent to the TAB character.',
			defaultValue: 0
		},
		appName: {
			argument: 'name',
			description: 'The name of the application that the config entries are associated to',
			required: true
		},
		appVersion: {
			argument: 'version',
			description: 'The version of the application that the config entries are associated to',
			required: true
		},
		environment: {
			argument: 'name',
			description: 'The name of the environment that the config entries are associated to',
			defaultValue: 'production'
		},
		interval: {
			argument: 'time',
			description: 'The number of seconds to wait before each attempt to sync the config',
			defaultValue: 120
		}
	},
	config = opter(options, version),
	//TODO: provide multiple log transports
	log = function(loglevel, msg, object) { console.log(loglevel, msg, object); },
	client = new ConfigurineClient({
		host: config.configurineHost,
		clientId: config.configurineClientId,
		sharedKey: config.configurineKey,
		loggingFunction: log
	}),
	indentCharacter = (config.indentSize > 0) ? ' ' : '\t',
	indentSize = Math.max(1, config.indentSize),
	configurineClientOptions = {
		associations: {
			applications: [{
				name: config.appName,
				version: config.appVersion
			}],
			environments: [config.environment]
		}
	},

	syncFile = function() {
		log('info', 'Attempting to read file: ' + config.configFile);
		var configFileJson;
		try {
			configFileJson = JSON.parse(fs.readFileSync(config.configFile));
		}
		catch (ex) {
			return log('error', 'Unable to read/parse file: ' + config.configFile, ex);
		}
		var names = _.keys(configFileJson);
		client.getConfigByName(names, configurineClientOptions, function(err, result) {
			if (err) {
				return log('error', 'Error retrieving config (' + names + ') from Configurine. ', err);
			}
			var i, counts = _.countBy(result, function(entry) { return entry.name; });
			for (i =0; i < result.length; i++) {
				if (counts[result[i].name] > 1) {
					return log('error', 'There are multiple results for config (' + result[i].name + '). Doing nothing until conflict is resolved.');
				}
				configFileJson[result[i].name] = result[i].value;
			}
			
			fs.writeFileSync(config.configFile, jsBeautifier(JSON.stringify(configFileJson), { 'indent_char': indentCharacter, 'indent_size': indentSize }));
			log('info', 'Updated file: ' + config.configFile);
		});
	};


syncFile();

setInterval(function() {
	syncFile();
}, config.interval * 1000);