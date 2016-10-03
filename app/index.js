const argv = require('minimist')(process.argv.slice(2));
const bundler = require('./bundler');
const prt = require("./prt");

function usage(){
    prt.p()
    prt.p("Usage");
    prt.p("node index.js <config.key1> <config.key2> -v <version>" );
    prt.p( "E.G");
    prt.p("node index.js web controller admin relay ts worker -v 1.2.3.4")
    prt.p()
}

prt.p( "Deployment Bundler")

//Validate command line arguments
if( argv._.length == 0 || argv.v == undefined) {
    usage()
} 
else if (typeof(argv.v) === 'boolean') {
    //"true" when -v is provided without a value
    usage()
}
else{
    bundler.run( argv._,argv.v);
}