var rishiv = artifacts.require("./rishiv.sol");
var rishiv_sale = artifacts.require("./rishiv_sale.sol");

//comment2
//we need the address of the first deployed contract for the second deployed contract so we will use a promise chain

module.exports=function(deployer){
	deployer.deploy(rishiv,1000000).then(function(){
		//token price is 0.001 ether
		var tokenPrice=1000000000000000  ;// wei
         return deployer.deploy(rishiv_sale,rishiv.address,tokenPrice);
	});
	//comment 1       first argument can be the contract abstraction but the second argument
	// and so forth will be passed on to the constructor of our smart contract
	
};