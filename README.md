# configurine-agent

Helper to be run in parallel with application that is consuming Configurine objects.  

# Prerequesites

  * Configurine must already have the client created
  * JSON file must be a properly formatted json file and all configs that are wanted must be filled in as keys


# deployment

node app.js [options]

# options
```
    -V, --version                             output the version number
    -c, --configurine-host <host>             (Required) The Configurine protocol, host, and port
    -C, --configurine-client-id <id>          (Required) The Configurine client ID
    -k, --configurine-key <key>               (Required) The Configurine shared key
    -f, --config-file <location>              (Required) The location of the file to sync
    -i, --indent-size <number>                (Optional) The number of spaces to indent the JSON with. 0 sets the indent to the TAB character. Defaults to: 0
    -a, --app-name <name>                     (Required) The name of the application that the config entries are associated to
    -A, --app-version <version>               (Required) The version of the application that the config entries are associated to
    -e, --environment <name>                  (Optional) The name of the environment that the config entries are associated to Defaults to: "production"
    -p, --association-priority <association>  (Optional) When configurine returns multiple results, the agent needs to determine which associations are more important when deciding how to choose only one. Valid values are app and env Defaults to: "app"
    -I, --interval <time>                     (Optional) The number of seconds to wait before each attempt to sync the config Defaults to: 120

```

# example

```
node app.js -c "http://localhost:8088" -C "myclient" -k "12345f3-0892-4908-b50b-1bd2352313f2" -f "./AgentConfig.json" -a "SomeApplicationId" -A "1.0.0" -e "development" -p "app" 
```


