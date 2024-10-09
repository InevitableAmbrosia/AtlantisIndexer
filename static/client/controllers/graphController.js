var gData = {
			nodes : [
			],
			links : [
			]
		}

function graph(data, cb){
	console.log(data.data)		

		data.data.forEach(function(record){
			record._fields.forEach(function(field, i, arr){
				let checkNodes = gData.nodes.some(n => field && n.id === field.properties.uuid);
				if(!checkNodes && field){
					if(field.labels[0] === "Source"){
						gData.nodes.push({id: field.properties.uuid, group: "Source", name :decodeEntities(decodeEntities(field.properties.title))});
					}
					else if(field.labels[0] === "Author"){
						gData.nodes.push({id: field.properties.uuid, group: "Author", name : decodeEntities(decodeEntities(field.properties.author))})

					}
					else if(field.labels[0] === "Class"){
						gData.nodes.push({id: field.properties.uuid, group: "Class", name: decodeEntities(decodeEntities(field.properties.name))})
					}
				}
				switch(i){
					case 0:
						//Source to Class
						if(field && arr[1]){
							var checkLinks = gData.links.some(l => arr[1] && l.source === arr[1].properties.uuid && l.target === field.properties.uuid)
							if(!checkLinks){
								gData.links.push({source: arr[1].properties.uuid, target: field.properties.uuid, value : 1})
							}	
						}
						
						/*let checkLinks2 = gData.links.some(l => l.source === field.properties.uuid && l.target === arr[3].properties.uuid);
						if(!checkLinks2){
							gData.links.push({source: field.properties.uuid, target: arr[3].properties.uuid})
						}*/
						cb()
						break;
						//Sources to matching Class
					case 1: 
						if(field && arr[2]){
							var checkLinks = gData.links.some(l => arr[2] && l.source === field.properties.uuid && l.target === arr[2].properties.uuid)
							if(!checkLinks){
								gData.links.push({source: field.properties.uuid, target: arr[2].properties.uuid, value : 1})
							}
						}
						cb()
						break;
						//Source to Author
					case 3:
						if(field && arr[0]){
							var checkLinks = gData.links.some(l => arr[0] && l.source === field.properties.uuid && l.target === arr[0].properties.uuid )
							if(!checkLinks){
								gData.links.push({source: field.properties.uuid, target: arr[0].properties.uuid, value : 1})
							}
						}
						cb()
						break;
						//Sources to matching Author
					case 4:
						if(field && arr[3]){
							var checkLinks = gData.links.some(l => arr[3] && l.source === arr[3].properties.uuid && l.target === field.properties.uuid)
							if(!checkLinks){
								gData.links.push({source:arr[3].properties.uuid, target: field.properties.uuid, value : 1})
							}
								
						}	
						cb()
						break;					
				}
			})
		})
		
		if(ANCHOR.page() === "source"){
			//sourceGraph();	
		}
		else{
			pageGraph();
		}

}

function pageGraph(){
	  var clicked = false;

	  const GraphPage = ForceGraphVR()
	      (document.getElementById('graph'))
	        .nodeAutoColorBy('group')
	        //.linkAutoColorBy(d => gData.nodes[d.source].group)
	        .linkOpacity(0.07)
	        .nodeLabel(node => `${node.name}`).cooldownTime(5000).d3AlphaDecay(.005).d3VelocityDecay(.005)
	        /*.nodeThreeObject(node => {
          		const sprite = new SpriteText(node.name);
          		sprite.color = node.color;
          		sprite.textHeight = 8;
          		return sprite;
        	})*/
        	
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
	        	}, 2000)*/
	        	
	        })

	        .height(window.innerHeight <= 1079 ? window.innerHeight - 55 : window.innerHeight - 237).graphData(gData);	
}

$(".ANCHOR_partial").click(function(){
	console.log("CLICKED")
})

function sourceGraph(){
	const Graph = ForceGraphVR()
	      (document.getElementById('3d-graph'))
	        .nodeAutoColorBy('group')
	        //.linkAutoColorBy(d => gData.nodes[d.source].group)
	        .linkOpacity(0.5)
	        .nodeLabel(node => `${node.name}`)
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
		        	}
		        	document.exitFullScreen();
	        	
	        	
	        })
	        .graphData(gData);
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

    $("#graph_minus").click(function(e){
    	e.preventDefault();
    	$("#graph_plus").fadeIn();
    	 $(".graph_mobile").fadeIn();
    	$(".graph_search").fadeOut();
    	$(this).fadeOut();
    })
	$("#graph_class_all").prop("checked",true)
	$("#graph_class_any").prop("checked", false)
	$("#graph_title").val(ANCHOR.getParams() && ANCHOR.getParams().title ? ANCHOR.getParams().title : "")
	$("#graph_author").val(ANCHOR.getParams() && ANCHOR.getParams().author ? ANCHOR.getParams().author : "")
	$("#graph_classes").val(ANCHOR.getParams() && ANCHOR.getParams().classes ? (decodeEntities(ANCHOR.getParams().classes) === "undefined" ? "" : decodeEntities(ANCHOR.getParams().classes).replace(/['"]+/g, '')) : "")
	$("#graph_publisher").val(ANCHOR.getParams() && ANCHOR.getParams().publisher ? ANCHOR.getParams().publisher : "");
	$("#graph_type").val(ANCHOR.getParams() && ANCHOR.getParams().type ? ANCHOR.getParams().type : "");
	$("#graph_media").val(ANCHOR.getParams() && ANCHOR.getParams().media ? ANCHOR.getParams().media : "");
	$("#graph_format").val(ANCHOR.getParams() && ANCHOR.getParams().format ? ANCHOR.getParams().format : "")
	
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
			"&classes=" + ($("#graph_classes").val() ? JSON.stringify($("#graph_classes").val()) : "") + "&class_all=" + $("#graph_class_all").prop("checked") + "&publisher=" + $("#graph_publisher").val() + "&type=" + $("#graph_type").val() +
			"&media=" + $("#graph_media").val() + "&format=" + $("#graph_format").val())

	})


	/*switch(ANCHOR.page()){
		case "source":
			$.get("source_graph/" + ANCHOR.getParams().uuid, function(data){
				graph(data, cb);	      		
			})
			break;
		case "graph":*/
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
	else{
		$.get("/page_graph",function(data){
			graph(data, cb);
		})
	}
	//		break;
	//}

}