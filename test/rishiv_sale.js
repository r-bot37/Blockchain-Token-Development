//to get return value, use .call while testing

var rishiv=artifacts.require("./rishiv.sol");
var rishiv_sale=artifacts.require("./rishiv_sale.sol");


contract('rishiv_sale',function(accounts){  //this account argument will give us all the accounts available by the name 'accounts'
var tokenSaleInstance;
var tokenInstance;
var tokenPrice=1000000000000000;//in wei(wei is the smallest subdivision of ether,it is the smallest unit of ethereum cryptocurrency so we dont hav to use float numbers)
var buyer=accounts[1];
var admin=accounts[0];
var tokensAvailable=750000; //this is the amount of tokens available for selling
var numberoftokens;
it('initialises the contract with correct values',function(){
	return rishiv_sale.deployed().then(function(instance){

		tokenSaleInstance=instance;
		return tokenSaleInstance.address
	}).then(function(address){
		assert.notEqual(address,0x0,'is not a null address');
        return tokenSaleInstance.tokenContract();
	}).then(function(address){
		assert.notEqual(address,0x0,'successfully retreived the contract address');
		return tokenSaleInstance.tokenPrice();
	}).then(function(price){
		assert.equal(price,tokenPrice,'token price is correct');
	})
})



it('facilitates the buying of tokens', function(){
	//add the token contract first and then tokensale contract
	return rishiv.deployed().then(function(instance){
		tokenInstance=instance;
	return rishiv_sale.deployed().then(function(instance){

		tokenSaleInstance=instance;
	//we want provision of 75% of total supply to be transferred to the smart contract
		//tokenSaleInstance.address is the address of the smart contract
		return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable,{from:admin});
	}).then(function(receipt){
		numberoftokens=10;
		return tokenSaleInstance.buyTokens(numberoftokens,{from: buyer,value:numberoftokens*tokenPrice});
		//we specify who is trying to buy the tokens and we made the function payable which means that it accepts some ether 
		//we pay to a function using the {value: amount} which is in wei
	}).then(function(receipt){
		assert.equal(receipt.logs.length,1,'sell event has been triggered');
		assert.equal(receipt.logs[0].event,'Sell','the name of the event triggered is Sell');
		assert.equal(receipt.logs[0].args.amount,numberoftokens,'the amount of tokens sold ');
		assert.equal(receipt.logs[0].args.buyer,accounts[1],'the buyer account');
		return tokenSaleInstance.tokensSold();
	}).then(function(amount){
		assert.equal(amount.toNumber(),numberoftokens,'increments the number of tokens sold');
        return tokenSaleInstance.buyTokens(numberoftokens,{from: buyer,value:10});
}).then(assert.fail).catch(function(error){
	assert(error.message.toString().indexOf('revert')>=0,'msg.value must be equal to number of tokens in wei');
	return tokenSaleInstance.buyTokens(800000,{from: buyer,value:(800000*tokenPrice)});
}).then(assert.fail).catch(function(error){
	assert(error.message.toString().indexOf('revert')>=0,'cannot purchase more token than available');
	return tokenInstance.balanceOf(tokenSaleInstance.address);
}).then(function(balance){
	assert.equal(balance.toNumber(),tokensAvailable-10);
	return tokenInstance.balanceOf(buyer);
}).then(function(balance){
	assert.equal(balance.toNumber(),10);
})
})
})



it('ends token sale',function(){
	rishiv.deployed().then(function(instance){
		tokenInstance=instance;
		return rishiv_sale.deployed();
	}).then(function(instance){
		tokenSaleInstance=instance;
		//try ending the sale by someone who is not the admin
		return tokenSaleInstance.endSale({from:buyer});
	}).then(assert.fail).catch(function(error){
		assert(error.message.toString().indexOf('revert')>=0,'only admin can end sale');
		return tokenSaleInstance.endSale({from:admin});
	}).then(function(receipt){
		//assert.equal(tokenInstance.balanceOf(admin).toNumber(),999990,'returns all the unsold tokens to the admin');
		//check that tokenPrice was reset when self destruct was called
		/*return tokenSaleInstance.tokenPrice();
	}).then(function(price){
		assert.equal(price.toNumber(),0,'token price is reset');*/
	})
})
})

 