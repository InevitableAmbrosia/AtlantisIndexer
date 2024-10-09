var loader;
var count = 0;
var loaderInitialized = true;

/*
TODO: Jquery UI for autocomplete search
$('#myElement').animate({backgroundColor: '#FF0000'}, 'slow');
var i = 0;
function change() {
  var doc = document.getElementById("overlay");
  var color = ["palegoldenrod", "lightcyan"];
  doc.style.backgroundColor = color[i];
  i = (i + 1) % color.length;
}
setInterval(change, 889);*/
			
var ppInterval;


function initializePP(){
$('#popupImage')
	   //.hide()
	   .fadeIn(737);
 	 

 	 var pp=1;
 	  ppInterval = setInterval(function(){
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

function dismissPP(){
	if(ppInterval)
 			clearInterval(ppInterval);
	$(".popupImage").hide();
 		
}

 function initializeLoader(){
 	if(!loaderInitialized){
 		loaderInitialized = true;
 	  initializePP();
	 	$('#overlay').show();
	 	console.log("LOADING!");
	 	$(".mobile_menu").fadeOut(790);
	 }
 	 
 }

 function dismissLoader(){
 	if(loaderInitialized){
 		console.log("NOT LOADING!");

 	  $("#overlay").hide();
	  //if(loader){
 		dismissPP();


	 	//}
	 	loaderInitialized = false;
	 	//$(".ANCHOR_partial ." + ANCHOR.page()).fadeIn(1337);
	 	//ANCHOR._show_div(ANCHOR.page());
 	}
 }

var firstLoad = true;


 function init(){
 	initializeStGeorge();
 	dismissLoader(); //necessary? who cares!
 	if(ANCHOR.page() !== "upload" && ANCHOR.page() !== "file_manager" && ANCHOR.page() !== "login" && ANCHOR.page() !== "register" && ANCHOR.page() !== "create_buoy" 
 		&& ANCHOR.page() !== "torrent"){
		initializeLoader();
	}

	$(".autosuggestBox").hide();
	//for back button when buoy changes
	/*if(ANCHOR.getParams() && getBuoy() && getBuoy().uuid !== ANCHOR.getParams().buoy){
		switchBuoy();
	}*/
	ANCHOR.buffer();
 }

 function pages(){
 	audioModel.audio.pause();
	if(ANCHOR.page() === "torrents" || ANCHOR.page() === "class" || ANCHOR.page() === "source" || ANCHOR.page() === "author" ||
	 ANCHOR.page() === "user_uploads" || ANCHOR.page() === "user_downloads" || ANCHOR.page() === "publisher"){
		console.log("INITIALIZING TORRENTS FROM INDEX")
		initializeLoader();
		initializeTorrents(ANCHOR.page(), dismissLoader);
		if(ANCHOR.page() === "source"){
			initializeSource();
			initializeSourceSpirit()
			initializeGraph(dismissLoader);
		}
	}
	else if(ANCHOR.page() === "AI"){
		initializeAI();
	}
	else if(ANCHOR.page() === "ATLANTIS"){
		initializeATLANTIS();
	}
	else if(ANCHOR.page() === "request_invite"){
		initializeRequestInvite();
		initializeLoader();
	}
	else if(ANCHOR.page() === "king_invites"){
		initializeLoader();
	}
	else if(ANCHOR.page() === "world_spirit"){
		initializeLoader();
		initializeWorldSpirit();

	}
	else if(ANCHOR.page() === "graph"){
		initializeLoader()
		initializeGraph(dismissLoader);
	}
	else if(ANCHOR.page() === "top10"){
		//sort of wonky dismisslaoder
		initializeLoader();
		initializeTorrents("top10_day", dismissLoader);
		initializeTorrents("top10_week", dismissLoader);
		initializeTorrents("top10_month", dismissLoader);
		initializeTorrents("top10_year", dismissLoader);
		initializeTorrents("top10_alltime", dismissLoader);
	}
	else if(ANCHOR.page() === "upload"){
		count++;
		initializeLoader();
		initializeUpload(dismissLoader);
	}
	else if(ANCHOR.page() === "classes"){
		initializeLoader();
		initializeClasses(dismissLoader);
	}
	else if(ANCHOR.page() === "user"){
		initializeLoader();
		initializeUser(dismissLoader);
	}
	else if(ANCHOR.page() === "home"){
		initializeLoader();
		initializeBuoy(dismissLoader);
	}
	else if(ANCHOR.page() === "login"){
		console.log("DISMISSING LOADER from LOGIN")
		initializeLoader();
		dismissLoader()
	}
	else if(ANCHOR.page() === "file_manager"){
		initializeLoader();
		dismissLoader()
	}
	else if(ANCHOR.page() === "register"){
		initializeLoader();
		console.log("DISMISSING LOADER from REGISTER")
		dismissLoader();
	}
	else if(ANCHOR.page() === "torrent"){
		initializeTorrent();
		initializeLoader();
		dismissLoader();
	}
	else if(ANCHOR.page() === "create_buoy"){
		$("#buoy_errors").text("");
		$("#buoy_pos").text("")
		initializeLoader();
		dismissLoader();
	}
	else if(ANCHOR.page() === "edit_buoy"){
		initializeLoader();
		initializeEditBuoy(dismissLoader);
	}
	else if((ANCHOR.page() === "login" || ANCHOR.page()=== "register") && auth){
		initializeLoader();
		ANCHOR.route("#user?uuid=" + getUser().uuid);
	}
 }

$(document).ready(function(){
	var $window = $(window);

  function checkWidth() {
      var windowsize = $window.width();
      if (windowsize >= 1080) {
          //if the window is greater than 440px wide then turn on jScrollPane..
          $(".mobile_menu").hide();
      }
  }
  // Bind event listener
  $(window).resize(checkWidth);

	$(document).on("ANCHOR", function(){
		if(!firstLoad){
			//so the loader appears to reload when headers are clicked while original page is loading
			init();
			pages();
		}
		firstLoad = false;    
	})


	$("#web3Status").hide();

	//mobile




	$.get("../client/views/register.html", function(data){
		$("div.register").html(data);
		$.get("../client/views/login.html", function(data){
			$("div.login").html(data);									
			$.get("../client/views/torrent.html", function(data){
				$("div.torrent").html(data);
				$.get("../client/views/header.html", function(data){
					$("header").html(data);
					$('#mobile_menu').click(function(e){
						e.preventDefault();
						console.log("CLICKED")
						$(".mobile_menu").fadeToggle(1337)
					})


					$(".ANCHOR").click(function(e){

						console.log("CLICKED!!!")
						e.preventDefault();
						$(".mobile_menu").fadeOut();
					})

					$(".buoy_select").change(function(e){
						e.preventDefault();
						$(".mobile_menu").fadeOut();
					})
					initializeUserPanel();
					
					$.get("../client/views/home.html", function(data){
						$("div.home").html(data);

					
						$.get("../client/views/source.html", function(data){
							//if(ANCHOR.page() === "source")
								//initializeSource();
							$("div.source").html(data);
							//initializeSource();
								$("#recommend_source").click(function(e){
								e.preventDefault();
								$.post("/recommend/source?uuid=" + ANCHOR.getParams().uuid, function(data){
									ANCHOR.route("#source?uuid=" + data.source.uuid);
								})
							})
							$.get("../client/views/author.html", function(data){

								$("div.author").html(data);
								$.get("../client/views/graph.html", function(data){
									$("#recommend_author").click(function(e){
										e.preventDefault();
										$.post("/recommend/author?uuid=" + ANCHOR.getParams().uuid, function(data){
											ANCHOR.route("#author?uuid=" + data.author.uuid);
										})
									})
									$("div.graph").html(data);
									$.get("../client/views/torrents.html", function(data){
										$("div.torrents").html(data)	
										console.log("ADDED TORRENTS HTML DATA");
										//var torrentsTable = $("#torrents").DataTable()
										//initializeTorrents();
										$.get("../client/views/classes.html", function(data){
											$("div.classes").html(data);
											$("#add_class_button").click(function(){
												console.log("clicked");
												$("#add_class_button").attr("disabled", "disabled")
												$.post("/add_class", {name : $("#class_name").val()}, function(data){
													ANCHOR.route("#class?uuid=" + data.uuid);
												})
											})
											$.get("../client/views/class.html", function(data){
												$("div.class").html(data);
												$("#recommend_class").click(function(e){
													e.preventDefault();
													console.log("CLASSY");
													$.post("/recommend/class?uuid=" + ANCHOR.getParams().uuid, function(data){
														ANCHOR.route("#class?uuid=" + data.class.uuid);
													})
												})
												$.get("../client/views/upload.html", function(data){
													$("div.upload").html(data);
													//upload.initialize();
													htmlUpload();
													
													$.get("../client/views/top10.html", function(data){
														$("div.top10").html(data);
														$.get("../client/views/401.html", function(data){
															$("div.401").html(data);
															$.get("../client/views/user.html", function(data){													
																$("div.user").html(data);
																$.get("../client/views/create_buoy.html", function(data){
																	$("div.create_buoy").html(data);
																	$.get("../client/views/file_manager.html", function(data){
																		//callback hades
																		$("div.file_manager").html(data);
																		$.get("../client/views/edit_buoy.html", function(data){
																			$("div.edit_buoy").html(data);
																			$.get("../client/views/world_spirit.html", function(data){
																				$("div.world_spirit").html(data);
																				htmlSearch();
																					$.get("../client/views/user_uploads.html", function(data){
																						$("div.user_uploads").html(data);
																						$("#recommend_uploads").click(function(){
																							$.post("/recommend/user_uploads?uuid=" + ANCHOR.getParams().uuid, function(data){
																								if(data.errors){
																									alert(data.errors[0].msg)
																								}
																								else{
																									ANCHOR.route("#user_uploads?uuid=" + data.user.uuid)
																								}
																							})
																						})
																						$.get("../client/views/user_downloads.html", function(data){
																							$("div.user_downloads").html(data);
																							$.get("../client/views/ATLANTIS.html", function(data){
																								$("div.ATLANTIS").html(data);
																								$.get("../client/views/publisher.html", function(data){
																									$("div.publisher").html(data);
																										$("#recommend_downloads").click(function(){
																										$.post("/recommend/user_downloads?uuid=" + ANCHOR.getParams().uuid, function(data){
																											if(data.errors){
																													alert(data.errors[0].msg)
																												}
																												else{
																													ANCHOR.route("#user_downloads?uuid=" + data.user.uuid)
																												}
																											})
																										})
																										$.get("../client/views/AI.html", function(data){
																											$("div.AI").html(data);
																											ANCHOR.buffer();																				
																									    var page = ANCHOR.page();
																									    console.log(page);
																									    if(!page){
																									    	ANCHOR.route("#home");
																									    }
																									    else if(!$.isEmptyObject(ANCHOR.getParams())){
																										    ANCHOR.route("#" + page + "?" + ANCHOR.getParamsString());
																									    }							    	
																									    else{
																									    	ANCHOR.route("#" + page)
																									    }
																									    authenticateUser();
																																									    
																											init();
																											pages();
																										})

																									
																									
																								})
																							})
																							

																						})
																							
																					})
																				

																			})
																			
																		})
																		
																	})
															   

														    })
													    })
														})
													})
												})	
											})
										})
									})			
								})	
							})
						})	
					})
				})
			})
		})
	})	
	
})



function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}