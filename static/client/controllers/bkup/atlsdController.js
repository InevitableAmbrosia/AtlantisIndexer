
async function initializeWeb3(){
      //initPayButton();
      
}

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  console.log("ACCOUNT : " + account)
  return account;
}


async function initPayButton(btn){
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
    const account = await getAccount();
    //const contract = await new web3.eth.Contract(json, "0x8f370C3a42054A0C1A216270a85f67B678E2711a")
    console.log("CLICKED")
    // paymentAddress is where funds will be send to
    const contractAddress = "0x29Bf962436a63fd1E7b4d803Da9Bff3F079a5806" //"0xE9fA7600eaa7f22E7e561f7359E3a090dB7FA936"
    //0xc20ae321aAb36d23fBAeF94e2D37920CF42c2364
    const propagateAddress = "0x68663EB789CB1b20eBa9F693fdf927Dc195DB114" //"0xaafB904FFDb0552393651a4E02A88c9f016F41F5"
    const curatorAddress = btn.data("curator-address");
    const torrentUUID = btn.data("torrent-uuid");

    var balanceAddress = "0x29Bf962436a63fd1E7b4d803Da9Bff3F079a5806"

    var transactionHash;
    console.log(torrentUUID);
    var yarrr = parseFloat(btn.data("yarrr"));
    $("#" + torrentUUID).val("");
    console.log(yarrr);
    const amount = parseFloat(0); 
   
   const minABI = [
  // balanceOf
  {
    constant: true,

    inputs: [{ name: '_owner', type: 'address' }],

    name: 'balanceOf',

    outputs: [{ name: 'balance', type: 'uint256'}],

    type: 'function',
  },
]


    var prem = false;
      
    var value;

    if(btn.hasClass("web3")){
      
      btn.prop("disabled", true)
      $.get("/buyPrice/" + torrentUUID, async function(data){
        if(data.confirmed && data.USD_price > 0){
          alert("You have already purchased this infoHash.")
          return;
        }
        if(!user && data.USD_price > 0){
        alert("You must be logged in to purchase an infoHash!");
        return;
      }
          const suggestion_gas = await web3.eth.getGasPrice();
          console.log(account);
          console.log(curatorAddress);
          let myContract = new web3.eth.Contract(abi, contractAddress, {from:account});
          var transCount = web3.eth.getTransactionCount(account);
          if(data.USD_price > 0){
            prem = true;
            //var amount = web3.utils.toWei(parseFloat(data.USD_price * .80), "ether");
            //var royalty = web3.utils.toWei(parseFloat(data.USD_price * .20), "ether");
            var value = data.USD_price;
            //web3.utils.toWei(parseFloat(data.USD_price), "ether");
          }
          else{
            prem = false
            console.log(torrentUUID)
            console.log(yarrr)
            //var amount = web3.utils.toWei(parseFloat(yarrr * .80), "ether");
            //var royalty = web3.utils.toWei(parseFloat(yarrr * .20), "ether");
            var value = yarrr;
          }


          console.log(propagateAddress, curatorAddress);
          //let data4 = myContract.methods.royalty(curatorAddress, propagateAddress, amount, royalty).encodeABI();
          const estimate_gas = await web3.eth.estimateGas({
              'from': account,
              'to': curatorAddress
           
          });
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

            var convertedETH = convertCurrency(value, "USD", "ETH").toFixed(7);   
            console.log(convertedETH);
            web3.eth.sendTransaction({
                from: account,
                to: curatorAddress, 
                value: web3.utils.toWei(parseFloat(convertedETH), "ether"), 
            }).on('transactionHash', function(txHash){
              transactionHash = txHash;
            }).on('confirmation', function(confirmationNumber, receipt){
              console.log("CALL PROC RECEIPT")
              procReceipt(transactionHash, confirmationNumber)
            }).on("error", function(error){
              btn.prop('disabled', false)
              alert("ERROR: " + error)
            });
          })
        })
      var confirmed = false;
      function procReceipt(transactionHash, confirmationNumber){
          //$(".web3Loader").fadeIn(1337);
          console.log("PROC RECEIPT")
          console.log(confirmationNumber);
          var uuid = crypto.randomUUID();
          
          if(prem){
            console.log("HERE");
            alert("Transaction completed. Save your Transaction hash: " + transactionHash + "! You will get an alert confirming your purchase in the database after approx. 30 seconds of mining!!!")
             $.post("/web3/" + transactionHash + "?uuid=" + uuid + "&torrentUUID=" + torrentUUID, function(){
                console.log("HEREEE")
             })
           }
           else{
            alert("Donated " + $("#" + torrentUUID).val() + " ETH to " + $("#uptight").text() + " at " + curatorAddress + "! Transaction Hash: " + transactionHash);
           }
         
        

          var transactionInterval = setInterval(function(){
       
          
            $.post("/pollBatch/" + uuid + "?torrentUUID=" + torrentUUID, async function(data){
              if(data.bought){
                if(prem){
                  alert("Successfully paid " + value + " ATLANTIS for infoHash: " + data.infoHash);
                  $("#infoHash_" + torrentUUID).trigger("click");

                }
                clearInterval(transactionInterval);
                //$(".web3").prop("disabled", false)
              }
              
            })
         }, 6667)   
         console.log(data)

         
         
         
      }
  
        
      
    }
    else{
    $.get("/infoHash/" + torrentUUID, async function(data){
      if(!data.free && !data.prem){
        alert("Please be sure that you have purchased this torrent!")
        return;
      }
      else if(data.free){
        var infoHash = data.free;
      }
      else if(data.prem){
        var infoHash = data.prem;
      }
      //save to blockchain
      var transactionHash;  
      //get estimate Gas
      const suggestion_gas = await web3.eth.getGasPrice();
      let myContract = new web3.eth.Contract(abi, contractAddress, {from:account});
      value = web3.utils.toWei(parseFloat(3), "ether");
      let data4 = myContract.methods.transferWithData(propagateAddress, value, infoHash).encodeABI();
      const estimate_gas = await web3.eth.estimateGas({
          'from': account,
          'data' : data4,
          'to': contractAddress
       
      });
      let raw = {
          'gasPrice': web3.utils.toHex(suggestion_gas),
          'gasLimit': web3.utils.toHex(estimate_gas),
          "from" : account,
         // "nonce" : web3.utils.toHex(transCount),
          "to": contractAddress,
          "data" : data4,
          "value" : "0x0"
      }
      web3.eth.sendTransaction(raw).on('transactionHash', function(txHash){
        transactionHash = txHash;
        }).on('confirmation', function(confirmationNumber, receipt){
          procReceipt(transactionHash, confirmationNumber)
      });    
    })
  }
  }//end init pay button
      
      
      
  
    


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
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ]
    