const { default: Axios } = require("axios");
const {ConsulConfig} = require('./consul');
const {removeMasterNode} = require('./util');

const assignedRoles = (nodes) => {
   
    let roles = [];

    let activeNodesWithouMaster = removeMasterNode(nodes);
    

    for(key in roles) {
        combined = {key: (roles[key], ports_array[key])}
    }

    let data_acceptor = {"role": "acceptor"};
    let data_learner = {"role": "learner"};
    let data_proposer = {"role": "proposer"};

    for(i in range(2, activeNodesWithouMaster)) {
       let role = 'Acceptor';
       let key = nodes[i];
       let value = role;
       roles[key] = value;

    }

    for(i in range(3, activeNodesWithouMaster)) {

       let role = 'Learner';
       let key = nodes[i];
       let value = role;
       roles[key] = value;        
    }

    for( node in combined) {
        if (combined[each][0] == 'Acceptor') {
            let url = 'http://localhost:%s/acceptor' % combined[node][1]
        
            Axios.post(url, data_acceptor);
        }else if (combined[each][0] == 'Learner') {
            let url = 'http://localhost:%s/learner' % combined[node][1]
    
            Axios.post(url, data_learner)
        }else {
            let url = 'http://localhost:%s/proposer' % combined[node][1]
    
            Axios.post(url, data_proposer)
        }

    }


    return nodes;
}


const checkMyRole = (node, role) => {
    if(node['Meta']['Role'] == role) return true;
    return false;
}



module.exports = {
    assignedRoles
}