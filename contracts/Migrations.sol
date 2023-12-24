 pragma solidity ^0.8.0;
// used in Ethereum development for managing and recording the deployment history of other contracts.
contract Migrations{
	address public owner;
	uint public last_completed_migration;
	//modifier
	modifier restricted(){
		if(msg.sender==owner)_;
	}
	//constructor
	constructor() public{
		owner=msg.sender;
	}
	//function to tell us that present smart contract has been completed and will set the variable to just completed contract's number
	function setCompleted(uint completed) public restricted {
		last_completed_migration=completed;
	}
	//function upgrade will use the setCompleted function and regard the previous contract as completed
	 function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  } 
	
}