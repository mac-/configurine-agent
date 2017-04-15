var fs = require('fs'),
	ConfigurineClient = require('configurine-client'),
	_ = require('underscore'),
	jsBeautifier = require('js-beautify'),
	opter = require('opter'),
	version = require('./package.json').version,
	options = require('./options.js'),
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
	associationPriority = {
		applications: (config.associationPriority === 'app') ? 2 : 1,
		environments: (config.associationPriority === 'env') ? 2 : 1
	},
	containsAppAssociation = function(arr, obj) {
		return !!_.find(arr, function(item) { return (item.name === obj.name && _.intersection(item.versions, obj.versions).length === 1); });
	},

	// picks a config entry from a collection based on the following priority:
	//  - has both the matching app and env association
	//  - has one of a matching app or env association (app or env may have a higher priority based on app settings (associationPriority))
	//  - has no matching app or env associations
	pickOne = function(entries, appAssociation) {
		var sortedEntries = _.sortBy(entries, function(entry) {
			var priority = 0;
			for (var prop in associationPriority) {
				if (entry.hasOwnProperty('associations') && entry.associations.hasOwnProperty(prop) &&
					(_.contains(entry.associations[prop], config.environment) || containsAppAssociation(entry.associations[prop], appAssociation))) {
					priority += associationPriority[prop];
				}
			}
			return priority;
		});
		return sortedEntries.shift();
	},

	syncFiles = function() {
		_.each(config.appsToManage, function(appToManage) {
			var appAssociation = {
				name: appToManage.appName,
				versions: [appToManage.appVersion]
			},
			configurineClientOptions = {
				associations: {
					applications: [appAssociation],
					environments: [config.environment]
				}
			};

			log('info', 'Attempting to read file: ' + appToManage.configFile);
			var configFileJson;
			try {
				configFileJson = JSON.parse(fs.readFileSync(appToManage.configFile));
			}
			catch (ex) {
				return log('error', 'Unable to read/parse file: ' + appToManage.configFile, ex);
			}
			var names = _.keys(configFileJson);
			client.getConfigByName(names, configurineClientOptions, function(err, result) {
				if (err) {
					return log('error', 'Error retrieving config (' + names + ') from Configurine. ', err);
				}
				var prop, groups = _.groupBy(result, function(entry) { return entry.name; });
				for (prop in groups) {
					if (groups.hasOwnProperty(prop)) {
						if (groups[prop].length === 1) {
							configFileJson[prop] = groups[prop][0].value;
						}
						else {
							configFileJson[prop] = pickOne(groups[prop], appAssociation).value;
						}
					}
				}
				fs.writeFileSync(appToManage.configFile, jsBeautifier(JSON.stringify(configFileJson), { 'indent_char': indentCharacter, 'indent_size': indentSize }));
				log('info', 'Updated file: ' + appToManage.configFile);
			});
		});
	};


syncFiles();

if (!config.runOnce) {
    setInterval(function() {
        syncFiles();
    }, config.interval * 1000);
}
