//it will be responsible for the behaviour of our cryptocurrency.
//1---define total supply of tokens
//2---keep track of all the account balances that own some tokens
//3---add name,symbol or standard(optional)
//4---add a transfer function which will transfer a certain amount from a specific account
//5---to add a delegated transfer where the transfer is not directly done from sender to receiver

pragma solidity ^0.8.0;

contract rishiv{
	//I will now add a name and symbol
string public name="rishiv";
string public symbol="RIV";
uint256 public totalSupply;

//instead of making a conventional function for allowance for delegated transfer,
//i am going to make a public variable which by default will get a getter function

mapping(address=>mapping(address=>uint256)) public allowance;

//here the first address is me. i am the key to another mapping which can store address of spender and the token allowed
//so if wanted, i can keep allowance track of account A,B,C,D and so on also

event Transfer(address indexed _from,address indexed _to,uint256 _value);
event Approval(address indexed owner,address indexed spender,uint256 value);

mapping(address=>uint256) public balanceOf;


constructor(uint256 _initialSupply) public{
	totalSupply=_initialSupply;
	//allocate the initial supply to some address
	balanceOf[msg.sender]=_initialSupply;
	}

function transfer(address _to,uint256 _value) public returns(bool){
//the transfer function should-:
/*
  1)throw if account doesn't have enough balance
  2)must fire the transfer event
  3)transfers of zero must be treated as normal and must fire transfer event
  */
require(balanceOf[msg.sender]>=_value);
balanceOf[msg.sender]-=_value;
balanceOf[_to]+=_value;
emit Transfer(msg.sender,_to,_value);

return true;
}


//approve function
//allowance function
//Approve event

function approve(address spender,uint256 value) public returns(bool){
	//spender is the account that is needed to be approved
allowance[msg.sender][spender]=value;
emit Approval(msg.sender,spender,value);
return true;
}


//transferFrom function
function transferFrom(address from,address to,uint256 value) public returns(bool){


require (balanceOf[from]>=value);
require (allowance[from][msg.sender]>=value);


//change the balance
balanceOf[from]-=value;
balanceOf[to]+=value;

//update the allowance
allowance[from][msg.sender]-=value;

//Transfer event
emit Transfer(from,to,value);
//return bool
return true;

}
}
