import Web3 from 'web3';

const getWeb3 = () => {
  return new Promise( (resolve, reject) => {
    window.addEventListener('load', function(){
      
      if (window.ethereum){
        let web = new Web3(ethereum);
        try {
            // Request account access if needed
            window.ethereum.enable();
            // Acccounts now exposed
            resolve(web);
        } catch (error) {
            // User denied account access...
            console.log('El usuario no deja entrar')
        }
      } else if (window.web3) {
        web = new Web3(Web3.givenProvider || "ws://localhost:8545");
        resolve(web);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        reject()
      }

    });
  });
}

export default getWeb3;