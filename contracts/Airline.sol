pragma solidity ^0.4.24;

contract Airline {

    address public owner;
    struct Customer {
        uint loyalPoints;
        uint totalFlights;
    }

    struct Flight {
        string name;
        uint256 price;
    }

    uint etherPerPoint = 0.5 ether;

    Flight[] public flights;
    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlight;
    mapping(address => uint) public customerTotalFlight;

    event FlightPurchased(address indexed customer, uint price, string flight);

    constructor(){
        owner = msg.sender;
        flights.push(Flight('Tokio', 4 ether));
        flights.push(Flight('Germany', 1 ether));
        flights.push(Flight('Nueva York', 3 ether));
        flights.push(Flight('Madrid', 2 ether));
    }

    function buyFlight(uint flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price);

        Customer storage customer = customers[msg.sender];
        customer.loyalPoints += 5;
        customer.totalFlights += 1;
        customerFlight[msg.sender].push(flight);
        customerTotalFlight[msg.sender]++;
        
        emit FlightPurchased(msg.sender, flight.price, flight.name);
    }

    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyalPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyalPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyalPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        address airlineAddress = this;
        return airlineAddress.balance;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

}