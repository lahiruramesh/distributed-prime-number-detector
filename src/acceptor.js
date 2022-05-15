const { default: Axios } = require("axios");

const acceptMessage = () => {
    let learners = [];
    const response = Axios.get('http://127.0.0.1:8500/v1/agent/services');
    let nodes = response.json();

    for(node in nodes) {
        if(len(nodes[node]['Meta']) > 0) {
            if(nodes[node]['Meta']['Role'] === 'Proposers') {
                let node = nodes[each]['Service'],
                role = nodes[each]['Port'];
                let key = node;
                value = role,
                learners[key] = value   
            }
        }
    }

    let res;
 
    for( leaerner in learners) {
      res =  Axios.post('http://localhost:%s/finalResult'%learners[leaerner]);
    }
    return url
}



module.exports = {
    acceptMessage
}