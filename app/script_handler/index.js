"use strict"
const exec = require('child_process').exec
const dirExists = require('directory-exists')
const prt = require("../prt").p
const async = require("async")
const path = require('path')

function execCommand(command, callback){
    let startDT = new Date()
    let startMS = Date.now()
    let endMS = undefined
    let elapsedMS = undefined
    
    prt(`Executing command:: ${command.cmd} starting at::${startDT.toString()}`)
    exec(command.cmd,{cwd:command.cwd},function(err,stdout,stderr){
        
        endMS = Date.now()
        elapsedMS = endMS - startMS
        execCommandeHandler(err,stdout,stderr, elapsedMS, callback)
    })
}

function execCommandeHandler(err,stdout,stderr, elapsed, callback){    

    prt("Executing command handler")

    if (err) {
        prt(`Exec script failed ${err}`)
        callback(err)
        return;
    }    
    if(stdout){
        prt('Exec stdout')
        prt(`${stdout}`);
    }

    if( stderr){
        prt('Exec stderr')
        prt(`${stderr}`);
    }
        
    prt('Executing command handler completed elapsed milliseconds::'+elapsed)
    prt();    
    callback()
}


function commandRun(command, callback){   
    if(command && command.cmd){
        prt(`Run command invoked ${command.cmd}`)
        if( command.cwd ){
            prt(`Run command checking supplied command directory::${command.cwd}`)
            if(!dirExists.sync(command.cwd)){
             callback(new Error(`Command directory::${command.cwd} does not exist`))
             return
            }
        }else{
             callback(new Error(`Command working directory was not supplied`))
             return
        }    
        execCommand( command, callback )
    }else{
        prt("No command to run")
        callback()
    }
}


function commandsRunner( commands, workingDir,cb ){
    
    let runConfig = {}
    
    prt(`Commands runner for dir::${workingDir} commands to run:: ${commands.length}`)
    
    async.eachSeries(commands,
        function(command, callback){
                runConfig.cmd = command
                runConfig.cwd = workingDir
                commandRun( runConfig, callback )
            },
            function(err){
                prt("Commands Running complete")
                cb()
            })
}


function doAssemblyShellCommands(assembly, callback){
     prt('Do Assembly commands for' + assembly.toString() )
    
     let bundlePath = undefined
     
     if( assembly && assembly.config && assembly.config.shellCommands && assembly.config.shellCommands.length > 0) {
        
         bundlePath = path.join(assembly.getBundleParentPath()
                              ,assembly.getBundleDir())
                         
        prt(`Do Assembly commands prepare directory::${bundlePath}`)  
        
        commandsRunner( assembly.config.shellCommands, bundlePath, callback)     
    }
    else{
          prt(`No command actions for assembly name::${ assembly.getName() }`)
          callback()     
     }     
}



function run(assemblies, cb){
    prt("Run shell commands for assemblies count::" + assemblies.length)
 
    async.eachSeries( assemblies, doAssemblyShellCommands, function(err){
        prt("Assembly shell commands Done")
         cb(null,"Run shell commands Complete")
    })
}


exports.run = run;
