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
	 	$(".mobile_menu").slideUp();
	 }
 	 
 }

 function dismissLoader(){
 	if(loaderInitialized){
    setTimeout(function(){
      $(".loading").hide();
      $("h2:not(.loading)").fadeIn()  
    }, 555)
    
 	  $("#overlay").hide();
	  //if(loader){
 		dismissPP();


	 	//}
	 	loaderInitialized = false;
	 	//$(".ANCHOR_partial ." + ANCHOR.page()).fadeIn(1337);
	 	//ANCHOR._show_div(ANCHOR.page());
 	}
 }//


 function init(){
 	//initializeStGeorge();
 	//dismissLoader(); //necessary? who cares!
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
  $(".loading").text("Loading...!")
  //$(".ANCHOR_partial").hide();
  //audioModel.audio.pause();
	if(ANCHOR.page() === "torrents" || ANCHOR.page() === "class" || ANCHOR.page() === "source" || ANCHOR.page() === "author" ||
	 ANCHOR.page() === "user_uploads" || ANCHOR.page() === "user_downloads" || ANCHOR.page() === "publisher"){
		//initializeLoader();
    //console.log(sourceUUID, ANCHOR.getParams().uuid)
    var $window = $(window)
    var windowsize = $window.width();
      
    if(ANCHOR.page()  === "torrents"){
   
    	$.get("../client/views/torrents.html", function(data){
          torrentsLoaded = true;
					$("div.torrents").html(data)	
          $("div.torrents").fadeIn();
          htmlSearch();
          initializeTorrents("torrents", dismissLoader)
    			ANCHOR.buffer();
    	})
  	}
    else  if(ANCHOR.page() === "source" && ANCHOR.getParams() && ANCHOR.getParams().uuid !== uuid){
      uuid = ANCHOR.getParams().uuid;
		  
		  	
		  	if(!sourceLoaded){
		  		  	sourceLoaded = true;
		  			$.get("../client/views/source.html", function(data){
							//if(ANCHOR.page() === "source")
								//initializeSource();
							$("div.source").html(data);
              $("div.source").fadeIn();
							$("#recommend_source").click(function(e){
								e.preventDefault();
								$.post("/recommend/source?uuid=" + ANCHOR.getParams().uuid, function(data){
									ANCHOR.route("#source?uuid=" + data.source.uuid);
								})

							})
		 					initializeTorrents(ANCHOR.page(), dismissLoader);

		 					ANCHOR.buffer();
		 				})
		  	}
		  	else{
          $("div.source").fadeIn();
		  		initializeTorrents(ANCHOR.page(), dismissLoader);

		  	}  	
		
		  
		  if(windowsize >= 1080) {
		  	initializeGraph(dismissLoader)
		  }
    }
    else if(ANCHOR.page() === "author" && ANCHOR.getParams() && ANCHOR.getParams().uuid !== uuid){
      uuid = ANCHOR.getParams().uuid;

    	if(!authorLoaded){
    		  		authorLoaded = true;

    		$.get("../client/views/author.html", function(data){
    			$("div.author").html(data);
          $("div.author").fadeIn()
  				$("#recommend_author").click(function(e){
									e.preventDefault();
									$.post("/recommend/author?uuid=" + ANCHOR.getParams().uuid, function(data){
										ANCHOR.route("#author?uuid=" + data.author.uuid);
									})
								})
		 			 initializeTorrents(ANCHOR.page(), dismissLoader);
		 			 ANCHOR.buffer();

    		})
    	}
    	else{
        $("div.author").fadeIn();
		  	initializeTorrents(ANCHOR.page(), dismissLoader);

    	}
    	  		  if(windowsize >= 1080) {
		  	initializeGraph(dismissLoader)
		  }
    }
    else if(ANCHOR.page() === "class" && ANCHOR.getParams() && ANCHOR.getParams().uuid !== uuid){
      uuid = ANCHOR.getParams().uuid;
		  if(!classLoaded){
		  	classLoaded = true;
    		$.get("../client/views/class.html", function(data){
    			$("div.class").html(data);
          $("div.class").fadeIn();
    			$("#recommend_class").click(function(e){
													e.preventDefault();
													$.post("/recommend/class?uuid=" + ANCHOR.getParams().uuid, function(data){
														ANCHOR.route("#class?uuid=" + data.class.uuid);
													})
												})
		 			 initializeTorrents(ANCHOR.page(), dismissLoader);
		 			 ANCHOR.buffer();

    		})
    	}
    	else{
        $("div.class").fadeIn();
		  	initializeTorrents(ANCHOR.page(), dismissLoader);

    	}
		  if(windowsize >= 1080) {
		  	initializeGraph(dismissLoader)
		  }
    }
    else if(ANCHOR.page() === "publisher" && ANCHOR.getParams() && ANCHOR.getParams().publisher !== uuid){
      uuid = ANCHOR.getParams().publisher;
		  if(!publisherLoaded){
		  	publisherLoaded = true;
    		$.get("../client/views/publisher.html", function(data){
    			$("div.publisher").html(data);
          $("div.publisher").fadeIn()
    			$("#recommend_publisher").click(function(){
													$.post("/recommend/publisher?publisher=" + encodeURIComponent(ANCHOR.getParams().publisher), function(data){
														if(data.errors){
														alert(data.errors[0].msg)
														}
														else{
															ANCHOR.route("#publisher?publisher=" + encodeURIComponent(data.publisher))
														}
													})
		 	
    			})
          initializeTorrents(ANCHOR.page(), dismissLoader);
		 			ANCHOR.buffer();
    		})
    	}
    	else{
        $("div.publisher").fadeIn()
		  	initializeTorrents(ANCHOR.page(), dismissLoader);

    	}
		  if(windowsize >= 1080) {
		  	initializeGraph(dismissLoader)
		  }
    }
    else if(ANCHOR.page() === "user_uploads" && ANCHOR.getParams() && ANCHOR.getParams().uuid !== uuid){
      uuid = ANCHOR.getParams().uuid;
      if(!userUploadsLoaded){
      	userUploadsLoaded = true;
    		$.get("../client/views/user_uploads.html", function(data){
          $("div.user_uploads").fadeIn()
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
    			ANCHOR.buffer();
		 			 initializeTorrents(ANCHOR.page(), dismissLoader);

    		})
    	}
    	else{
        $("div.user_uploads").fadeIn()
		  	initializeTorrents(ANCHOR.page(), dismissLoader);

    	}
		  initializeTorrents(ANCHOR.page(), dismissLoader);
    }
		else if(ANCHOR.getParams() && ANCHOR.getParams().uuid !== sourceUUID && ANCHOR.getParams().uuid !== authorUUID && ANCHOR.getParams().uuid !== classUUID && ANCHOR.getParams().publisher !== publisherName){
      initializeTorrents(ANCHOR.page(), dismissLoader);
    }
    
	}

	else if(ANCHOR.page() === "top10"){
		//sort of wonky dismisslaoder
    top10Loaded = true;

		$.get("../client/views/top10.html", function(data){
			$("div.top10").html(data);
      $("div.top10").fadeIn();
      initializeTorrents("top10_day", dismissLoader);
      initializeTorrents("top10_week", dismissLoader);
      initializeTorrents("top10_month", dismissLoader);
      initializeTorrents("top10_year", dismissLoader);
      ANCHOR.buffer();
      htmlSearch();

		})
    	
    	

		//initializeTorrents("top10_alltime", dismissLoader);
	}
	else if(ANCHOR.page() === "upload"){
		count++;
		$.get("../client/views/upload.html", function(data){
			$("div.upload").html(data);
			htmlUpload();
      htmlSearch();
      $("div.upload").fadeIn()
			initializeUpload(dismissLoader);
			ANCHOR.buffer();

		})
		//initializeLoader();
	}
	else if(ANCHOR.page() === "publishers"){
		if(!publishersLoaded){
			publishersLoaded  = true;
			$.get("../client/views/publishers.html", function(data){
				$("div.publishers").html(data);
				initializePublishers(dismissLoader);
        $("div.publishers").fadeIn();
				ANCHOR.buffer();			
			})
		}
	}
	else if(ANCHOR.page() === "authors" && !authorsLoaded){
		authorsLoaded = true;
		initializeAuthors(dismissLoader)
		$.get("../client/views/authors.html", function(data){
				$("div.authors").html(data);
				initializeAuthors(dismissLoader);	
        $("div.authors").fadeIn()
				ANCHOR.buffer();		
			})
	}
	else if(ANCHOR.page() === "classes"){
		initializeLoader();
    if(!classesLoaded){
		  classesLoaded=true;
      $.get("../client/views/classes.html", function(data){
				$("div.classes").html(data);
				initializeClasses(dismissLoader);			
				ANCHOR.buffer();
        $("div.classes").fadeIn()
			})
      initializeClasses(dismissLoader);
            
    }
	}
	else if(ANCHOR.page() === "user"){
		initializeLoader();
		$.get('../client/views/user.html',function(data){
			$("div.user").html(data);
			initializeUser(dismissLoader);
			ANCHOR.buffer();
      $("div.user").fadeIn();

		})
  }
	else if(ANCHOR.page() === "login" && !loginLoaded){
		loginLoaded = true;
		$.get("../client/views/login.html", function(data){
			$("div.login").html(data);
      $("div.login").fadeIn();
			ANCHOR.buffer();
		})
	}
	else if(ANCHOR.page() === "file_manager"){
		$.get("../client/views/file_manager.html", function(data){
			$("div.file_manager").html(data);
      $("div.file_manager").fadeIn();
			ANCHOR.buffer();
		})

	}
	else if(ANCHOR.page() === "register" && !registerLoaded){
		registerLoaded = true;
		$.get("../client/views/register.html", function(data){
			$("div.register").html(data);
      $("div.register").fadeIn();
			ANCHOR.buffer();
		})
		//initializeLoader();
		//dismissLoader();
	}
	else if(ANCHOR.page() === "torrent"){
		if(!torrentLoaded){
				torrentLoaded = true;
				$.get("../client/views/torrent.html", function(data){
					$("div.torrent").html(data);
          $("div.torrent").fadeIn()
					initializeTorrent();
					ANCHOR.buffer();																				

				})
		}
		else{
			initializeTorrent();

		}
	}
	else if(ANCHOR.page() === "edit_buoy"){
		if(!editBuoyLoaded){
			$.get("../client/views/edit_buoy.html", function(data){
					$("div.edit_buoy").html(data);
					initializeEditBuoy(dismissLoader);
					ANCHOR.buffer();	
              $("div.edit_buoy").fadeIn()

				})
		}
		else{
			initializeEditBuoy(dismissLoader);

		}
	}
	else if((ANCHOR.page() === "login" || ANCHOR.page()=== "register") && auth){
		initializeLoader();
		ANCHOR.route("#user?uuid=" + getUser().uuid);
	}
	else if(ANCHOR.page() === "home" && !homeLoaded){
		$.get("../client/views/home.html", function(data){
			homeLoaded = true;
			$("div.home").html(data);
      initializeBuoy(dismissLoader)
        $("div.home").fadeIn()
		})
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




	
$.get("../client/views/header.html", function(data){
$("header").html(data);
$('#mobile_menu').click(function(e){
e.preventDefault();
$(".mobile_menu").slideUp();

})

$(".classes").click(function(e){
e.preventDefault();
$(".mobile_menu").slideUp();
})

$(".top10").click(function(e){
e.preventDefault();
$(".mobile_menu").slideUp();
})




$(".ANCHOR").click(function(e){

e.preventDefault();
$(".mobile_menu").slideUp();
})

/*$(".buoy_select").change(function(e){
e.preventDefault();
$(".mobile_menu").fadeOut();
})*/
initializeUserPanel();


/*$("#add_class_button").click(function(){
console.log("clicked");
$("#add_class_button").attr("disabled", "disabled")
$.post("/add_class", {name : $("#class_name").val()}, function(data){
	ANCHOR.route("#class?uuid=" + data.uuid);
})
})*/
					
							//upload.initialize();
	$.get("../client/views/header.html", function(data){
		$("header").html(data);
		$('#mobile_menu').click(function(e){
			e.preventDefault();
      $(".mobile_menu").slideToggle();

		})
    
    $(".classes").click(function(e){
      e.preventDefault();
      $(".mobile_menu").slideUp();
    })
    
    $(".top10").click(function(e){
      e.preventDefault();
      $(".mobile_menu").slideUp();
    })
    
    

    htmlSearch();
		$(".ANCHOR").click(function(e){

			e.preventDefault();
			$(".mobile_menu").slideUp();
		})
    $.get('../client/views/file_manager.html', function(data){
      $("div.file_manager").html(data);
      initializeUserPanel();			
      ANCHOR.buffer();																				
      var page = ANCHOR.page();
      if(!page){
        ANCHOR.route("#torrents");
      }
      else if(!$.isEmptyObject(ANCHOR.getParams())){
        ANCHOR.route("#" + page + "?" + ANCHOR.getParamsString());
      }							    	
      else{
        ANCHOR.route("#" + page)
      }
      authenticateUser();
      //initializeBuoy(dismissLoader);

      init();
      $("header").fadeIn();

      pages();
    })
		/*$(".buoy_select").change(function(e){
			e.preventDefault();
			$(".mobile_menu").fadeOut();
		})*/
    
		
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