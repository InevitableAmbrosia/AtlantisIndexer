
async function initializeWeb3(){
      //initPayButton();
      
}

async function getAccount() {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  console.log("ACCOUNT : " + account)
  return account;
}


async function initPayButton(btn){
    $(".web3").prop("disabled", true)
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

    const propagateAddress = "0xaafB904FFDb0552393651a4E02A88c9f016F41F5" //"0xaafB904FFDb0552393651a4E02A88c9f016F41F5"
    const curatorAddress = btn.data("curator-address");
    const torrentUUID = btn.data("torrent-uuid");
    console.log(torrentUUID);
    var yarrr = btn.data("yarrr")
    $("#" + torrentUUID).val("");
    console.log(yarrr);
    
    $.get("/buyPrice/" + torrentUUID, async function(data){
      if(data.confirmed && data.USD_price > 0){
        $(".web3").prop("disabled", false)
        alert("You have already purchased this infoHash.")
        return;
      }
      //no donation just add link to chain with GAS ether

    console.log(curatorAddress);
      console.log(data);
      var amountLINK = (parseFloat(data.USD_price)).toString();


        $.get("/infoHash/" + torrentUUID, async function(data){
          const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c")
          priceFeed.methods
            .latestRoundData()
            .call()
            .then(async function(roundData) {
              // Do something with roundData
              var price = Number(roundData.answer) / 1e8;
              console.log(price)
              price = price.toFixed(2);
              console.log("Latest Round Data", price)
              function convertCurrency(amount, fromCurrency, toCurrency) { 
                const exchangeRate = getExchangeRate(fromCurrency, toCurrency); 
                const convertedAmount = exchangeRate * amount; 
                return convertedAmount; 
              } 

              function getExchangeRate(fromCurrency, toCurrency) { 
                // In this example, the exchange rate is hardcoded, but in a real-world scenario, you would get this information from an API. 
                const exchangeRates = { 
                  LINK: 1,
                  USD : price
                }; 
                return exchangeRates[toCurrency] / exchangeRates[fromCurrency]; 
              } 
              const fromCurrency = "USD"; 
              const toCurrency = "LINK"; 
              var contractAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
              let myContract = new web3.eth.Contract(abi3, contractAddress, {from:account});
              const convertedAmount = convertCurrency(amountLINK, "USD", "LINK");
              const suggestion_gas = await web3.eth.getGasPrice();
              let value = web3.utils.toWei(parseFloat(convertedAmount.toFixed(7)), "ether");
              //const convertedAmount = convertCurrency(amount, "USD", "LINK");
              //console.log(convertedAmount);
              console.log(value)
              var data = myContract.methods.transfer(curatorAddress, value).encodeABI()

              const estimate_gas = await web3.eth.estimateGas({
                  'from': account,
                  'to': contractAddress,
                  "data" : data
               
              });

              let rawTx = {
                  'gasPrice': web3.utils.toHex(suggestion_gas),
                  'gasLimit': web3.utils.toHex(estimate_gas),
                  "from" : account,
                 // "nonce" : web3.utils.toHex(transCount),
                  "to": contractAddress,
                  "value" : "0x0",
                  "data" : data
              }
              //var batch = new web3.BatchRequest();
              web3.eth.sendTransaction(rawTx).on('transactionHash', function (txHash) {

                }).once("transactionHash", function(hash){
                  transactionHash = hash;
                }).on("sent", function(){
                  sentTransaction();
                }).on('receipt', async function (receipt) {
                    var uuid = crypto.randomUUID();

                  $.post("/receipt_confirmed/" + uuid, {transactionHash: transactionHash, torrentUUID: torrentUUID }, function(data){
                    alert("Transaction completed. Your infoHash is now available, congratulations! Now save your Transaction hash: " + transactionHash)

                  })
                    /*const suggestion_gas = await web3.eth.getGasPrice();
                    console.log(convertedAmount);
                    let value = web3.utils.toWei(parseFloat(convertedAmount.toFixed(4)), "ether");
                    const estimate_gas = await web3.eth.estimateGas({
                        'from': account,
                        'to': curatorAddress
                     
                    });
                    let rawTx = {
                        'gasPrice': web3.utils.toHex(suggestion_gas),
                        'gasLimit': web3.utils.toHex(estimate_gas),
                        "from" : account,
                       // "nonce" : web3.utils.toHex(transCount),
                        "to": curatorAddress,
                        "value" : value,
                    }
                    web3.eth.sendTransaction(rawTx).once('transactionHash', function (hash) {
                      transactionHash1 = hash;
                    }).on("sent", function(){
                      sentTransaction();
                    }).on('receipt', function(receipt){
                      console.log("receipt:" + receipt);
                      procReceipt(transactionHash1);
                    }).on('error', function (error) {
                      $(".web3").prop("disabled", false)
                      transErr(err);
                    })              */      
                }).on('error', function (error) {
                  $(".web3").prop("disabled", false)
                  transErr(error);
                });


                var transactionHash0;
                var transactionHash1;

                var waitInterval;
                var transactionInterval;
                var uuid = crypto.randomUUID();
                var sent = false;
                var recCtn = false;

                function transErr(err){
                   alert(err.message)
                  console.log(err)
                  $(".web3").prop("disabled", false)
                  $(".web3Status").hide();
                  $(".web3Loader").fadeOut(777)
                    dismissPP2();
                    clearInterval(transactionInterval);
                    clearInterval(waitInterval);
                 } 
            
                function sentTransaction(){
                    if(!sent){
                       initializePP2();
                      $(".web3Status").show();
                      $(".web3Loader").show();
                      $(".web3Loader").text("Processing payment!!!!")
                      startLoading();
                      sent = true;
                    }      
                    
                     
                }

              function procReceipt(transactionHash, confirmationNumber){
                    //$(".web3Loader").fadeIn(1337);
                    clearInterval(waitInterval);
                    console.log(confirmationNumber);
                    var uuid = crypto.randomUUID();
                    

                    transactionInterval = setInterval(function(){
                 
                    
                      $.post("/pollBatch/" + uuid + "?torrentUUID=" + torrentUUID, async function(data){
                        if(data.bought){
                          dismissPP2();
                          $(".web3Status").hide();
                          $(".web3Loader").hide();
                          sent = false;
                          if(data.prem){
                            ANCHOR.route("#torrent?infoHash=" + data.infoHash);
                          }
                          clearInterval(pollInterval);
                          clearInterval(waitInterval);
                          clearInterval(transactionInterval);
                          $(".web3").prop("disabled", false)
                        }
                      })
                   }, 30000)   
                   if(data.prem){
                    alert("Transaction completed. Save your Transaction hash: " + transactionHash + "! You will be transferred to the torrent after 30 seconds of mining!!!")
                   }
                  
                   
                    
                   
                   $.post("/web3/" + transactionHash + "?uuid=" + uuid + "&torrentUUID=" + torrentUUID +"&booty=" + (data.USD_price > 0 ? "true" : "false"), function(){
                    
                   })
                   
                }


                var confirmations = 0;
                function startLoading(){
                      var intervalMs = 300;

                      waitInterval = setInterval(function(){
                        var el = $(".web3Status");
                        var dotsStr = el.text();
                        var dotsLen = dotsStr.length;

                        var maxDots = 5;
                        $(".web3Status").text(dotsLen < maxDots ? dotsStr + '.' : '');
                      }, intervalMs);
                  }
                  var pollInterval;
                

                function send(){
                    sent = true;
                    initializePP();
                    $(".web3Status").show();
                    $(".web3Loader").show();
                    $(".web3Loader").text("Processing crypto pay!")
                    
                  function startLoading(){
                      var intervalMs = 300;

                      waitInterval = setInterval(function(){
                        var el = $(".web3Status");
                        var dotsStr = el.text();
                        var dotsLen = dotsStr.length;

                        var maxDots = 5;
                        $(".web3Status").text(dotsLen < maxDots ? dotsStr + '.' : '');
                      }, intervalMs);
                  }
                  startLoading(); 
                }
                  
                return;
            
            })
        
         
        
        
      });
  })
}
      //  var batch = new web3.BatchRequest();
     /* */
   
      
      var abi3 = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"typeAndVersion","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}]
      /*
          web3.eth.sendTransaction({
                to:propagateAddress, 
                from:account,
                gasPrice: web3.utils.toHex(suggestion_gas),
                gasLimit: web3.utils.toHex(estimate_gas),
                value:web3.utils.toWei(amountEth, "ether")
              }).once("transactionHash", function(hash){
                transactionHash0 = hash;
              }).on("sent",function(){
                  web3.eth.sendTransaction({
                    to:curatorAddress, 
                    from:account,
                    gasPrice: web3.utils.toHex(suggestion_gas),
                    gasLimit: web3.utils.toHex(estimate_gas2),
                    value:web3.utils.toWei(amountEth, "ether")
                  }).once("transactionHash", function(hash){
                    transactionHash1 = hash;
                    }).on("sent",function(){
                    sentTransaction();
                  }).on('receipt', function(receipt){
                    procReceipt(transactionHash1);

                 }).catch(function(err){
                  transErr(err);
                 })
                 sentTransaction();
               })
              .on('receipt', function(receipt){
                procReceipt(transactionHash0)
                }).catch(function(err){
              transErr(err);
             })
             */
      /**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

    var aggregatorV3InterfaceABI = [
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
    /*const addr = "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c"
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr)
    priceFeed.methods
      .latestRoundData()
      .call()
      .then(async roundData => {
        // Do something with roundData
        var price = Number(roundData.answer) / 1e8;
        price = price.toFixed(2);
        console.log("Latest Round Data", price)
        function convertCurrency(amount, fromCurrency, toCurrency) { 
          const exchangeRate = getExchangeRate(fromCurrency, toCurrency); 
          const convertedAmount = exchangeRate * amount; 
          return convertedAmount; 
        } 
         
        function getExchangeRate(fromCurrency, toCurrency) { 
          // In this example, the exchange rate is hardcoded, but in a real-world scenario, you would get this information from an API. 
          const exchangeRates = { 
            ETH: 1,
            USD : price
          }; 
          return exchangeRates[toCurrency] / exchangeRates[fromCurrency]; 
        } 
         
        const amount = parseFloat(amountLINK); 
        const fromCurrency = "USD"; 
        const toCurrency = "ETH"; 
         
        const convertedAmount = convertCurrency(amount, "USD", "LINK"); 
        console.log(convertedAmount);
        //get estimate Gas
        const suggestion_gas = await web3.eth.getGasPrice();
        console.log(account);
        console.log(curatorAddress);
        //let myContract = new web3.eth.Contract(abi, contractAddress, {from:account});
        var transCount = web3.eth.getTransactionCount(account);
        let value = web3.utils.toWei(parseFloat(convertedAmount), "ether");
        let data4 = myContract.methods.transfer(propagateAddress, web3.utils.toWei(parseFloat(convertedAmount), "ether")).encodeABI();
        var data5 = myContract.methods.transfer(curatorAddress, web3.utils.toWei(parseFloat(convertedAmount), "ether")).encodeABI();*/
        /*const estimate_gas = await web3.eth.estimateGas({
            'from': account,
            'data' : data4,
            'to': contractAddress
         
        });
        let rawTx = {
            'gasPrice': web3.utils.toHex(suggestion_gas),
            'gasLimit': web3.utils.toHex(estimate_gas),
            "from" : account,
           // "nonce" : web3.utils.toHex(transCount),
            "to": contractAddress,
            "data" : data4,
            "value" : "0x0"
        }
        let rawTx2 = {
            'gasPrice': web3.utils.toHex(suggestion_gas),
            'gasLimit': web3.utils.toHex(estimate_gas),
            "from" : account,
           // "nonce" : web3.utils.toHex(transCount),
            "to": contractAddress,
            "data" : data5,
            "value" : "0x0"

        }
        var batch = new web3.BatchRequest();
      batch.add(web3.eth.sendTransaction(rawTx).on('transactionHash', function(txHash){
        transactionHash0 = txHash;
      }));
      batch.add(web3.eth.sendTransaction(rawTx2).on('transactionHash', function(txHash){
        transactionHash1 = txHash;
      }).on('confirmation', function(confirmationNumber, receipt){
        procReceipt(transactionHash1, confirmationNumber)
      }));
      batch.execute();
    })*/


      /*
      web3.eth.sendTransaction(rawTx).on('transactionHash', function (txHash) {

      }).once("transactionHash", function(hash){
        transactionHash0 = hash;
      }).on("sent", function(){
        sentTransaction();
      }).on('receipt', function (receipt) {
          console.log("receipt:" + receipt);
          procReceipt(transactionHash0);
      }).on('confirmation', function (confirmationNumber, receipt) {
          //console.log("confirmationNumber:" + confirmationNumber + " receipt:" + receipt);
      }).on('error', function (error) {
        $(".web3").prop("disabled", false)
        transErr(err);
      });
      */
        
   

      


var ppInterval2;
function initializePP2(){
$('#popupImage')
     //.hide()
     .fadeIn(737);
   

   var pp=1;
    ppInterval2 = setInterval(function(){
    if(pp === 2){
      pp=1;
      $("#popupImage").fadeOut(737);
      $("#popupImage2").fadeIn(737);
    }
    else{
      pp=2;
      $("#popupImage2").fadeOut(737);
      $("#popupImage").fadeIn(737);
    }
   },737)
}

function dismissPP2(){
  if(ppInterval2)
      clearInterval(ppInterval2);
  $(".popupImage").hide();
  $("#popupImage2").fadeOut();
  $("#popupImage").fadeOut();
    
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
