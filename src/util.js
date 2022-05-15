require('fs');
const util = require('util');
const fs = require('fs');
const readline = require('readline');
  

node = 1;

// const logFile = fs.createWriteStream(`../logs/${node}log.log`, { flags: 'a' });
// var logStdout = process.stdout;

// console.log = function () {
//   logFile.write(util.format.apply(null, arguments) + '\n');
//   logStdout.write(util.format.apply(null, arguments) + '\n');
// }
// console.error = console.log;

const generateUniqueID = ()  => {

    return (Math.round(new Date().getTime()/1000) + Math.floor(Math.random() * 10) + 1);

}

const removeMasterNode = (nodes) => {
    return nodes.filter( node => {['Meta']['Role'] != 'master'});
}

const prepURL = (address, port, path) => {
    return `http://${address}:${port}/${path}`;
}



const readNumberFromFile = () => {
 
    const file = readline.createInterface({
        input: fs.createReadStream('primeNumbers.txt'),
        output: process.stdout,
        terminal: false
    });
    
    let number = null;
    file.on('line', (line) => {
        number = line;
        console.log(line);
    });

    return number;
}


module.exports = {
    generateUniqueID,
    removeMasterNode,
    prepURL,
    readNumberFromFile
}



