
export class AirlineService {
  constructor(contract) {
    this.contract = contract;
  }

  async getFlights() {
    let total = await this.getTotalFlights();
    let flights = [];
    for (let i = 0; i < total; i++){
      let flight = await this.contract.flights(i);
      flights.push(flight);
    }
    return this.mapFlights(flights);
  }

  async getTotalFlights() {
    return (await this.contract.totalFlights()).toNumber(); 
  }

  mapFlights(flights) {
    return flights.map( flight => {
      return {
        name: flight[0],
        price: flight[1].toNumber(),
      }
    });
  }

  async buyFlight(flightIndex, from, value){
    return this.contract.buyFlight(flightIndex, {from, value});
  }

  async getCustomerFlights(account) {
    let customerTotalFlights = await this.contract.customerTotalFlight(account);
    let flights = [];
    for (let i = 0; i < customerTotalFlights.toNumber(); i++) {
      let flight = await this.contract.customerFlight(account, i);
      flights.push(flight);
    }
    return this.mapFlights(flights);
  }

}