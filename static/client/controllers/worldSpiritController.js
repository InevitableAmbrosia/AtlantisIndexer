function initializeSource(){	
	worldSpirit.sourceUUID = ANCHOR.getParams().uuid;

}	
	
		
	
	    


function getAphorism(id){
    	clearAphorism();
    	$.get("/aphorism/" + id, function(data){
    		console.log(data);
    		$("#src_aphorism_title").text(decodeEntities(data.title));
    		$("#src_aphorism_text").text(decodeEntities(data.text));
    		$("#src_aphorism_classes").text("");
    		if(data.classes && data.classes.length > 0){
	    		data.classes.forEach(function(node, i){
	    			if(i===0){
	    				$("#src_aphorism_classes").append("<a class='ANCHOR class' href='#class?uuid=" + data.classes[0].properties.uuid + ">" + decodeEntities(data.classes[0].properties.name) + "</a>")
	    		
	    			}
	    			else{
	    				$("#src_aphorism_classes").append(", <a class='ANCHOR class' href='#class?uuid=" + node.properties.uuid + ">" + decodeEntities(node.properties.name) + "</a>")
	    			}
	    		})
    		}
    		console.log(data.dialectic);
    		$("#src_dialectic_select").empty();
    		switch(data.dialectic){
    			case "thesis" :
    				$("#src_dialectic_select").append("<option value='antithesis'>Antithesis</option>")
    				break;
    			case "antithesis":
    				$("#src_dialectic_select").append("<option value='synthesis'>Synthesis</option>")    				
    				break;
    			case "synthesis":
    				$("#src_dialectic_select").append("<option value='thesis'>Thesis</option>")
    				break;
    		}
    	})
    }

    function clearAphorism(){
    	worldSpirit.citations = [];
    	$(".dialectic_citations").empty();
    	$("#src_dialectic_title").val("");
    	$("#src_dialectic_text").val("");
    	$("#src_dialectic_sources").val("");
    	$("#src_cite_pages").val("");
    }

function initializeSourceSpirit(){
	worldSpirit.citations = []
	var svg = d3.select("#source_spirit");
	$("#source_spirit").height($(".ANCHOR_partial").height() - 84)
	width = $(".ANCHOR_partial").width();
	height = $(".ANCHOR_partial").height() - 84;
	d3.select("#source_spirit").selectAll("*").remove();
	$(".dialectic_citations").empty();

	var color = d3.scaleOrdinal(d3.schemeCategory10);
    

    console.log(worldSpirit.sourceUUID);

	$.get("/source_spirit/" + worldSpirit.sourceUUID, function(data){
		var gData = {
    		nodes : [],
    		links : []
    	}
    	var simulation = d3.forceSimulation()
	    .force("charge", d3.forceManyBody().strength(-10))
	    .force("center", d3.forceCenter(width / 2, height / 2))
	    .force('collide', d3.forceCollide(function(d){
	    	return 55
		}))

		$("#sourceSpiritForum").text("Forum");

		data.data.forEach(function(record){
			record._fields.forEach(function(field, i, arr){
				if(i === 2){
					return;
				}
				let checkNodes = gData.nodes.some(n => field && n.id === field.properties.uuid);
				if(!checkNodes && field){
					if(field.labels[0] === "Torrent"){
						console.log(field.properties);
						gData.nodes.push({id: field.properties.uuid, group: "Torrent", name : field.properties.editionText, infoHash: field.properties.infoHash, sourceUUID : field.properties.sourceUUID});

					}
					else if(field.labels[0] === "Source"){
						gData.nodes.push({id: field.properties.uuid, group:"Source", name : field.properties.title})
					}
					else if(field.labels[0] === "Class"){
						gData.nodes.push({id: field.properties.uuid, group: "Class", name: field.properties.name})

					}
					else if(field.labels[0] === "Aphorism"){
						gData.nodes.push({id: field.properties.uuid, group: "Aphorism",
						 name: field.properties.title, dialectic: field.properties.dialectic})
					}
					else if(field.labels[0] === "User"){
						gData.nodes.push({id: field.properties.uuid, group: "User", name: field.properties.user})

					}
				}
				var dialecticLinks = []
				
				//Target to Aphorism
				if(arr[1]){
					var checkLinks = gData.links.some(l => arr[1] && (l.source === arr[1].properties.uuid || l.target === arr[1].properties.uuid)
					 && (l.source === field.properties.uuid || l.target === field.properties.uuid))
					if(!checkLinks){
						gData.links.push({source: field.properties.uuid, name: "", target: arr[1].properties.uuid, value : 1})
						
						
					}

						

						
					}	
						
									
					
		
			})
		})
	console.log(gData.nodes)

    var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(gData.nodes)
    .enter().append("g");

    var circles = node.append("circle")
    .attr("r", 13)
      .attr("fill", function(d) { return color(d.group); });
    
    node.append("text")
    .style("fill", function(d){
    	if(d.dialectic === "thesis"){
    		return "green";
    	}
    	else if(d.dialectic === "antithesis"){
    		return "red";
    	}
    	else if(d.dialectic === "synthesis"){
    		return "orange";
    	}
    })
    .attr("class", function(d){
    	if(d.group !== "Aphorism" && d.group !== "Source"){
    		return "text_opaque"
    	}
    })
      .text(function(d) { 
      	return decodeEntities(d.name); }).attr("font-family", "Pirata One").attr("font-size", "18px");

    node.on("click", function(e){
    	onClick(e);
    })

	simulation
      .nodes(gData.nodes)
      .on("tick", ticked);

    function ticked() {
    	node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }).attr("data-uuid", function(d){ return d.id})
   	 
   	 	link
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
 	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });
	  
	  		 linkText
	        .attr("x", function(d) {
	            return ((d.source.x + d.target.x)/2);
	        })
	        .attr("y", function(d) {
	            return ((d.source.y + d.target.y)/2);
	        });
    }

	simulation.force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(function(d){
    		return 55;
		}))    

	var link = svg.append("g")
	.attr("class", "links")
	.selectAll(".links")
	.data(gData.links)
	.enter().append("line").attr("id",
	function(d) {
	return "path"+d.source.id+"_"+d.target.id;
	})


	simulation.force("link")
	.links(gData.links);

	linkLabelContainer = svg.selectAll(".linkLabel").data(gData.links);

	var linkText = linkLabelContainer.enter()
    .append("text")
    .attr("x", function(d) {
    	console.log(d.target.x)
        if (d.target.x > d.source.x) {
            return (d.source.x + (d.target.x - d.source.x)/2); }
        else {
            return (d.target.x + (d.source.x - d.target.x)/2); }
    })
    .attr("y", function(d) {
        if (d.target.y > d.source.y) {
            return (d.source.y + (d.target.y - d.source.y)/2); }
        else {
            return (d.target.y + (d.source.y - d.target.y)/2); }
    }).attr("text-anchor", "middle")
    .style("fill", function(d){
    	if(d.name === "THESIS"){
    		return "green";
    	}
    	else if(d.name === "ANTITHESIS"){
    		return "red";
    	}
    	else if(d.name === "SYNTHESIS"){
    		return "orange";
    	}
    })
    .style("font-size", function(d){
    	if(d.name === "THESIS" || d.name === "ANTITHESIS" || d.name === "SYNTHESIS"){
    		return "18px";
    	}
    	else{
    		return "14px";
    	}
    })
    .attr("dy", ".35em")
    .attr("class", "text_opaque")
    .text(function(d) { 
    	if(d.source.group === "Aphorism" && d.target.group === "Aphorism"){
    		return decodeEntities(d.name); 
    	}
    });


  	link.exit().remove();
	
    
	})

  if(ANCHOR.getParams().forum){
    	$("#src_fresh_aphorism").hide();
    	$("#src_overWorld").show();
    	$("#src_oldOverWorld").fadeIn(1337);
    	getAphorism(ANCHOR.getParams().forum)
    }
    function onClick(e){
		console.log(e)
		if(e.group === "Aphorism"){
			ANCHOR.removeParams("forum");
			ANCHOR.setParams("forum", e.id);
			$("#src_overWorld").show();
			getAphorism(e.id);
			$("#src_oldOverWorld").fadeIn(1337)
			$("#src_fresh_aphorism").fadeOut(666)	
		}
		else if(e.group === "User"){
			ANCHOR.route("#user?uuid=" + e.id);
		}
		else if(e.group === "Torrent"){
			ANCHOR.route("#source?uuid=" + e.sourceUUID);
		}
		else if(e.group === "Class"){
			ANCHOR.route("#class?uuid=" + e.id)
		}
		else if(e.group === "Source"){
			ANCHOR.route("#source?uuid=" + e.id)
		}

    }

    function getEditionText(record, title, date, pages){
    	var publisherHtml = "";
      	var editionField = "";
      	record._fields[1].forEach(function(field, i){
	      	editionField += field.properties.author
	      	if(record._fields[1][i+1]){
	      		editionField += ", "
	      	}
					else if(field.properties.author && !field.properties.author.endsWith(".")){
						editionField += ". "
					}
					else{
						editionField += " "
					}
	      })
	      editionField += date ? "(" + date + "). " : "";
	      
	     
	      editionField += title + ". "


	      if(record._fields[0].properties.publisher){
	      	if(record._fields[0].properties.publisher && record._fields[0].properties.publisher.endsWith(".")){
	        	publisherHtml += record._fields[0].properties.publisher ? record._fields[0].properties.publisher + " " : " "
	      	}
	      	else{
	        	publisherHtml += record._fields[0].properties.publisher ? record._fields[0].properties.publisher + ". " : " "
	      	}
	      }
	     
	      if(record._fields[0].properties.title && record._fields[0].properties.title !== ""){
	      	if(!record._fields[0].properties.title.endsWith(".")){
	      		editionField += record._fields[0].properties.title + ". "
	      	}
	      	else{
	      		editionField += record._fields[0].properties.title + " ";
	      	}
	      }
	      editionField += publisherHtml;
	      if(record._fields[0].properties.no){
	      	editionField += "(" + record._fields[0].properties.no + ")"
	      	if(record._fields[0].properties.pages){
	      		editionField += ", "
	      	}
	      }
	      //pages cited
	      if(pages){
	      	editionField += (pages !== "undefined" ? "(" + pages + ")." : "")
	      }
	      return editionField
	      
    }
    $("#src_cite").unbind("click");

    $("#src_cite").click(function(){
    	$(this).prop("disabled", true);
    	$.get("/dialectic_cite/" + $("#src_dialectic_sources").val()+"?pages=" + $("#src_cite_pages").val(), function(data){
     		$("#src_cite").prop('disabled', false);
     		var editionText = getEditionText(data.record, data.title, data.date, data.pages);
     		console.log(data.record);
    		$(".dialectic_citations").append("<li><a class='ANCHOR source' href='#source?&uuid=" + data.uuid + 
    		"'>" + editionText + "</a></li>")
    		worldSpirit.citations.push({infoHash : $("#src_dialectic_sources").val(), pages : data.pages, editionText : editionText, sourceUUID : data.uuid});
    	})
    })

    

    $("#src_fresh_aphorism").click(function(){
    	clearAphorism();
    	$("#src_oldOverWorld").hide();
    	$("#src_overWorld").show();
    	$("#src_newOverWorld").fadeIn();
    	$("#src_dialectic_select").empty();
    	$("#src_dialectic_select").append("<option value='thesis'>Thesis</option>")
    	clearAphorism()
    	ANCHOR.removeParams("forum");
    	$(this).fadeOut(777);
    })

    $("#src_close_overworld").click(function(){
    	$("#src_fresh_aphorism").fadeIn(777);
    	$("#src_oldOverWorld").show();
    	$("#src_newOverWorld").hide()
    	$("#src_overWorld").fadeOut(1337);
    	ANCHOR.removeParams("forum");
    })

    $("#src_new_aphorism").click(function(){
    	$("#src_fresh_aphorism").hide();
    	$("#src_overWorld").show();
    	$("#src_oldOverWorld").hide();
    	$("#src_newOverWorld").show()
    })


    //so server isn't called multiple times
    $("#src_dialectic_submit").unbind("click");

    $("#src_dialectic_submit").click(function(){
    	var split = $(".src_search_dialectic_classes_input").val().split(",");
    	if(split[0] === ''){
    		split = [];
    	}
    	$("#src_dialectic_submit").prop("disabled", true)
    	$.post("/src_new_aphorism", {classes: JSON.stringify(split), 
    		type : "", title: $("#src_dialectic_title").val(), text : $("#src_dialectic_text").val(), 
    		dialectic : $("#src_dialectic_select").val(), target : ANCHOR.getParams().uuid,
    		citations : JSON.stringify(worldSpirit.citations), sourceUUID : worldSpirit.sourceUUID},
    		function(data){
    			$("#src_dialectic_submit").prop("disabled", false);
    			$("#src_overWorld").hide();
    			$("#src_newOverWorld").fadeOut()
    			ANCHOR.removeParams("forum");
    			ANCHOR.setParams("forum", data.uuid)
				initializeSourceSpirit();    			
			
    		})

    })

}

function initializeWorldSpirit(){
	worldSpirit.citations = [];
	var svg = d3.select("svg"),
	width = $(".ANCHOR_partial").width(),
	height = $(".ANCHOR_partial").height() - 84;
	d3.select("#worldSpirit").selectAll("*").remove();

	$(".dialectic_citations").empty();

	var color = d3.scaleOrdinal(d3.schemeCategory10);
    $.get("/dialectic",  function(data){
    	var gData = {
    		nodes : [],
    		links : []
    	}

    	var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-10))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(function(d){
    	return 55
	}))
	console.log(data.data);
    data.data.forEach(function(record){
			record._fields.forEach(function(field, i, arr){
				let checkNodes = gData.nodes.some(n => field && n.id === field.properties.uuid);
				if(!checkNodes && field){
					if(field.labels[0] === "Torrent"){
						console.log(field.properties);
						gData.nodes.push({id: field.properties.uuid, group: "Torrent", name : field.properties.editionText, infoHash: field.properties.infoHash, sourceUUID : field.properties.sourceUUID});

					}
					else if(field.labels[0] === "Source"){
						gData.nodes.push({id: field.properties.uuid, group:"Source", name : field.properties.title})
					}
					else if(field.labels[0] === "Class"){
						gData.nodes.push({id: field.properties.uuid, group: "Class", name: field.properties.name})

					}
					else if(field.labels[0] === "Aphorism"){
						gData.nodes.push({id: field.properties.uuid, dialectic : field.properties.dialectic, group: "Aphorism", 
							name: field.properties.title})
					}
					else if(field.labels[0] === "User"){
						gData.nodes.push({id: field.properties.uuid, group: "User", name: field.properties.user})

					}
				}
						//Target to Aphorism
						if(arr[1]){
							var checkLinks = gData.links.some(l => arr[1] && (l.source === arr[1].properties.uuid || l.target === arr[1].properties.uuid)
							 && (l.source === field.properties.uuid || l.target === field.properties.uuid))
							if(!checkLinks){
								gData.links.push({source: field.properties.uuid, name: "", target: arr[1].properties.uuid, value : 1})
							}	
						}
			})
		})
    var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(gData.nodes)
    .enter().append("g");

    var circles = node.append("circle")
    .attr("r", 13)
      .attr("fill", function(d) { return color(d.group); });
    
    node.append("text")
     .style("fill", function(d){
    	if(d.dialectic === "thesis"){
    		return "green";
    	}
    	else if(d.dialectic === "antithesis"){
    		return "red";
    	}
    	else if(d.dialectic === "synthesis"){
    		return "orange";
    	}
    })
     .attr("class", function(d){
     	if(d.group !== "Aphorism" && d.group !== "Source"){
     		return "text_opaque"
     	}
     })
      .text(function(d) { return decodeEntities(d.name); }).attr("font-family", "Pirata One").attr("font-size", "18px");

    node.on("click", function(e){
    	onClick(e);
    })

	simulation
      .nodes(gData.nodes)
      .on("tick", ticked);

    function ticked() {
    	node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }).attr("data-uuid", function(d){ return d.id})
   	 
   	 	link
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
 	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });
	  
	  		 linkText
	        .attr("x", function(d) {
	            return ((d.source.x + d.target.x)/2);
	        })
	        .attr("y", function(d) {
	            return ((d.source.y + d.target.y)/2);
	        });
    }

	simulation.force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(function(d){
    		return 55;
		}))    

	var link = svg.append("g")
	.attr("class", "links")
	.selectAll(".links")
	.data(gData.links)
	.enter().append("line").attr("id",
	function(d) {
	return "path"+d.source.id+"_"+d.target.id;
	})


	simulation.force("link")
	.links(gData.links);

	linkLabelContainer = svg.selectAll(".linkLabel").data(gData.links);

	var linkText = linkLabelContainer.enter()
    .append("text")
    .attr("x", function(d) {
    	console.log(d.target.x)
        if (d.target.x > d.source.x) {
            return (d.source.x + (d.target.x - d.source.x)/2); }
        else {
            return (d.target.x + (d.source.x - d.target.x)/2); }
    })
    .attr("y", function(d) {
        if (d.target.y > d.source.y) {
            return (d.source.y + (d.target.y - d.source.y)/2); }
        else {
            return (d.target.y + (d.source.y - d.target.y)/2); }
    }).attr("text-anchor", "middle")
    .style("fill", function(d){
    	if(d.name === "THESIS"){
    		return "green";
    	}
    	else if(d.name === "ANTITHESIS"){
    		return "red";
    	}
    	else if(d.name === "SYNTHESIS"){
    		return "orange";
    	}
    })
    .style("font-size", function(d){
    	if(d.name === "THESIS" || d.name === "ANTITHESIS" || d.name === "SYNTHESIS"){
    		return "18px";
    	}
    	else{
    		return "14px";
    	}
    })
    .attr("dy", ".35em")
    .attr("class", "text_opaque")
    .text(function(d) { 
    	if(d.source.group === "Aphorism" && d.target.group === "Aphorism"){
    		return decodeEntities(d.name); 
    	}

    });


  	link.exit().remove();
	
    }
    )

    if(ANCHOR.getParams() && ANCHOR.getParams().uuid){
    	$("#fresh_aphorism").hide();
    	$("#overWorld").show();
    	$("#oldOverWorld").fadeIn(1337);
    	getAphorism(ANCHOR.getParams().uuid)
    }
    function onClick(e){
		console.log(e)
		if(e.group === "Aphorism"){
			ANCHOR.removeParams("uuid");
			ANCHOR.setParams("uuid", e.id);
			$("#overWorld").show();
			getAphorism(e.id);
			$("#oldOverWorld").fadeIn(1337)
			$("#fresh_aphorism").fadeOut(666)	
		}
		else if(e.group === "User"){
			ANCHOR.route("#user?&uuid=" + e.id);
		}
		else if(e.group === "Torrent"){
			ANCHOR.route("#source?uuid=" + e.sourceUUID);
		}
		else if(e.group === "Class"){
			ANCHOR.route("#class?uuid=" + e.id)
		}
		else if(e.group === "Source"){
			ANCHOR.route("#source?uuid=" + e.id)
		}

    }

    function getEditionText(record, title, date, pages){
    	var publisherHtml = "";
      	var editionField = "";
      	record._fields[1].forEach(function(field, i){
	      	editionField += field.properties.author
	      	if(record._fields[1][i+1]){
	      		editionField += ", "
	      	}
					else if(field.properties.author && !field.properties.author.endsWith(".")){
						editionField += ". "
					}
					else{
						editionField += " "
					}
	      })
	      editionField += date ? "(" + date + "). " : "";
	      
	     
	      editionField += title + ". "


	      if(record._fields[0].properties.publisher){
	      	if(record._fields[0].properties.publisher && record._fields[0].properties.publisher.endsWith(".")){
	        	publisherHtml += record._fields[0].properties.publisher ? record._fields[0].properties.publisher + " " : " "
	      	}
	      	else{
	        	publisherHtml += record._fields[0].properties.publisher ? record._fields[0].properties.publisher + ". " : " "
	      	}
	      }
	     
	      if(record._fields[0].properties.title && record._fields[0].properties.title !== ""){
	      	if(!record._fields[0].properties.title.endsWith(".")){
	      		editionField += record._fields[0].properties.title + ". "
	      	}
	      	else{
	      		editionField += record._fields[0].properties.title + " ";
	      	}
	      }
	      editionField += publisherHtml;
	      if(record._fields[0].properties.no){
	      	editionField += "(" + record._fields[0].properties.no + ")"
	      	if(record._fields[0].properties.pages){
	      		editionField += ", "
	      	}
	      }
	      //pages cited
	      if(pages){
	      	editionField += (pages !== "undefined" ? "(" + pages + ")." : "")
	      }
	      return editionField
	      
    }
    $("#cite").unbind("click");

    $("#cite").click(function(){
    	$(this).prop("disabled", true);
    	$.get("/dialectic_cite/" + $("#dialectic_sources").val()+"?pages=" + $("#cite_pages").val(), function(data){
     		$("#cite").prop('disabled', false);
     		var editionText = getEditionText(data.record, data.title, data.date, data.pages);
     		console.log(data.record);
    		$(".dialectic_citations").append("<li><a class='ANCHOR source' href='#source?uuid=" + data.uuid + 
    		"'>" + editionText + "</a></li>")
    		worldSpirit.citations.push({infoHash : $("#dialectic_sources").val(), pages : data.pages, editionText : editionText, sourceUUID : data.uuid});
    	})
    })

    function getAphorism(id){
    	clearAphorism();
    	$.get("/aphorism/" + id, function(data){
    		console.log(data);
    		$("#aphorism_title").text(decodeEntities(data.title));
    		$("#aphorism_text").text(decodeEntities(data.text));
    		$("#aphorism_classes").text("");
    		if(data.classes && data.classes.length > 0){
	    		data.classes.forEach(function(node, i){
	    			if(i===0){
	    				$("#aphorism_classes").append("<a class='ANCHOR class' href='#class?uuid=" + data.classes[0].properties.uuid + ">" + decodeEntities(data.classes[0].properties.name) + "</a>")
	    		
	    			}
	    			else{
	    				$("#aphorism_classes").append(", <a class='ANCHOR class' href='#class?uuid=" + node.properties.uuid + ">" + decodeEntities(node.properties.name) + "</a>")
	    			}
	    		})
    		}
    		console.log(data.dialectic);
    		$("#dialectic_select").empty();
    		switch(data.dialectic){
    			case "thesis" :
    				$("#dialectic_select").append("<option value='antithesis'>Antithesis</option>")
    				break;
    			case "antithesis":
    				$("#dialectic_select").append("<option value='synthesis'>Synthesis</option>")    				
    				break;
    			case "synthesis":
    				$("#dialectic_select").append("<option value='thesis'>Thesis</option>")
    				break;
    		}
    	})
    }

    function clearAphorism(){
    	worldSpirit.citations = [];
    	$(".dialectic_citations").empty();
    	$("#dialectic_title").val("");
    	$("#dialectic_text").val("");
    	$("#dialectic_sources").val("");
    	$("#cite_pages").val("");
    }

    $("#fresh_aphorism").click(function(){
    	clearAphorism();
    	$("#oldOverWorld").hide();
    	$("#overWorld").show();
    	$("#newOverWorld").fadeIn();
    	$("#dialectic_select").empty();
    	$("#dialectic_select").append("<option value='thesis'>Thesis</option>")
    	clearAphorism()
    	ANCHOR.removeParams("uuid");
    	if(ANCHOR.page()=== "source"){
    		ANCHOR.setParams("uuid", sourceUUID)
    	}
    	$(this).fadeOut(777);
    })

    $("#close_overworld").click(function(){
    	$("#fresh_aphorism").fadeIn(777);
    	$("#oldOverWorld").show();
    	$("#newOverWorld").hide()
    	$("#overWorld").fadeOut(1337);
    	ANCHOR.removeParams("uuid");
    	if(ANCHOR.page()==="source"){
    		ANCHOR.setParams("uuid", sourceUUID)
    	}
    })

    $("#new_aphorism").click(function(){
    	$("#fresh_aphorism").hide();
    	$("#overWorld").show();
    	$("#oldOverWorld").hide();
    	$("#newOverWorld").show()
    })


    //so server isn't called multiple times
    $("#dialectic_submit").unbind("click");

    $("#dialectic_submit").click(function(){
    	var split = $(".search_dialectic_classes_input").val().split(",");
    	if(split[0] === ''){
    		split = [];
    	}
    	$("#dialectic_submit").prop("disabled", true)
    	$.post("/new_aphorism", {classes: JSON.stringify(split), 
    		type : "", title: $("#dialectic_title").val(), text : $("#dialectic_text").val(), 
    		dialectic : $("#dialectic_select").val(), target : ANCHOR.getParams().uuid ? ANCHOR.getParams().uuid : "",
    		citations : JSON.stringify(worldSpirit.citations)},
    		function(data){
    			$("#dialectic_submit").prop("disabled", false);
    			$("#overWorld").hide();
    			$("#newOverWorld").fadeOut()
    			ANCHOR.setParams("uuid", data.uuid)
				initializeWorldSpirit();    			
			
    		})

    })
	
 }