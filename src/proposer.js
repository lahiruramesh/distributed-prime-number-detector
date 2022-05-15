const {findPrime} = require('./findPrimeAlgo');

const isPrime = async(req, res) => {

    const {start ,end, random_number} = req.body;
    const isPime = await findPrime(start, end, random_number);

    if(isPime) {
       return res.send('OK');     
    }else {
        return res.send('FAILED');
    }
}

module.exports = {
    isPrime
}



