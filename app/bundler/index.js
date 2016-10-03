"use strict"
const configHandler = require("../config_handler")
const async = require("async")
const assemblyHandler = require("../assembly_handler")
const assemblyFinder = require("../assembly_finder")
const bundlerHandler = require("../bundler_handler")
const scriptHandler = require("../script_handler")
const prt = require("../prt")

function bundle(configkeys, version){
    
    async.waterfall([
        function loadConfig( callback ){
             prt.p("Bundler Loading Config");
            configHandler.load( configkeys, callback )
        },
        function loadAssemblies( configData, callback ){
            prt.p("Bundler Loading Assemblies")
            assemblyHandler.load( configData, version, callback )
        },
        function findReleaseDirs(assemblies,callback){
               prt.p("Bundler finding Assemblies release directories")
                assemblyFinder.find(assemblies, callback)  
        },
        function bundleAssemblies( assemblies, callback){
            prt.p("Bundler bundling Assemblies");
            bundlerHandler.bundle(assemblies,callback)
        },
        function runBundleScripts(assemblies, callback){
            prt.p("Bundler run Assemblies shell commands");
            scriptHandler.run( assemblies,callback)            
        }
    ],
    function(err,results){
        if( err ) {
            console.log( err )
            return
        }
        else{   
            prt.p("Bundling Completed");
        }    
    })
}

exports.run = bundle; 