const http = require('http');
const ConsulConfig = require('./consul');
const {generateUniqueID} = require('./util');

const port = process.argv[2] || 3003;

const nodeId = generateUniqueID();

const consul = new ConsulConfig(nodeId, port);

console.log(generateUniqueID());




http.createServer( (req, res) => {

    const {url, method} = req;
    //Test health check
    if (url === '/health') {
        res.end('OK!');
        
    }

    if(url === '/findPrime') {


    }

    if(url === '/learner') {

    }

    if(url === '/validate') {

    }

    if(url === '/accept') {

    }


    if(url === '/asignRole') {

    }



}).listen(port, () => {
    console.log(`server listening:`, port);
});