
var gData = {
			nodes : [
			],
			links : [
			]
		}



function graph(data, cb){
  nodeUUIDs = [];

  var publishers = [];
		data.data.forEach(function(record){
			record._fields.forEach(function(field, i, arr){
				let checkNodes = gData.nodes.some(n => field && n.id === field.properties.uuid);
				if(checkNodes && field.labels[0] !== "Edition"){
					var foundIndex = gData.nodes.findIndex(x => x.id == field.properties.uuid);
					gData.nodes[foundIndex].count++;
				}
				else if(checkNodes){
					var foundIndex = gData.nodes.findIndex(x => x.id == field.properties[publisher]);
					gData.nodes[foundIndex].count++;
				}
				/*if(checkNodes && field.labels[0] === "Edition"){
						let checkNodes = gData.nodes.some(n => field && n.id === field.properties.publisher);
						if(checkNodes){
							var foundIndex = gData.nodes.findIndex(x => x.id == field.properties.publisher);
							gData.nodes[foundIndex].snatches += field.properties.snatches;
						}
				}*/
				else if(!checkNodes && field){
					
					if(field.labels[0] === "Source"){
						nodeUUIDs.push(field.properties.uuid);
						if(ANCHOR.getParams() && field.properties.uuid === ANCHOR.getParams().uuid){
							gData.nodes.push({id: field.properties.uuid, group: "Find!", name :decodeEntities(decodeEntities(field.properties.title)), count : 1, color: "mediumvioletred"});
						}
						else{
							gData.nodes.push({id: field.properties.uuid, group: "Source", name :decodeEntities(decodeEntities(field.properties.title)), count : 1, color:"#fae1ec"});

						}

					}
					else if(field.labels[0] === "Author"){
						if(ANCHOR.getParams() && field.properties.uuid === ANCHOR.getParams().uuid){
							gData.nodes.push({id: field.properties.uuid, group: "Find!", name : decodeEntities(decodeEntities(field.properties.author)), count :1, color:"mediumvioletred"})
						}
						else{
							gData.nodes.push({id: field.properties.uuid, group: "Author", name : decodeEntities(decodeEntities(field.properties.author)), count :1, color:"steelblue"})

						}

					}
					else if(field.labels[0] === "Class"){
						if(ANCHOR.getParams() && field.properties.uuid === ANCHOR.getParams().uuid){
							gData.nodes.push({id: field.properties.uuid, group: "Find!", name: decodeEntities(decodeEntities(field.properties.name)), count : 1, color:"mediumvioletred"})
						}
						else{
							gData.nodes.push({id: field.properties.uuid, group: "Class", name :decodeEntities(decodeEntities(field.properties.name)), count :1, color: "#83DAC0"});

						}
					}
					else if(field.labels[0] === "Edition"){

						var publisher = gData.nodes.find(obj => {
						  return obj.id === field.properties.publisher;
						})

						if(ANCHOR.getParams() && !publisher && decodeURIComponent(decodeURIComponent(ANCHOR.getParams().publisher)) === field.properties.publisher){
							gData.nodes.push({id: field.properties.publisher, group: "Find!", name :decodeEntities(decodeEntities(field.properties.publisher)), count: 1, color:"mediumvioletred"})
						}		
						else if(!publisher){
							gData.nodes.push({id: field.properties.publisher, group: "Publisher", name :decodeEntities(decodeEntities(field.properties.publisher)), count: 1, color:"seagreen"})

						}
						

					}
				}
				
				
				switch(i){
					case 0:
						//Source to Author
						if(field && arr[2]){
							var checkLinks = gData.links.some(l => arr[2] && l.source === arr[2].properties.uuid && l.target === field.properties.uuid)
							if(!checkLinks){
								gData.links.push({source: arr[2].properties.uuid, target: field.properties.uuid, value : 1})
							}	
						}
						//source to PUBLISHER
						if(field && arr[3]){
							var checkLinks = gData.links.some(l => arr[3] && l.source === field.properties.uuid && l.target === arr[3].properties.publisher)
							if(!checkLinks){
								gData.links.push({source: field.properties.uuid, target: arr[3].properties.publisher, value : 1})
							}
						}

						//source to Class
						if(field && arr[5]){
							var checkLinks = gData.links.some(l => arr[5] && l.source === field.properties.uuid && l.target === arr[5].properties.uuid)
							if(!checkLinks){
								gData.links.push({source: field.properties.uuid, target: arr[5].properties.uuid, value : 1})
							}
						}

						
						/*let checkLinks2 = gData.links.some(l => l.source === field.properties.uuid && l.target === arr[3].properties.uuid);
						if(!checkLinks2){
							gData.links.push({source: field.properties.uuid, target: arr[3].properties.uuid})
						}*/
						cb()
						break;
						//Original Class to Source
					case 1: 
						
							if(field && arr[0]){
								var checkLinks = gData.links.some(l => arr[0] && l.source === field.properties.uuid && l.target === arr[0].properties.uuid)
								if(!checkLinks){
									gData.links.push({source: field.properties.uuid, target: arr[0].properties.uuid, value : 1})
								}
							}
							
						cb()
						break;
						
					/*case 2:
						//AUTHOR TO SOURCE
						if(field && arr[0]){
							var checkLinks = gData.links.some(l => arr[0] && l.source === field.properties.uuid && l.target === arr[0].properties.uuid )
							if(!checkLinks){
								gData.links.push({source: field.properties.uuid, target: arr[0].properties.uuid, value : 1})
							}
						}
						cb()
						break;*/
					case 4:
						if(field){
							switch(field.labels[0]){
							case "Source":
								if(arr[1]){
									//CLASS TO SOURCE
									var checkLinks = gData.links.some(l => arr[1] && l.source === field.properties.uuid && l.target === arr[1].properties.uuid)
									if(!checkLinks){
										gData.links.push({source: field.properties.uuid, target: arr[1].properties.uuid, value : 1})
									}

								}
								else if(arr[2]){
									//AUTHOR TO SOURCE
									var checkLinks = gData.links.some(l => arr[2] && l.source === field.properties.uuid && l.target === arr[2].properties.uuid)
									if(!checkLinks){
										gData.links.push({source: field.properties.uuid, target: arr[2].properties.uuid, value : 1})
									}

									
								}
								else if(arr[3]){
									//SOURCE TO EDITION
									var checkLinks = gData.links.some(l => arr[3] && l.source === field.properties.uuid && l.target === arr[3].properties.publisher)
									if(!checkLinks){
										gData.links.push({source: field.properties.uuid, target: arr[3].properties.publisher, value : 1})
									}
								}

								break;
							case "Author":
								if(arr[0]){
									//AUTHOR TO SOURCE
									var checkLinks = gData.links.some(l => arr[0] && l.source === field.properties.uuid && l.target === arr[0].properties.uuid)
									if(!checkLinks){
										gData.links.push({source: field.properties.uuid, target: arr[0].properties.uuid, value : 1})
									}

									
								}
								break;
							case "Class":
								if(arr[0]){
									//AUTHOR TO SOURCE
									var checkLinks = gData.links.some(l => arr[0] && l.source === field.properties.uuid && l.target === arr[0].properties.uuid)
									if(!checkLinks){
										gData.links.push({source: field.properties.uuid, target: arr[0].properties.uuid, value : 1})
									}

									
								}
								break;
							case "Edition":
								if(arr[0]){
									var checkLinks = gData.links.some(l => arr[0] && l.source === field.properties.publisher && l.target === arr[0].properties.uuid)
									if(!checkLinks){
										gData.links.push({source: field.properties.publisher, target: arr[0].properties.uuid, value : 1})
									}
								}
								break;
						
						}
					}
						
						//Sources to matching Author
					//Source to Edition
					
						//source to PUBLISHER
									
				}
			})
		})
  
   /*data.data.forEach(function(record){
      record._fields.forEach(function(field, i){
        if(field && i === 1){
          function findObjectByProperty(arr, property, value) {
            return arr.find(obj => obj[property] === value);
          }
          var finder = findObjectByProperty(gData.nodes, "group", "Find!")
          if(field && finder && finder.group === "Find!"){
            var checkLinks = gData.links.some(l => finder && l.source === field.properties.uuid && l.target === finder.id)
            if(!checkLinks){
              gData.links.push({source: field.properties.uuid, target: finder.id, value : 1})
            }
          }
        }
        
      })
    })*/
  
		
		if(ANCHOR.page() === "author"){
			graphRender("author_g")
		}
		else if(ANCHOR.page() === "class"){
			graphRender("class_g")
		}
		else if(ANCHOR.page() === "source"){
			graphRender("source_g")
		}
		else if(ANCHOR.page() === "publisher"){
			graphRender("publisher_g")
		}

}
/*
function pageGraph(){
	  var clicked = false;
	  const GraphPage = ForceGraphVR()
	      (document.getElementById('graph'))
	        .nodeAutoColorBy('group')
	        //.linkAutoColorBy(d => gData.nodes[d.source].group)
	        .linkOpacity(0.07)
	        .nodeLabel(node => `${node.name}`).cooldownTime(12000)//.d3AlphaDecay(.00003).d3VelocityDecay(.00001)
	              	
	        .onNodeClick(function(node){
	        	setTimeout(function(){
	        		clicked= false;
	        	},2000)
	        	console.log(node);
	        	if(clicked === node.id){
	        		switch(node.group){
		        		case "Source":
		        			ANCHOR.route("#source?uuid="+node.id)
		        			break;
		        		case "Author":
		        			ANCHOR.route("#author?&uuid="+node.id)
		        			break;
		        		case "Class":
		        			ANCHOR.route("#class?uuid="+node.id)
		        			break;
		        	}
		        	document.exitFullScreen();
	        	}
	        	else{
	        		switch(node.group){
	        		case "Source":
	        			if($("#graph_title").val()){
	        			$("#graph_title").val($("#graph_title").val() + ", " + node.name); 
		        		}
		        		else{
		        			$("#graph_title").val(node.name)
		        		}
	        			break;
	        		case "Author":
	        			if($("#graph_author").val()){
	        			$("#graph_author").val($("#graph_author").val() + ", " + node.name); 
		        		}
		        		else{
		        			$("#graph_author").val(node.name)
		        		}
	        			break;
	        		case "Class":
	        			if($("#graph_classes").val()){
	        			$("#graph_classes").val($("#graph_classes").val() + ", " + node.name); 
		        		}
		        		else{
		        			$("#graph_classes").val(node.name)
		        		}
	        			break;
	        		}
	        		
	        	}
	        	clicked = node.id;
	/*        	clicked = true;
	        	var timeout = setTimeout(function()
				{		
	        		clicked = false;
	        	}, 2000)
	        	
	        })

	        .height(window.innerHeight <= 1079 ? window.innerHeight - 55 : window.innerHeight - 237).graphData(gData);	
}*/

/*
function graphRender(selector){
	const Graph = new ForceGraphVR(document.getElementById(selector))
        	
          .nodeThreeObject(
             function (node) {
              

               // Create text node
               const nodeSpriteText = new SpriteText(node.name);
               nodeSpriteText.fontSize = 14;
               nodeSpriteText.color = node.color;
               //nodeSpriteText.opacity = 0.75;
               nodeSpriteText.textHeight = 4;
               nodeSpriteText.position.y = -14;// Move to the bottom

               
               
               return nodeSpriteText;
             }
          )
          .nodeLabel(node=>{
            return node.name
          })
          .onNodeClick(function(node){
	        	console.log(node);
	        		switch(node.group){
		        		case "Source":
		        			ANCHOR.route("#source?uuid="+node.id)
		        			break;
		        		case "Author":
		        			ANCHOR.route("#author?uuid="+node.id)
		        			break;
		        		case "Class":
		        			ANCHOR.route("#class?uuid="+node.id)
		        			break;
		        		case "Publisher":
		        			ANCHOR.route("#publisher?publisher="+encodeURIComponent(node.id))

		        			break;
		        	}
		        }).graphData(gData)//cooldownTime(8000).d3AlphaDecay(.00006).d3VelocityDecay(.0008);
}
function graphRender(selector){
	const Graph = new ForceGraphVR(document.getElementById(selector)).graphData(gData)
        	.linkColor("palevioletred")
        	.linkDirectionalParticles(true)
        	.onNodeClick(function(node){
	        	console.log(node);
	        		switch(node.group){
		        		case "Source":
		        			ANCHOR.route("#source?uuid="+node.id)
		        			break;
		        		case "Author":
		        			ANCHOR.route("#author?uuid="+node.id)
		        			break;
		        		case "Class":
		        			ANCHOR.route("#class?uuid="+node.id)
		        			break;
		        		case "Publisher":
		        			ANCHOR.route("#publisher?publisher="+encodeURIComponent(node.id))

		        			break;
		        	}
		        }).height($(window).height() - 116);
}*/
function graphRender(selector){
	const Graph = new ForceGraphVR(document.getElementById(selector)).graphData(gData)
        	.nodeVal(node=>{
        		if(node.group === "Find!"){
        			return 128;
        		}
        	})
          .nodeThreeObject(
                     function (node) {


                       // Create text node
                       const nodeSpriteText = new SpriteText(node.name);
                       nodeSpriteText.fontSize = 18;
                       nodeSpriteText.color = node.color;
                       //nodeSpriteText.opacity = 0.75;
                       nodeSpriteText.textHeight = 7;
                       //nodeSpriteText.position.y = -14;// Move to the bottom


                       return nodeSpriteText;
                     }
                  )
          .linkOpacity(.1)
          .onNodeClick(function(node){
	        		switch(node.group){
		        		case "Source":
		        			ANCHOR.route("#source?uuid="+node.id)
		        			break;
		        		case "Author":
		        			ANCHOR.route("#author?uuid="+node.id)
		        			break;
		        		case "Class":
		        			ANCHOR.route("#class?uuid="+node.id)
		        			break;
		        		case "Publisher":
		        			ANCHOR.route("#publisher?publisher="+encodeURIComponent(node.id))

		        			break;
		        	}
		        }).height(350).width($(window).width() - 55);
}

/*
function sourceGraph(){

	var svg = d3.select("svg"),
	    width = window.innerWidth,
	    height = +svg.attr("height");

	console.log(width);

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody())
	    .force("center", d3.forceCenter(width / 2, height / 2));

	//svg.data(gData, function(error, graph) {
	  //if (error) throw error;

	  var link = svg.append("g")
	      .attr("class", "links")
	    .selectAll("line")
	    .data(gData.links)
	    .enter().append("line")
	      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

	  var node = svg.append("g")
	      .attr("class", "nodes")
	    .selectAll("g")
	    .data(gData.nodes)
	    .enter().append("g")

	  var circles = node.append("circle")
	    .attr("r", 5)
	    .attr("fill", function(d) { return color(d.group); });

	  // Create a drag handler and append it to the node object instead
	  var drag_handler = d3.drag()
	      .on("start", dragstarted)
	      .on("drag", dragged)
	      .on("end", dragended);

	  drag_handler(node);
	  
	  var lables = node.append("text")
	      .text(function(d) {
	        return d.name;
	      })
	      .attr('x', 6)
	      .attr('y', 3);

	  node.append("title")
	      .text(function(d) { return d.id; });

	  simulation
	      .nodes(gData.nodes)
	      .on("tick", ticked);

	  simulation.force("link")
	      .links(gData.links);

	  function ticked() {
	    link
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node
	        .attr("transform", function(d) {
	          return "translate(" + d.x + "," + d.y + ")";
	        })
	  }
	//});

	function dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}

	function dragged(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	function dragended(d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}
}
*/

function initializeGraph(cb){
  
	gData = {
			nodes : [
			],
			links : [
			]
		}


	var windowsize = $(window).width();
    if (windowsize < 1080) {
    	$(".graph_search").hide();
    	$(".graph_mobile").show();
    	$("#graph_plus").show();
    }
    else{
    	$(".graph_search").show();
    	$(".graph_mobile").hide();
    	$(".graph_toggle").hide();
    }

 
    $("#graph_plus").click(function(e){
    	e.preventDefault()
    	$("#graph_minus").fadeIn();
    	$(".graph_mobile").fadeOut();
    	$(".graph_search").fadeIn();
    	$(this).fadeOut();
    })
  
    $("#graph_heading").click(function(e){
      e.preventDefault();
    })

    $("#graph_minus").click(function(e){
    	e.preventDefault();
    	$("#graph_plus").fadeIn();
    	 $(".graph_mobile").fadeIn();
    	$(".graph_search").fadeOut();
    	$(this).fadeOut();
    })
	$("#graph_class_all").prop("checked",true)
	$("#graph_class_any").prop("checked", false)
  if(ANCHOR.getParams()){
    $("#graph_title").val(ANCHOR.getParams() && ANCHOR.getParams().title ? ANCHOR.getParams().title : "")
    $("#graph_author").val(ANCHOR.getParams() && ANCHOR.getParams().author ? ANCHOR.getParams().author : "")
    $("#graph_classes").val(ANCHOR.getParams() && ANCHOR.getParams().classes ? (decodeEntities(ANCHOR.getParams().classes) === "undefined" ? "" : decodeEntities(ANCHOR.getParams().classes).replace(/['"]+/g, '')) : "")
    $("#graph_publisher").val(ANCHOR.getParams() && ANCHOR.getParams().publisher ? decodeEntities(decodeEntities(ANCHOR.getParams().publisher)) : "");
    $("#graph_type").val(ANCHOR.getParams() && ANCHOR.getParams().type ? ANCHOR.getParams().type : "");
    $("#graph_media").val(ANCHOR.getParams() && ANCHOR.getParams().media ? ANCHOR.getParams().media : "");
    $("#graph_format").val(ANCHOR.getParams() && ANCHOR.getParams().format ? ANCHOR.getParams().format : "")
  }
	//console.log(decodeEntities(ANCHOR.getParams().publisher))
	if(ANCHOR.getParams() && ANCHOR.getParams().class_all === "true"){
		$("#graph_class_all").prop("checked", true)
		$("#graph_class_any").prop("checked", false)
	}
	else{
		$("#graph_class_all").prop("checked", false)
		$("#graph_class_any").prop("checked", true)
	}
	

	$.get("/advanced_search_ui", function(data){
		$("#graph_type").empty();
		$("#graph_type").append("<option value='all'>All Types</option>")
		$("#graph_media").empty();
		$("#graph_media").append("<option value='all'>All Media</option>")
		$("#graph_format").empty();
		$("#graph_format").append("<option value='all'>All Formats</option>")
		
		data.buoy.types.forEach(function(val){
			var option = document.createElement("option");
			$(option).val(val);
			$(option).text(decodeEntities(val));
			$("#graph_type").append(option);
			if(ANCHOR.getParams() && ANCHOR.getParams().type){
				$("#graph_type").val(ANCHOR.getParams() ? ANCHOR.getParams().type : "");
			}
		})
		data.buoy.media.forEach(function(val){
			var option = document.createElement("option");
			$(option).val(val);
			$(option).text(decodeEntities(val));
			$("#graph_media").append(option);
			if(ANCHOR.getParams() && ANCHOR.getParams().media){

				$("#graph_media").val(ANCHOR.getParams() ? ANCHOR.getParams().media : "")

			}
		})
		data.buoy.formats.forEach(function(val){
			var option = document.createElement("option");
			$(option).val(val);
			$(option).text(decodeEntities(val));
			$("#graph_format").append(option);
			if(ANCHOR.getParams() && ANCHOR.getParams().format){
				$("#graph_format").val(ANCHOR.getParams() ? ANCHOR.getParams().format : "")

			}
		})
	})
	$("#graph_submit").unbind('click')
	$("#graph_submit").click(function(){
    
		ANCHOR.route("#graph?search=true&title=" + $("#graph_title").val() + "&author=" + $("#graph_author").val() +
			"&classes=" + ($("#graph_classes").val() ? JSON.stringify($("#graph_classes").val()) : "") + "&class_all=" + $("#graph_class_all").prop("checked") + "&publisher=" + encodeURIComponent($("#graph_publisher").val()) + "&type=" + $("#graph_type").val() +
			"&media=" + $("#graph_media").val() + "&format=" + $("#graph_format").val())
    var url = window.location.hash.split("?")[1];
    document.cookie="search=" + url;
	})


	/*switch(ANCHOR.page()){
		case "source":
			$.get("source_graph/" + ANCHOR.getParams().uuid, function(data){
				graph(data, cb);	      		
			})
			break;
		case "graph":*/
 
  //window.history.pushState('#graph?', '', getCookie("search"));
	if(ANCHOR.getParams() && ANCHOR.getParams().search){
		$.post("/graph_search",  {title : ANCHOR.getParams() ? ANCHOR.getParams().title : "",
		author : ANCHOR.getParams() ? ANCHOR.getParams().author : "",
		classes : ANCHOR.getParams() ? ANCHOR.getParams().classes : "",
		class_all : ANCHOR.getParams() ? ANCHOR.getParams().class_all : "",
		publisher : ANCHOR.getParams() ? ANCHOR.getParams().publisher : "",
		type : ANCHOR.getParams() ? ANCHOR.getParams().type : "",
		media : ANCHOR.getParams() ? ANCHOR.getParams().media : "",
		format : ANCHOR.getParams() ? ANCHOR.getParams().format : ""}, function(data){
			graph(data,cb)
		})
	}
	else if(ANCHOR.page() === "graph"){
    
		$.get("/page_graph",function(data){
     
    

			graph(data, cb);
		})
	}
	else if(ANCHOR.page() === "author"){
		$.get("/author_graph/" + ANCHOR.getParams().uuid, function(data){
			graph(data,cb)
		})
	}
	else if(ANCHOR.page() === "source"){
		$.get("/source_graph/" + ANCHOR.getParams().uuid, function(data){
			graph(data,cb)
		})
	}
	else if(ANCHOR.page() === "class"){
		$.get("/class_graph/" + ANCHOR.getParams().uuid, function(data){
			graph(data,cb)
		})
	}
	else if(ANCHOR.page() === "publisher"){
		$.get("/publisher_graph/" + encodeURIComponent(ANCHOR.getParams().publisher), function(data){

			graph(data, cb)
		})
	}

	//		break;
	//}

}

