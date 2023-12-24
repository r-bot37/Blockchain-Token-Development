//this is the smart contract which is actually going to help us put our tokens for sale and help initiate initial public offering

pragma solidity ^0.8.0;

import "./rishiv.sol";

contract rishiv_sale{
    //assign an admin and no tests on admin as its address will not be exposed by us
    address admin;

    rishiv public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    event Sell(address buyer,uint256 amount);
    
    
    constructor(rishiv _tokenContract,uint256 _tokenPrice) public{
    	admin=msg.sender;
    	//we are going to rely on the transfer() function for buying and selling of tokens
    	//we are going to add a reference to that contract inside this contract


        tokenContract=_tokenContract;
        tokenPrice=_tokenPrice;
        //keep in mind that the tokenPrice is the number of tokens per ether
}



//this function will help us sell our tokens via a client side application
    function buyTokens(uint256 numberoftokens) payable public{
//require value is equal to tokens
    require(msg.value== (numberoftokens*tokenPrice));


//require that contract has enough tokens

   require(tokenContract.balanceOf(address(this)) >= numberoftokens);//compulsory to use address keyword

//require transfer successful
require(tokenContract.transfer(msg.sender,numberoftokens));


//keep track of tokens sold
    tokensSold+=numberoftokens;

    //sell event trigger
    emit Sell(msg.sender ,numberoftokens);
    //buyer will be the account that is calling the function which is msg.sender in this case
    }


    //ending the rishiv sale
    function endSale() public{
        //only the admin can end the sale
        require(msg.sender==admin) ;

        //transfer the amount of token not sold in the sale back to admin
        tokenContract.transfer(admin,tokenContract.balanceOf(address(this)));

        //destroy this contract
   // selfdestruct(payable(admin));
    }
}
