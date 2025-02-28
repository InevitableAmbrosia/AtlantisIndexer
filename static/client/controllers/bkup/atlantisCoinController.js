const getAcct = async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  console.log("ACCOUNT : " + account)
  return account;
}

async function initializeAtlantisCoin(){
  $("#atlsd_submit").unbind("click")
  $("#atlsd_submit").click(async function(){
    $(this).prop("disabled", true)
    if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
              await web3.eth.requestAccounts();
              console.log("WEB3 CONNECTED!")
            
              

            } catch (err) {
              console.log("ACCESS Web3 DENIED")
              alert("Connect a Metamask wallet to use dAPp features!!!!")
              $(".web3").prop("disabled", false)
              return;
             // $('#status').html('User denied account access', err)
            }
         /* } else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider)
            initPayButton()
          */} else {
            alert("Connect a Metamask wallet to use dAPp features!!!!")
              $(".web3").prop("disabled", false)
            
            return;
            console.log("NO METAMASK INSTALLED!!!")
            //$('#status').html('No Metamask (or other Web3 Provider) installed')
          }
        const account = await getAcct();
      var amount = parseFloat($("#atlsd_amount").val());
     /* if(amount < 50){
        alert("You must invest over $50.00 USD to receive AtlantisCoin!")
        $("#atlsd_submit").prop("disabled", false)
        return;
      }*/
      var toAddress = $("#atlsd_address").val();
      if(!toAddress){
        alert("You must enter an $ATLANTIS-compatible ETH address, using a wallet such as Metamask.")
        $("#atlsd_submit").prop("disabled", false)

      }
        //const fromCurrency = "USD"; 
        //const toCurrency = "LINK"; 
        //const convertedAmount = convertCurrency(amount, "USD", "LINK");
        const suggestion_gas = await web3.eth.getGasPrice();
        //console.log(convertedAmount);
      $.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", async function(data){  

        function convertCurrency(amount, fromCurrency, toCurrency) { 
          const exchangeRate = getExchangeRate(fromCurrency, toCurrency); 
          const convertedAmount = exchangeRate * amount; 
          return convertedAmount; 
        } 
         
        function getExchangeRate(fromCurrency, toCurrency) { 
          // In this example, the exchange rate is hardcoded, but in a real-world scenario, you would get this information from an API. 
          const exchangeRates = { 
            ETH: 1,
            USD : data.USD
          }; 
          return exchangeRates[toCurrency] / exchangeRates[fromCurrency]; 
        }
        const propagateAddress = "0x68663EB789CB1b20eBa9F693fdf927Dc195DB114" 
        var convertedETH = convertCurrency(amount, "USD", "ETH").toFixed(7);   
        console.log(convertedETH);
         const estimate_gas = await web3.eth.estimateGas({
                  'from': account,
                  'to': propagateAddress,
                  value: web3.utils.toWei(parseFloat(convertedETH), "ether")
              });
        web3.eth.sendTransaction({
            from: account,
            'gasPrice': web3.utils.toHex(suggestion_gas),
            'gasLimit': 30000, 
            to: propagateAddress, 
            value: web3.utils.toWei(parseFloat(convertedETH), "ether"), 
        }).on('transactionHash', function(txHash){
          transactionHash = txHash;
        }).on('confirmation', function(confirmationNumber, receipt){
           $.post("/swap", {hash : transactionHash, address : toAddress, amount : amount}, function(data){
            alert("We have received your payment. Please wait 2 minutes for your coins to be minted.")
            var mint_interval = setInterval(function(){
              $.post("/check_mint", {hash : transactionHash}, function(data){
                if(data.confirmed){
                  clearInterval(mint_interval)
                  alert("You have received " + data.atlsd * 25000 + " $ATLANTIS, have a great day!!!")
                  $("#atlsd_submit").prop("disabled", false)
                }
              })
            },10000)
           })
        }).on("error", function(error){
          alert("ERROR: " + error)
          $("#atlsd_submit").prop("disabled", false)
        });
      })
  })
	
		
		
}

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
                  "name" : "propagate",
                  "type" : "address"
                },
                {
                  "name" : "amount",
                  "type" : "uint256"
                },
                {
                  "name" : "royaltyAmount",
                  "type" : "uint256"
                }
              ]
              ,
              "name" : "royalty",
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