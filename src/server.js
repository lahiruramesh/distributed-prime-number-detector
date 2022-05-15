const express = require('express')
const app = express()
const ConsulConfig = require('./consul');
const {generateUniqueID} = require('./util');
const {electLeader, bullyApp} = require('./bullyAlogrithm');

let activeAllNodes = [];

const port = process.argv[2] || 3000;

const consul = new ConsulConfig();
let existNode = null;
let uuid = null;

(async () => {
    let nodeExists = false;
    
    const allActiveNodes = await consul.getAllNodes();
    for(node in allActiveNodes.data) {

        activeAllNodes.push(allActiveNodes.data[node]);
        
        // Check node available in same port
        if(allActiveNodes.data[node]['Port'] == port) {
            existNode = allActiveNodes.data[node]['ID'];
            nodeExists = true; break;
        }
    }

    if(!nodeExists) {
        uuid = generateUniqueID();
        consul.registerService(uuid.toString(), port);
    }else{
        uuid = existNode;
        console.log(`This node ${existNode} is already available on ${port}`);   
    }
    if(uuid) {
        await init(uuid,activeAllNodes);
    }
   
})();


async function init(uuid,activeAllNodes) {
    console.log('sss', uuid);
    await electLeader(uuid,activeAllNodes);
}

app.get('/health', (req ,res) => res.send('OK'));

app.get('/', (req ,res) => res.send(`node: ${uuid}`));

app.use(bullyApp);

app.listen(port, () => {
    console.log(`Server listening`, port);
})