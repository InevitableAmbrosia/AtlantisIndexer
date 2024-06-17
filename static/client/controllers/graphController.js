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
						gData.nodes.push({id: field.properties.uuid, group: "Source", name : field.properties.title});
					}
					else if(field.labels[0] === "Author"){
						gData.nodes.push({id: field.properties.uuid, group: "Author", name : toTitleCase(field.properties.author)})

					}
					else if(field.labels[0] === "Class"){
						gData.nodes.push({id: field.properties.uuid, group: "Class", name: field.properties.name})
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
	        .nodeLabel(node => `${node.name}`)
	        /*.nodeThreeObject(node => {
          		const sprite = new SpriteText(node.name);
          		sprite.color = node.color;
          		sprite.textHeight = 8;
          		return sprite;
        	})*/
        	
	        .onNodeClick(function(node){
	        	console.log(node);
	        	//if(clicked){
	        		switch(node.group){
		        		case "Source":
		        			ANCHOR.route("#source?buoy="+ ANCHOR.getParams().buoy + "&uuid="+node.id)
		        			break;
		        		case "Author":
		        			ANCHOR.route("#author?buoy="+ ANCHOR.getParams().buoy + "&uuid="+node.id)
		        			break;
		        		case "Class":
		        			ANCHOR.route("#class?buoy="+ ANCHOR.getParams().buoy + "&uuid="+node.id)
		        			break;
		        	}
		        	document.exitFullScreen();
	        	//}
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
		        			ANCHOR.route("#source?buoy="+ ANCHOR.getParams().buoy + "&uuid="+node.id)
		        			break;
		        		case "Author":
		        			ANCHOR.route("#author?buoy="+ ANCHOR.getParams().buoy + "&uuid="+node.id)
		        			break;
		        		case "Class":
		        			ANCHOR.route("#class?buoy="+ ANCHOR.getParams().buoy + "&uuid="+node.id)
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
	switch(ANCHOR.page()){
		case "source":
			$.get("source_graph/" + ANCHOR.getParams().uuid, function(data){
				graph(data, cb);	      		
			})
			break;
		case "graph":
			$.get("page_graph/?buoy=" + ANCHOR.getParams().buoy, function(data){
				graph(data, cb);
			})
			break;
	}

}