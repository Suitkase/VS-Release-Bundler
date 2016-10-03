"use strict"
const prt = require("../prt")

var assemblies = []

function Assembly(config,version){
    this.releasePath = null
    this.version = version
    this.config = config
    this.setReleasePath = function(path){
        this.releasePath = path
    }
    this.getName = function(){
        return this.config.assemblyName
    },
    this.toString = function(){
        return "[Name]:" + this.getName() + " [Version]:"+ this.version + " [ReleaseDir]:" + this.releasePath
    }
    this.getBundleDir = function(){
        return this.config.assemblyName + "_" + this.version
    }
    this.getBundleParentPath = function(){
        return this.config.bundleParentDir + "_" + this.version
    }
}

function load(config,version, cb){
    if( config && config.length > 0){
        config.forEach(function(item) {
            assemblies.push( new Assembly(item,version) )
        });
        cb( null,assemblies)
    }
    else{       
        cb(new Error("No valid configuration found. See config.json and check command line arguments"))
    }    
}

exports.load = load