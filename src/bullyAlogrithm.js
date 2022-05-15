const { default: Axios } = require("axios");
const {prepURL} = require('./util');
const ConsulConfig = require('./consul');
const express = require('express');


const bullyApp = express();
const consul = new ConsulConfig();

let isAwaitingNewCoordinator = false;
let coordinatorNodeID = null;
let currentNodeID = null;

async function electLeader(currentNodeID,nodes) {
    registerEndpoints(currentNodeID,bullyApp, nodes);
    this.currentNodeID = currentNodeID;
    console.log('cordinatorNodeID', coordinatorNodeID);
    setInterval(() => pingCoordinator(coordinatorNodeID), 5000);
    if(coordinatorNodeID == null) {
        //console.log('cordinatorNodeID', coordinatorNodeID);
        let currentNode = nodes.filter(x => x['ID'] == currentNodeID)[0];
        // if(currentNode.Meta.masterID) {
        //     cordinatorNodeID = currentNode.Meta.masterID;
        // }
    }
    startElection(currentNodeID, nodes);
    
}

async function registerEndpoints(currentNodeID,bullyApp, nodes) {
    
    bullyApp.get('/alive', (req, res) => res.sendStatus(200));
    
    bullyApp.get('/election', (req, res) => {
        res.sendStatus(200);
        startElection(currentNodeID,nodes);
    });

    bullyApp.get('/victory', (req, res) => {
        isAwaitingNewCoordinator = false;
        coordinatorNode = nodes.filter(x => x['ID'] == req.query.key)[0];
        for(let node in nodes) {
            celebrateVictory(nodes[node]['ID']);
        }
        res.sendStatus(200);
        console.log(`Set ${req.query.key} as the new coordinator`);
    });

}

async function pingCoordinator(coordinatorNodeID) {

    const nodes = await consul.getActiveNodes();
    
    let activeNodes = [];
    for(let node in nodes) {
        activeNodes.push(nodes[node]);
    }
    try {
        
        console.log('cord', coordinatorNodeID);
        const coordinatorNode = consul.getMasterNode(coordinatorNodeID);
        if(coordinatorNode) {
            let url = prepURL(coordinatorNode['Address'], coordinatorNode['Port'], 'alive');;
            await axios.get(url.href);
            console.log(`Coordinator ${coordinatorNodeID} is up`);
        }

    } catch(error) {
        isAwaitingNewCoordinator = false;
        console.log(`Coordinator ${coordinatorNodeID} is down!`);
        startElection(currentNodeID,activeNodes);
    }
}

async function startElection(currentNodeID, nodes){
    console.log('Starting election...');
    isAwaitingNewCoordinator = true;
    let candidates = nodes.slice().sort((a, b) => b.ID - a.ID);
    for(candidate of candidates) {
        if(candidate.ID == currentNodeID) {
             console.log(`Declaring self as new coordinator: ${currentNodeID}`);
            
            const update = await updateAsMasterNode(currentNodeID);
            coordinatorNodeID = currentNodeID;

            if(update.statusText == 'OK') {
                const x = await Promise.all(
                     nodes.map(async node => {
                        let url = prepURL(node['Address'], node['Port'], 'victory');
                        const response = await Axios.get(url, {params: {key: currentNodeID}});
                        return response;

                    })
                ).catch(() => {});
            }
            break;
            
        }else {
            try{
                let url = prepURL(candidate['Address'], candidate['Port'], 'election');
                await Axios.get(url);

                setTimeout(() => {
                    if(isAwaitingNewCoordinator) {
                        let activeNodes = [];
                        for(let node in nodes) {
                            activeNodes.push(nodes[node]);
                        }
                        startElection(currentNodeID, activeNodes);
                    }
                }, 10000);
                break;
            }catch(err) {
                console.log('error', err);
            }
        }
    }
}

async function updateAsMasterNode(nodeID) {
    const data = {
        "Name": nodeID.toString(),
        "ID": nodeID.toString(),
        "Meta": {
            "role": "master"
        }
    }
   return await consul.updateNodeInfo(data);
}

async function celebrateVictory(nodeID, cordinatorNodeID) {
    const data = {
        "Name": nodeID.toString(),
        "ID": nodeID.toString(),
        "Meta": {
            "masterID": cordinatorNodeID
        }
    }
   await consul.updateNodeInfo(data);   
}

module.exports = {
    electLeader,
    bullyApp
}