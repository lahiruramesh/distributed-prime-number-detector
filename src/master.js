const fs = require('fs');
const readline = require('readline');
  

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

const scheduleJob = (nodes) => {

    // TODO: 
}

const assignRoles = (role , node) => {
    
}


module.exports = {
    readNumberFromFile,
    scheduleJob
    assignRoles
}