const { default: Axios } = require('axios');
const Consul = require('consul');

class ConsulConfig {
    constructor() {    
        this.consul = new Consul({
            host: '127.0.0.1',
            port: 8500,
            promisify: true
        });
    }

    registerService (serviceName, servicePort){
        const helathCheck = `http://127.0.0.1:${servicePort}/health`;
        this.consul.agent.service.register({
            Name: serviceName,
            ID: serviceName,
            Address: '127.0.0.1',
            port: parseInt(servicePort),
            tags: ["prime-number-finder"],
            DeRegisterCriticalServiceAfter: "1m",
           // connect: { "sidecar_service": {} },
            check: {
                http: helathCheck,
                interval: '10s',
                timeout: '5s'
            }

        }, function(err,result) {
            if(err) {
                console.log('consul registration error:', err);
                throw err;
            }

            console.log( serviceName + ': registered successfully!');
        })
    }

    async updateNodeInfo(data) {
        const nodeInfo = await Axios.get(`http://127.0.0.1:8500/v1/agent/service/${data.ID}`);
        const shouldUpdateData = {...nodeInfo.data, ...data, Meta: {...nodeInfo.data.Meta, ...data.Meta}};
        delete shouldUpdateData['Service'];
        delete shouldUpdateData['ContentHash'];
        delete shouldUpdateData['Datacenter'];
        let url = `http://127.0.0.1:8500/v1/agent/service/register?replace-existing-checks=false`
        return await Axios.put(url, shouldUpdateData);
    }

    getActiveNodes (){
        let activeNodes = [];
        return Axios.get('http://127.0.0.1:8500/v1/agent/services').then(res => {
          
           return activeNodes = res.data;
        
        }).catch(err => {
            return err;
        });
    }

    async getAllNodes (){
        return await Axios.get('http://127.0.0.1:8500/v1/agent/services');
    }

    getMasterNode(serviceName) {
        let url = `http://127.0.0.1:8500/v1/agent/service/${serviceName}`;  
        return Axios.get(url);
    }


}

module.exports = ConsulConfig;

