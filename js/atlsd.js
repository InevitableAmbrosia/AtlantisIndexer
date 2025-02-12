export default{
	mintUpload : async function(axios, Web3, session, userUUID, to, infoHash, amount, cb){    
      var abi = [
      	  {
		    "constant": false,
		    "inputs": [
		    {
		        "name": "to",
		        "type": "address"
		    },
		    {
		        "name": "amount",
		        "type": "uint256"
		    }
		    ],
		    "name": "mint",
		    "outputs": [
		    ],
		    "type": "function"
		  },
          {
              "constant": true,
              "inputs": [],
              "name": "name",
              "outputs": [
                  {
                      "name": "",
                      "type": "string"
                  }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
          },
          {
              "constant": false,
              "inputs": [
                  {
                      "name": "_spender",
                      "type": "address"
                  },
                  {
                      "name": "_value",
                      "type": "uint256"
                  }
              ],
              "name": "approve",
              "outputs": [
                  {
                      "name": "",
                      "type": "bool"
                  }
              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "constant": true,
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                  {
                      "name": "",
                      "type": "uint256"
                  }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
          },
          {
              "constant": false,
              "inputs": [
                  {
                      "name": "_from",
                      "type": "address"
                  },
                  {
                      "name": "_to",
                      "type": "address"
                  },
                  {
                      "name": "_value",
                      "type": "uint256"
                  }
              ],
              "name": "transferFrom",
              "outputs": [
                  {
                      "name": "",
                      "type": "bool"
                  }
              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "constant": true,
              "inputs": [],
              "name": "decimals",
              "outputs": [
                  {
                      "name": "",
                      "type": "uint8"
                  }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
          },
          {
              "constant": true,
              "inputs": [
                  {
                      "name": "_owner",
                      "type": "address"
                  }
              ],
              "name": "balanceOf",
              "outputs": [
                  {
                      "name": "balance",
                      "type": "uint256"
                  }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
          },
          {
              "constant" : false,
              "inputs" : [
                {
                  "name" : "to",
                  "type" : "address" 
                },
                {
                  "name" : "amount",
                  "type" : "uint256"
                },
                {
                  "name" : "infoHash",
                  "type" : "string"
                }
              ]
              ,
              "name" : "transferWithData",
              "outputs" : [

              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "constant" : false,
              "inputs" : [
                {
                  "name" : "to",
                  "type" : "address" 
                },
                {
                  "name" : "amount",
                  "type" : "uint256"
                },
                {
                  "name" : "infoHash",
                  "type" : "string"
                }
              ]
              ,
              "name" : "mintWithData",
              "outputs" : [

              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "constant": true,
              "inputs": [],
              "name": "symbol",
              "outputs": [
                  {
                      "name": "",
                      "type": "string"
                  }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
          },
          {
              "constant": false,
              "inputs": [
                  {
                      "name": "_to",
                      "type": "address"
                  },
                  {
                      "name": "_value",
                      "type": "uint256"
                  }
              ],
              "name": "transfer",
              "outputs": [
                  {
                      "name": "",
                      "type": "bool"
                  }
              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "constant": true,
              "inputs": [
                  {
                      "name": "_owner",
                      "type": "address"
                  },
                  {
                      "name": "_spender",
                      "type": "address"
                  }
              ],
              "name": "allowance",
              "outputs": [
                  {
                      "name": "",
                      "type": "uint256"
                  }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
          },
          {
              "payable": true,
              "stateMutability": "payable",
              "type": "fallback"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "name": "owner",
                      "type": "address"
                  },
                  {
                      "indexed": true,
                      "name": "spender",
                      "type": "address"
                  },
                  {
                      "indexed": false,
                      "name": "value",
                      "type": "uint256"
                  }
              ],
              "name": "Approval",
              "type": "event"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "name": "from",
                      "type": "address"
                  },
                  {
                      "indexed": true,
                      "name": "to",
                      "type": "address"
                  },
                  {
                      "indexed": false,
                      "name": "value",
                      "type": "uint256"
                  }
              ],
              "name": "Transfer",
              "type": "event"
          }
      ]
	    const propagateAddress = "0x68663EB789CB1b20eBa9F693fdf927Dc195DB114" //"0xaafB904FFDb0552393651a4E02A88c9f016F41F5"
	    const contractAddress = "0x29Bf962436a63fd1E7b4d803Da9Bff3F079a5806"//"0xc20ae321aAb36d23fBAeF94e2D37920CF42c2364"
    	
		const web3 = new Web3("https://rpc2.sepolia.org");
		//0xE9fA7600eaa7f22E7e561f7359E3a090dB7FA936
	    const toAddress = to;
		var value = web3.utils.toWei(parseFloat(amount), "ether"); ; 
        var transactionHash;  
        //get estimate Gas
        const suggestion_gas = await web3.eth.getGasPrice();
        var block = await web3.eth.getBlock("latest");
        var nonce = await web3.eth.getTransactionCount(propagateAddress, "pending")
        console.log(nonce);
		var gasLimit = block.gasLimit;
        let myContract = new web3.eth.Contract(abi, contractAddress, {from: propagateAddress});
        console.log(toAddress, amount)
        if(infoHash){
        	var data4 = await myContract.methods.mintWithData(toAddress, value, infoHash).encodeABI();
        }
        else{
        	var data4 = await myContract.methods.mint(toAddress, value).encodeABI();
        }
        /*const estimate_gas = await web3.eth.estimateGas({
            'from': propagateAddress,
            'data' : data4,
            'to': contractAddress
         
        });*/
      	if(!here){
      		console.log("Confirmed upload: " + transactionHash)
          console.log(userUUID)

    			var query = "MATCH (u:User {uuid : $userUUID}) " +
           "SET u.payout = u.payout + $amount, u.ATLANTIS = u.ATLANTIS - $amount " +
          "WITH u " +
          "MERGE (t:Transaction {transactionHash : $transactionHash, amount : $amount, toAddress: $toAddress, time : toFloat(TIMESTAMP())})-[:PAID]->(u) "
          console.log("PARAMS IS PROBLEM")
    			var params = {userUUID : userUUID, amount : parseFloat(amount), transactionHash : transactionHash, toAddress : toAddress};
          console.log("HERE")
          
    			session.run(query,params).then(data=>{
    				session.close();
            console.log("THERE!")
            console.log(data.records);
            cb(transactionHash);
    			})
    			here = true;	
      	}
      	
    
		
	}
  ,
  accumulate : function(driver, user, amount){

    var query = "MATCH (u:User {uuid : $user}) " +
    "SET u.ATLANTIS = u.ATLANTIS + $amount "
    var params = {user : user.uuid, amount : parseFloat(amount)}
    var session = driver.session();
    session.run(query,params).then(data=>{
      session.close();
    })
  }
}