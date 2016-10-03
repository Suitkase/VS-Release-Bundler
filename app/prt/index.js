"use strict"

exports.p = function prt() {
    if (arguments.length == 0) {
        console.log('#')
    }
    else {
        for (let i = 0, j = arguments.length; i < j; i++) {
            console.log('# ', arguments[i])
        }
    }
}