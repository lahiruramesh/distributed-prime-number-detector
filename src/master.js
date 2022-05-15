const express = require('express');
const {assignedRoles} = require('./authorization');
const {scheduleJobs} = require('./scheduler');
const {learn, countMessage} = require('./learner');
const {acceptMessage, getAcceptedMessages} = require('./acceptor');
const {isPrime} = require('./propopser');


const findPrimeApp = express();

const startPrimeFinder =  async () => {
    await assignedRoles();
    await scheduleJobs();
    return await learn();
}


findPrime.get('/findPrime', async (req, res) => {
    const learn  = await startPrimeFinder();
    res.send(learn);
});

findPrimeApp.get('/accept', async (req, res) => {
    const accept = await acceptMessage(req ,res);
    console.log('accept', accept);
    res.send(accept);
});

findPrimeApp.get('/submit-accepted-message', async(req, res) => {

})

findPrime.get('/proposer-schedule', async (req, res) => {
    const isPrime = await isPime(req, res);
    res.send(isPrime);
});

findPrime.get('/countMessage', async (req, res) => {
    const countMessage = await countMessage(req, res);
    res.send(countMessage);
});


module.exports = {
    findPrimeApp
}