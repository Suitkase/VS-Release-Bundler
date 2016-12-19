# VS-Release-Bundler

A command line utility to simply pull together all the various `Release` directories that get published to the file-system by Visual Studio during the build of a multi-project solution.

The utility was writen in Javascript to be run by Node

## Setup. 
    
To get started add a `config.json` file based on the [config.json.sample](./app/config.json.sample). The program currently expects to find the `config.json` file in it's program directory. The config file is used to:
- Assign a 'logical' name to each of the release targets
- Set the search file used to locate each of release directories
- Indicate the output directory for the release bundle
- Define any script commands that are to be run as part of the bundling operations. For example run `npm install` for web based assemblies

Sample config.json 

```
{
    "web": {
        "assemblyName": "SAMPLE_web",
        "releaseParentPath": "c:/builds/web/",
        "releaseSearchFile": "web.bundle",
        "excludeReleaseSearchFile": "true",
        "bundleParentDir": "C:/bundles/SAMPLE",
        "shellCommands": [
            "npm install",
            "npm run predeploy"
        ]
    },
    "relay": {
        "assemblyName": "SAMPLE_relay",
        "releaseParentPath": "c:/builds/web",
        "releaseSearchFile": "relay.bundle",
        "excludeReleaseSearchFile": "true",
        "bundleParentDir": "c:/bundles/SAMPLE",
        "shellCommands": []
    },
    "controller": {
        "assemblyName": "SAMPLE_controller",
        "releaseParentPath": "c:/workspace/SAMPLE_PROJECT/Controller/bin/Release",
        "releaseSearchFile": "SAMPLE_Control.exe",
        "excludeReleaseSearchFile": "false",
        "bundleParentDir": "C:/bundles/SAMPLE",
        "shellCommands": []
    },
    "worker": {
        "assemblyName": "SAMPLE_worker",
        "releaseParentPath": "c:/workspace/SAMPLE_PROJECT/worker/bin/Release",
        "releaseSearchFile": "SAMPLE_Worker.exe.config",
        "excludeReleaseSearchFile": "false",
        "bundleParentDir": "C:/bundles/SAMPLE",
        "shellCommands": []
    }
}
```
The sample config is a mock of 4 different 'projects' within a Visual Studio solution. In the example `Web` and `Relay` are Web assemblies and `Controller` and `Worker` are non-web assemblies. Each project will have it's release artifacts copied in the `bundlerParentDir` 


## Running the Utility
1. Within `Visual Studio` you run the normal `release` / publishing build steps for all assemblies within the solution.

2. Once the config.json file is setup you run the utility on the command line passing in the `logical names` separated by spaces of the projects that are to be bundled together along with a version number. **Note** that the version number is required and will be appended to bundle output directory name.

For example based on the sample config to  bundle the `web` and the `controller` components only
```
node app.js web controller -v 1.2.3
```

To bundle the `controller` `relay` and the `worker`
```
node app.js controller relay worker -v 1.2.3
```

To bundle all the assemblies found in the config.json file
```
node app.js all  -v 1.2.3
```

**Note on Current Limitations** : The publishing directory used by Visual Studio to output Web Assemblies is limited to a single copy of the same web assembly.  This is because the directory name of the published web assembly is changeable and to cater for this a 'search' file is used to locate each of web assemblies. In cases where the same web assembly exists multiple times the duplicate copies of the search file makes the wheels fall off.
   
