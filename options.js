module.exports = {
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
	appsToManage: {
		argument: 'array',
		description: 'An array of json objects describing the apps to manager.  For example: [{"appName": "foo", "appVersion": "1.0.0", "configFile": "/opt/foo/config.js"}]',
		required: true
	},
	indentSize: {
		argument: 'number',
		description: 'The number of spaces to indent the JSON with. 0 sets the indent to the TAB character.',
		defaultValue: 0
	},
	environment: {
		argument: 'name',
		description: 'The name of the environment that the config entries are associated to',
		defaultValue: 'production'
	},
	associationPriority: {
		argument: 'association',
		description: 'When configurine returns multiple results, the agent needs to determine which associations are more important when deciding how to choose only one. Valid values are app and env',
		defaultValue: 'app'
	},
	interval: {
		argument: 'time',
		description: 'The number of seconds to wait before each attempt to sync the config',
		defaultValue: 120
	},
	runOnce: {
		argument: 'runOnce',
		description: 'Turn off polling for the agent. Update the config file once, then quit.'
	}
};
