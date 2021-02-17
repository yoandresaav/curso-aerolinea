import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from './getWeb3';
import AirlineContract from './airline';
import { AirlineService } from './airlineService';
import { ToastContainer } from 'react-toastr';

const converter = (web3) => {
  return (value) => {
    return web3.utils.fromWei(value.toString(), 'ether');
  }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
          balance: 0,
          account: undefined,
          flights: [],
          customerFlights: [],
        }
    }

    async componentDidMount() {
      this.web3 = await getWeb3();
      this.toEther = converter(this.web3);
      this.airline = await AirlineContract(this.web3.currentProvider);
      this.airlineService = new AirlineService(this.airline);

      let account = (await this.web3.eth.getAccounts())[0];
      let flightPurchased = this.airline.FlightPurchased();

      // Suscripcion a eventos
      flightPurchased.watch(function(err, result){
        const {customer, price, flight} = result.args;
        if (customer === this.state.account){
          console.log(`You are purshase el flight ${flight} al cost ${price}`);
        }
        this.load();
        this.container.success('Se ha comprado otro vuelo', 'Flight information');
      }.bind(this));

      // Cambiar de cuenta
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(event){
          this.setState({
              account: event[0].toLowerCase(),
          }, ()=>{
            this.load();
          });
        }.bind(this));

      }

      // this.web3.currentProvider.publicConfigStore.on('update', async function (event) {
      //   this.setState({
      //     account: event.selectedAddress.toLowerCase(),
      //   });
      // })

      console.log(account)
      this.setState({
        account: account.toLowerCase()
      }, ()=>{
        this.load();
      })
    }

    async getBalance() {
      let weiBalance = await this.web3.eth.getBalance(this.state.account);
      this.setState({
        balance: this.toEther(weiBalance),
      })
    }

    async load() {
      this.getBalance();
      this.getFlights();
      this.getCustomerFlight();
    }

    async getFlights () {
      let flights = await this.airlineService.getFlights();
      this.setState({
        flights
      });
    }

    async buyFlight (flightIndex, flight) {
      console.log(flightIndex, flight.name);
      await this.airlineService.buyFlight(flightIndex, this.state.account, flight.price);
    }

    async getCustomerFlight () {
      let customerFlights = await this.airlineService.getCustomerFlights(this.state.account);
      this.setState({
        customerFlights
      })
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                      <p>{ this.state.balance }</p>
                      <span>{ this.state.account }</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">

                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                      {this.state.flights.map( (flight, index) => {
                          return (<div key={index}>
                            <span>{flight.name} - cost: { this.toEther(flight.price)}</span>
                            <button className="btn btn-sm btn-success" onClick={()=> this.buyFlight(index, flight) }>Purchase</button>
                          </div>)
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                        {this.state.customerFlights.map((flight, index) => {
                          return (<div key={index}>
                            {flight.name} - cost: {this.toEther(flight.price)}
                          </div>)
                        })}
                    </Panel>
                </div>
            </div>
            <ToastContainer 
              ref={(input)=>{
                this.container = input
              }}
              className="toast-top-right"
            />
        </React.Fragment>
    }
}