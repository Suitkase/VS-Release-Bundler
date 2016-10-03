"use strict"
const prt = require("../prt").p
const config = require('simpler-config').load(require('../config.json'))
 
 /* Select the assembley configuration based on the user supplied configuration 'key' */
function load( configkeys, cb ){
   
    let data = []

    if( configkeys && configkeys.length > 0){
        
        if( configkeys.length == 1 && configkeys[0].toLowerCase() == "all"){
            configkeys = [];  //clear and re-populate
            for(var key in config){
                configkeys.push( key )
            }
        }

        configkeys.forEach(function(key) {
            if( key in config ){
                data.push( config[key] )
            }else{
                prt(`Warning no configuration found for ${key}` )
            }
        });
        
        cb(null,data);
    }
    else{
         cb("no configuration");
    }
}

exports.load = load;