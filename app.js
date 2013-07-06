var ConfigurineClient = require('configurine-client'),
	opter = require('opter'),
	version = require('./package.json').version,
	options = {
		configurineHost: {
			argument: 'host',
			description: 'The Configurine protocol, host, and port'
		},
		configurineClientId: {
			argument: 'id',
			description: 'The Configurine client ID'
		},
		configurineKey: {
			argument: 'key',
			description: 'The Configurine shared key'
		},
		configFile: {
			argument: 'location',
			description: 'The location of the file to sync'
		}
	},
	config = opter(options, version),
	client = new ConfigurineClient({
		host: config.configurineHost,
		clientId: config.configurineClientId,
		sharedKey: config.configurineKey
	}),

	syncFile = function() {
		console.log('syncing...');
	};

setInterval(function() {
	syncFile();
}, 2 * 60 * 1000);