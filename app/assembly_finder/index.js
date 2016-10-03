"use strict"
const dirSearch = require('directory-search');
const prt = require("../prt")
const async = require("async")
const path = require("path");

function doSearch(assembly,callback){
    
    let search = {dir:assembly.config.releaseParentPath, 
                 file:assembly.config.releaseSearchFile
                 }
    let error = undefined;                  

    dirSearch(search.dir, search.file, function(err, results){
         if (err) {
            callback(err)
			return
		 }	
         
         if(results.length != 1){
            
			error = new Error ('Assembly search result not equal to 1 [' + results.length + '] for assembly search. Check config settings and releaseSearchFile ['+ search.file +'] exists')
			
			results.forEach( function(item){
				prt.p(item)
			})
			
            callback(error)
            return;
         }
        
        prt.p("Assembly search found search file " + results )
        
        //Extract the parent dir containing the search file
        let fileInfo = path.parse( results[0])
        prt.p("Parse parent dir of search file " + fileInfo.dir )
        assembly.setReleasePath(  path.normalize( fileInfo.dir) )
        callback()
    })    
}


function doneSearch(err){
   prt.p('Finding Assemblies complete');
}

   
function find(assemblies, callback){
   async.eachSeries(assemblies,doSearch,function(err){
        if(err){
            callback(err);
            return;
        }

        doneSearch();
        callback(null,assemblies)
    })
}

exports.find = find 