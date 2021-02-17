module.exports = {
  compilers: {
    solc: {
      version: '0.4.24'
    }
  },
  networks: {
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    }
  }
}