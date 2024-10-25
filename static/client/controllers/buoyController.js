function initializeBuoy(cb){
  //donation


  $("#donation_submit").unbind("click")
  $("#donation_submit").click(function(e){
		e.preventDefault();
		donate();
		//alert("BTC Address: 3D3wMrdQ44p92YcL2fzyxHTdmkWqHoz9wQ")
	})
  
  //social
  
  //fb
  var script = document.createElement('script');

  script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0";
  document.head.appendChild(script);
  
  //twitter
  window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

	$("#invite_button").hide();
	$("#edit_buoy_textarea").hide();
	$("#submit_buoy_textarea").hide();
	$("#ranks").hide();
	$("#invite_input").hide();
	$("#edit_buoy_description").hide();
	$(".buoy_bulletins").empty();
	$("#buoy_preferences").hide();
  $("#stats_featured").empty();
  $.get("/stats", function(data){
    $("#stats_featured").append("<a href='#source?uuid=" + data.source.properties.uuid + "' class='ANCHOR source'>" +
                               data.source.properties.title + "</a>")
    $("#stats_torrents").text(toNumber(data.numTorrents));
    $("#stats_authors").text(toNumber(data.numAuthors));
    $("#stats_users").text(toNumber(data.numUsers));
    $("#stats_classes").text(toNumber(data.numClasses));
    $("#stats_snatches").text(data.snatches)
  })
  
	console.log("HARBOR");
	$.get("/home?user="+ (getUser() ? getUser().uuid : null), function(data){
		setBuoy(data.buoy);
		setAccess(data.access);
		var buoy = data.buoy
		var access = getAccess();
		console.log(data);
		console.log(access);
		if(access){
			if(access.rankTitle === "Philosopher King" || access.rankTitle === "Silver" || access.rankTitle === "Gold" || access.rankTitle === "Guardian"){
				$("#buoy_preferences").show();
			}
			console.log(getUser())
			if(access.description){
				console.log("ACCESS")

				$("#edit_buoy_description").show();
			}
			if(buoy.private && access.invites){
				$("#invite_button").show();
				$("#invite_input").show();
			}	
		}
		
		if(data.bulletins && data.bulletins.length > 0){
			data.bulletins.forEach(function(bulletin){
				
				var h3 = document.createElement('h3');
				$(h3).text(decodeEntities(bulletin.properties.title));
				var p = document.createElement('p');
				$(p).text(decodeEntities(bulletin.properties.text));
				var span = document.createElement("span");
				var div = document.createElement("div");
				$(span).html("Posted by <a href='#user?uuid=" + bulletin.properties.userUUID + "' class='ANCHOR user'>" + bulletin.properties.userName + "</a> " + timeSince(bulletin.properties.time) + " ago.");
				if(bulletin.properties.title !== "About Us" && bulletin.properties.title !== "Testing New Bulletin System" && bulletin.properties.title !== "Testing Bulletin System"){
					$(div).addClass("bulletin");
					$(div).attr("id", bulletin.properties.uuid)
					$(".buoy_bulletins").append(div);
					$(div).append(h3);
					$(div).append(span);
					$(div).append(p);
					$(div).append("<br>")			
				}
				
			})
		}

		if(data.buoy.bulletin_title){

			for(var i=data.buoy.bulletin_title.length -1; i >= 0; i--){
				
				var h3 = document.createElement('h3');
				$(h3).text(decodeEntities(data.buoy.bulletin_title[i]));
				var p = document.createElement('p');
				$(p).text(decodeEntities(data.buoy.bulletin_text[i]));
				var div = document.createElement("div");

				if(data.buoy.bulletin_title[i] !== "Testing New Bulletin System" && data.buoy.bulletin_title[i] !== "Test" && data.buoy.bulletin_title[i] !== "Gangstalking" && data.buoy.bulletin_title[i] !== "Shameless Self-Promotion"){
					$(div).addClass("bulletin");
					$(div).attr("id", data.buoy.bulletin_title[i]);
					$(".buoy_bulletins").append(div);
					$(div).append(h3);
					$(div).append(p);
					$(div).append("<br>")
				}
				
			}
		}
		$("#buoy_description").html(decodeEntities(buoy.description));
		$("#buoy_title").text(buoy.buoy);
		//loader gif
		cb();
	})
}


function populate(id, val){
	var input = document.createElement("input");
	 $(input).attr("placeholder", "Type");
	 $(input).addClass("type_input");
	 if(val) $(input).val(val);
	 $("#" + id + "_buoy").append(input);
	 var a = document.createElement('a');
	 $(a).text("[-]");
	 $(a).attr("href", "#")
	 $("#" + id + "_buoy").append(a);
	 var br = document.createElement("br");
	 $("#" + id + "_buoy").append(br);
	 $(a).click(function(e){
	 	e.preventDefault();
	 	$(a).remove();
	 	$(input).remove();
	 	$(br).remove();
	 })
}

function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

function initializeEditBuoy(cb){
	$("#add_types_buoy").empty();
	$("#add_media_buoy").empty();
	$("#add_formats_buoy").empty();
	$.get("/upload_structure", function(data){
		console.log(data);
		data.buoy.types.forEach(function(val){
			populate("add_types", val);
		})
		data.buoy.media.forEach(function(val){
			populate("add_media", val);
		})
		data.buoy.formats.forEach(function(val){
			populate("add_formats", val);
		})
		cb();

	})
}

async function donate(){
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
	var donation = parseFloat($(".donation").val());
	const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c")
	priceFeed.methods
	.latestRoundData()
	.call()
	.then(async roundData => {
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
		let myContract = new web3.eth.Contract(abi, contractAddress, {from:account});
		const convertedAmount = convertCurrency(donation, "USD", "LINK");
		const suggestion_gas = await web3.eth.getGasPrice();
		console.log(convertedAmount);
		let value = web3.utils.toWei(parseFloat(convertedAmount.toFixed(7)), "ether");
		let data = myContract.methods.transfer("0xd6616Cf7F133F0c00E2712718B8133c20E3F6605", value).encodeABI()

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

	      alert("Your donation has been successfully sent! Thank you for your contribution to the Public Domain. Transaction hash: " + transactionHash)

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
	})
}


      var abi = [
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

 const aggregatorV3InterfaceABI2 = [
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