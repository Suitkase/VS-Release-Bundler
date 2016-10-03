"use strict"
const prt = require("../prt")
const dirExists = require('directory-exists')
const copydir = require("copy-dir")
const fs = require("fs")
const path = require('path')
const mkdir = require("mkdir-p")
const async = require("async")

function createDir(dir){
    if( !dirExists.sync(dir) ){
        prt.p("Create dir " + dir)
        mkdir.sync( dir )
    }else{
        prt.p("Dir already exists " + dir)
    }
}

function doBundle( assembly, callback ){
    
    prt.p("Do Bundle operations for " + assembly.getName() )
    
    let releaseDir = assembly.releasePath;
    let err = null;

    //Ensure the bundle parent dir exists create if required
    createDir( path.normalize( assembly.getBundleParentPath() ) )

    //Create the bundle target dir for the assembly ensuring doesn't already exist
   let bundlePath = path.join(assembly.getBundleParentPath()
                             ,assembly.getBundleDir())
    
    createDir( bundlePath )

    try{
        releaseDir = path.normalize( assembly.releasePath ) //TypeError is thrown if path is not a string.
        
        //Copy the assembly's' release directory contents into the bundle target directory
        //excluding the search key file from output if configured to do so
        copydir.sync( path.normalize(assembly.releasePath), bundlePath, function(stat, filepath, filename){
        
                if( assembly.config.excludeReleaseSearchFile == "true"){
                    if(stat === 'file' && path.parse(filepath).base === assembly.config.releaseSearchFile) {
                        return false
                    }
                }
                return true
            })
    }
    catch(e){
        prt.p("Error on copying assembly to bundle dir.  Check assembly's releasePath is valid.")
        prt.p("assembly.releasePath = " + assembly.releasePath)
        prt.p()

        err = new Error("Error on copying assembly to bundle dir");
    }     

    //Run assembly scripts on bundle dir


    callback(err)
}

function doneBundle(err){
        prt.p("Bundles done")
}

exports.bundle = function bundle(assemblies, callback){
    
    async.eachSeries( assemblies, doBundle,function(err){
        doneBundle();
        
        if(err){
            callback(err)
            return
        } 
        callback(null,assemblies)
    })
   
   
   
    
}