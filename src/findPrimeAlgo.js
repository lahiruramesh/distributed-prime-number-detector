const findPrime  = (start, end, number) => {

    if(start === 0) return "not allowed to divide by zero";

    let isPrime = true;

    for (let i = start; i < end; i++) {
        console.log('breakdown', i,number%i);
        if(number%i == 0 && i != number) {
            console.log('breakdown', i,number%i);
            isPrime = false;   
            break;
        }
       
    }  
    return isPrime;

}

module.exports = {
    findPrime
}


