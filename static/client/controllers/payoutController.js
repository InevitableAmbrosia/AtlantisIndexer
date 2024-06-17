function initializeATLANTIS(){
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
				$("#payouts tbody").append("<tr><td>" + record._fields[1].properties.time + "</td><td>" +
				record._fields[1].properties.toAddress + "</td><td>" + 
					record._fields[1].properties.transactionHash + "</td><td>" + record._fields[1].properties.amount + "</td>")
				dt.draw();
			}
			if(i === data.records.length - 1){
				var dt = $("#payouts").dataTable();				
			}
		})



	})


	$("#payout").unbind("click")

	$("#payout").click(function(){
		$(this).prop("disabled", true)
		alert("Processing your transaction for " + $("#payout").data("atlantis") + " ATLANTIS. Allow up to 1 minute to process your transaction!")
		$.post("/cashout", function(data){
			if(data.status){
				alert("You have cashed out " + $("#payout").data("atlantis") + " ATLANTIS! Thank you for providing your services to our public.")
			}
		    else{
		        alert("Please be sure that you have set an ATLANTIS address in your profile!")
		    }
			console.log(data);
			initializeATLANTIS();
		})
	})
}