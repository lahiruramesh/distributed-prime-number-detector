const { range } = require('express/lib/request');
const {readNumberFromFile} = require('./master');
const axios = require('axios');

const scheduleJobs = async (combined) => {
    let count = 0, proposal_arr = [];

    combined.forEach(node => {
        if(node == 'Proposer') {
            proposal_arr.append(node)
            count++;
            console.log('range_array', proposal_arr);
        }
    });

    const random_number = readNumberFromFile();

    const listen_proposer = len(proposal_arr);

    const number_range = Math.floor(random_number/ listen_proposer);

    let start = 2;

    for (node in range(proposal_arr)) {
       let divide_range = {
           "start": start,
           "end": start + number_range,
           "random_number": random_number
       }

       console.log(divide_range);

       let url = 'http://127.0.0,1:%s/proposer-schedule' % proposal_arr[node]
       
       await axios.post(url, divide_range);

       start += random_number + 1;

    }

}

module.exports = {
    scheduleJobs
}
