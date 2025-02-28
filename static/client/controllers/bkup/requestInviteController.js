function initializeRequestInvite(){
	$("#request_bittorrent").hide();
	$("#why_join").hide();
	$("#request_invite_submit").hide();
	$(".request_invite p").hide();
	$("#request_success").hide();
	$("#to_request").hide();
	$.get("/invite_requested", function(data){
		console.log(data);
		if(data.requested){
			$("#accepted").text("Your invite request has been sent. Please allow 24-72 hrs for processing.")
		}
		else{
			$("#request_bittorrent").fadeIn();
			$("#why_join").fadeIn();
			$("#request_invite_submit").fadeIn();
			$(".request_invite p").fadeIn();
			$("#request_success").fadeIn();
			$("#to_request").fadeIn();
		}
	})
	$("#request_invite_submit").unbind("click");
	$("#request_success").text("")
	$("#request_register").attr("href", "#register?buoy=" + ANCHOR.getParams().buoy)
	$("#request_invite_submit").click(function(){
		$("#request_invite_submit").prop("disabled", true)
		$.post("/request_invite", {why : $("#why_join").val(), bt : $("#request_bittorrent").val() }, function(data){
			if(data.errors){
				$("#request_success").text(data.errors[0].msg)
				$("#request_invite_submit").prop("disabled", false)
			}
			else{
				$("#accepted").text("Your invite request has been sent. Please allow 24-72 hrs for processing.")
				$("#request_bittorrent").fadeOut();
				$("#why_join").fadeOut();
				$("#request_invite_submit").fadeOut();
				$(".request_invite p").fadeOut();
				$("#request_success").fadeOut();
				$("#to_request").fadeOut();
			}
		})
	})
}

function initializeKingInvites(){
	$(".invite_requests_table tbody").empty();
	$.get("/get_invites", function(data){
		if(data.invites && data.invites.length > 0){
			console.log(data.invites)
			data.invites.forEach(function(record){
				console.log($(".invite_requests_table tbody"));
				$(".invite_requests_table tbody").append("<tr id='tr_" + record._fields[0].properties.uuid + "'><td>" 
					+ record._fields[0].properties.userName + "</td><td>" + 
					record._fields[0].properties.why + "</td><td>" + record._fields[0].properties.bt + " </td><td>" + 
					"<button class='invite_btn accept' id='accept_" + record._fields[0].properties.uuid  +"'>Accept</button><button class='invite_btn reject' id='reject_" + 
					record._fields[0].properties.uuid + "'>Reject</button></td></tr>")
				$("#accept_" + record._fields[0].properties.uuid).click(function(){
					$(this).prop("disabled", true)
					console.log(record._fields[0].properties.uuid);
					var that = $(this)
					$.post("/accept/" + record._fields[0].properties.uuid, function(data){
						that.prop("disabled", false)
						$("#tr_" + record._fields[0].properties.uuid).remove();
					})
				})
				$("#reject_" + record._fields[0].properties.uuid).click(function(){
					var that = $(this);
					$.post("/reject/" + record._fields[0].properties.uuid, function(data){
						that.prop('disabled', false)
						$("#tr_" + record._fields[0].properties.uuid).remove();
					})
				})
			})	
		}
		
	})
}