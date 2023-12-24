//the smart contracts are immutable ,hence we should always test our smart contract before deploying it to the blockchain
//we start by importing our contract file just like we did in our migrations
var rishiv=artifacts.require("./rishiv.sol");

contract('rishiv',function(accounts){
	//whenever this callback function is called it passes all the accounts available in ganache for testing purpose
	var tokenInstance;

it('allocates the contract with the correct values',function() {
	return rishiv.deployed().then(function(instance) {
		tokenInstance=instance;
		return tokenInstance.name()
	}).then(function(name) {
		assert.equal(name,'rishiv','yes!! it has the correct name');
		return tokenInstance.symbol();
	}).then(function(symbol){
			assert.equal(symbol,'RIV','yes!! it has the correct symbol');
		});
	});




it('allocates the initial supply upon deployment',function() {
	return rishiv.deployed().then(function(instance) {
		tokeninstance=instance;
		return tokeninstance.totalSupply()
	}).then(function(totalSupply) {
		assert.equal(totalSupply.toNumber(),1000000,'total supply is not 1000000');
		return tokeninstance.balanceOf(accounts[0]);
		//running a test to check whether initial supply goes to admin account or not
	}).then(function(adminBalance) {
		assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin account');
	});

	});



it('transfers ownership of a certain amount of tokens',function(){
	return rishiv.deployed().then(function(instance){
		tic=instance;
		return tic.transfer.call(accounts[1],999999999999);
	}).then(assert.fail).catch(function(error){
		assert(error.message.indexOf('revert')>=0,'error message must contain revert');
		return tic.transfer.call(accounts[1],250000,{from:accounts[0]});
	}).then(function(success){
		assert.equal(success,true,'it returns true');
		return tic.transfer(accounts[1],250000,{from:accounts[0]});
	}).then(function(receipt){
		//test for events by looking at transaction receipt
		//event information is going to be in the logs
		assert.equal(receipt.logs.length,1,'trigers one event');
		assert.equal(receipt.logs[0].event,'Transfer','should be the Transfer event');
		assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account the tokens are transfered from');
		assert.equal(receipt.logs[0].args._to,accounts[1],'logs the account the tokens are transfered to');
		assert.equal(receipt.logs[0].args._value,250000,'logs the tranfer amount');
		return tic.balanceOf(accounts[1]);

	}).then(function(balance){
		assert.equal(balance.toNumber(),250000,'adds the amount to receiving account');
		return tic.balanceOf(accounts[0]);
	}).then(function(balance){
		assert.equal(balance.toNumber(),750000,'deducts the amount from sending account');
	});

});

/* The assert.fail() function throws an AssertionError with the provided the error message or with a default error message.
Syntax:
assert.fail([message])
If the condition is True, the control simply moves to the next line of code. In case if it is False the program stops running and returns AssertionError Exception.*/


//The catch() method of a Promise object schedules a function to be called when the promise is rejected.




//test for approve function in delegated transfer

it('approves tokens for delegated transfer',function(){
	return rishiv.deployed().then(function(instance){
		tokenInstance=instance;
		return tokenInstance.approve.call(accounts[1],100);
	}).then(function(success){
		assert.equal(success,true,'the spender account has been approved');
		return tokenInstance.approve(accounts[1],100);            //test for Approval event in delegated transfer
	}).then(function(receipt){
		assert.equal(receipt.logs.length,1,'approve event has been triggered');
		assert.equal(receipt.logs[0].event,'Approval','the name of the event triggered is Approve');
		assert.equal(receipt.logs[0].args.value,100,'the amount of tokens approved is 100');
		assert.equal(receipt.logs[0].args.spender,accounts[1],'the spender account');//the arguments names should match the arguments while defining the event
		assert.equal(receipt.logs[0].args.owner,accounts[0],'the owner account');
		return tokenInstance.allowance(accounts[0],accounts[1])                      //test for allowance public variable
	}).then(function(allowance){
		assert.equal(allowance.toNumber(),100,'stores the allowance for delegated transfer');
	})
	})


it('handles delegated transfers',function(){
	return rishiv.deployed().then(function(instance){
		tokenInstance=instance;
		//assign some accounts
		fromaccount=accounts[2];
		spenderaccount=accounts[3];
		toaccount=accounts[4];
		//account 3 will spend tokens on account 4 which have been approved by account 2.delegated transfer between 2 and 4
		//now first we transfer a few tokens from account 0 to acount 2 because total supply is in account 0 and some in account 1 so far
		return tokenInstance.transfer(fromaccount,100,{from:accounts[0]});
	}).then(function(receipt){
		//approve spender account to spend 10 tokens from from account
		return tokenInstance.approve(spenderaccount,10,{from:fromaccount});
	}).then(function(receipt){
		//check requirements of the function
		//1---fromaccount has enough balance
		
		async function transfer_check(){
		try{
			 await tokenInstance.transferFrom.call(fromaccount,toaccount,9999);
		} catch(e){
			assert(e.message.indexOf('revert')>=0,'cannot tansfer value greater than balance');
			}
		}
	async function transfer_check2(){
		try{
			await tokenInstance.transferFrom.call(fromaccount,toaccount,20,{from :spenderaccount});
		} catch(e){
			assert(e.message.indexOf('revert')>=0,'cannot tansfer value greater than approved amount');
			}
		}
		return tokenInstance.transferFrom.call(fromaccount,toaccount,10,{from :spenderaccount});
	}
	//now implement the require function in rishiv.sol to make the test pass
	//now try transfering greater amount than approved amount
	
).then(function(success){
	assert.equal(success,true,'returns true');
	return tokenInstance.transferFrom(fromaccount,toaccount,10,{from:spenderaccount});
}).then(function(receipt){                                                                        //test for event
	assert.equal(receipt.logs.length,1,'triggers one event');
		assert.equal(receipt.logs[0].event,'Transfer','should be the Transfer event');             //name of arguments same as that of event.This is a receipt that shows event values and not other function values.
		assert.equal(receipt.logs[0].args._value,10,'logs the tranfer amount');
		assert.equal(receipt.logs[0].args._to,toaccount,'logs the account the tokens are transfered to');
		assert.equal(receipt.logs[0].args._from,fromaccount,'logs the account the tokens are transfered from');
		return tokenInstance.balanceOf(fromaccount);                                               //test for balance updation
}).then(function(balance){
	assert.equal(balance.toNumber(),90,'deducts amount from the sending account');
	return tokenInstance.balanceOf(toaccount);
}).then(function(balance){
	assert.equal(balance.toNumber(),10,'adds amount to the receiving account');
	return tokenInstance.allowance(fromaccount,spenderaccount);                                     //test for allowance updation
}).then(function(allowance){
	assert.equal(allowance,0,'deducts the amount from the allowance');
})

});
})

