function initializeATLANTIS(){
	$("#payouts tbody").empty();
	$("#payout").prop("disabled", true)
	$.get("/ATLANTIS", function(data){
		console.log(data);

		$("#payout").text("RECEIVE " + data.records[0]._fields[0].properties.ATLANTIS + " ATLANTIS")
		$("#payout").data("atlantis", data.records[0]._fields[0].properties.ATLANTIS)
		if(data.records[0]._fields[0].properties.ATLANTIS === 0){
			$("#payout").prop("disabled", true)
			$("#payout").text("0 ATLANTIS!")
		}
		else{
			$("#payout").prop("disabled", false)
		}
		data.records.forEach(function(record, i){
			if(record._fields[1]){
				$("#payouts tbody").append("<tr><td>" + new Date(record._fields[1].properties.time).toDateString() + "</td><td>" +
				record._fields[1].properties.toAddress + "</td><td>" + 
					record._fields[1].properties.transactionHash + "</td><td>" + (record._fields[1].properties.ETH ? 
					"$2.00 ETH" : record._fields[1].properties.amount + " ATLANTIS" ) + "</td>")
			}
			if(i === data.records.length - 1){
				var dt = $("#payouts").dataTable();				
			}
		})



	})
	$("#payout").unbind("click")

	$("#payout").click(async function(){
		console.log(user);
		if(!user || !user.atlsd){
			alert("You must set an ATLANTIS address in your profile settings to receive a payout!")
			return;
		}
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
	    const account = await getAccount();
		console.log(user);	    
	    $.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", async function(data){	
	    	alert("You must pay a $2.00 ETH transaction fee to cash out your ATLANTIS.")
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

	        var convertedETH = convertCurrency(2, "USD", "ETH").toFixed(7);
	        console.log(convertedETH.toString());
	        var trans = "0x" + new BigNumber(web3.utils.toWei(convertedETH, "ether")).toString(16);
	        var propagateAddress = "0x68663EB789CB1b20eBa9F693fdf927Dc195DB114"
	        var transactionHash;
	        var send = web3.eth.sendTransaction({ from: account, to: propagateAddress, value: trans }).on("transactionHash", function(txHash){
	        	transactionHash = txHash;
	        }).on("confirmation", function(){
	        	$.post("/payout_transaction/" + transactionHash);
	        	alert("Thank you, now processing your transaction for $" + $("#payout").data("atlantis") + " ATLANTIS. Allow up to 1 minute to process your transaction!")
   				$.post("/cashout", function(data){
					if(data.status){
						alert("You have cashed out " + $("#payout").data("atlantis") + " ATLANTIS! Thank you for providing your services to our public.")
						postHealth();
					}
				    else{
				        alert("Please be sure that you have set an ATLANTIS address in your profile!")
				    }
					console.log(data);
					initializeATLANTIS();
				})

	        });

	        
		
		
		})



	})

}