const Consul = require('consul');

class ConsulConfig {
    constructor(serviceName, port) {
        console.log('serviceName', serviceName);
        console.log('port', port);
    
        this.consul = new Consul({
            host: '127.0.0.1',
            port: 8500,
            promisify: true
        });

        this.consul.agent.service.register({
            name: serviceName,
            Address: '127.0.0.1',
            port,
            check: {
                http: `http://127.0.0.1:${port}/health`,
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
}

module.exports = ConsulConfig;
