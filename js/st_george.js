export default {
	recommendSource : function(driver, uuid, cb){
		var query = "MATCH (s:Source {uuid: $uuid})<-[:TAGS]-(c1:Class)-[:TAGS]->(coSource:Source)<-[:TAGS]-(c2:Class)-[:TAGS]->(coCoSource:Source) " +
		"WHERE s <> coCoSource " + 
		"RETURN coCoSource " +
		"LIMIT 1"
		console.log(uuid);
		var params = {uuid : uuid};
		var session = driver.session()
		session.run(query,params).then(data => {
			cb(data);
		})
	}
	,
	recommendTorrent : function(driver, infoHashes, cb){
		var query = "MATCH (t:Torrent) WHERE t.infoHash IN $infoHashes " +
		"MATCH (t)<-[:DIST_AS]-(e:Edition)<-[:PUB_AS]-(s:Source) " +
		"MATCH (s)<-[:TAGS]-(c1:Class)-[:TAGS]->(coSource:Source)<-[:TAGS]-(c2:Class)-[:TAGS]->(coCoSource:Source) " +
		"WHERE s <> coCoSource " +
		"WITH coCoSource " +
		"MATCH (t1:Torrent)<-[:DIST_AS]-(e1:Edition)<-[:PUB_AS]-(coCoSource) " + 
		"RETURN t1, coCoSource.title " +
		"ORDER BY t1.snatches DESC " +
		"LIMIT 1"
		var params = {infoHashes : infoHashes}
		var session = driver.session();
		session.run(query, params).then(data=>{
			cb(data);
		})
	}
	,
	recommendAuthor : function(driver, uuid, cb){
		var query = "MATCH (a:Author {uuid: $uuid})-[:AUTHOR]->(s:Source)<-[:TAGS]-(c1:Class)-[:TAGS]->"+
		"(coSource:Source)<-[:TAGS]-(c2:Class)-[:TAGS]->(coCoSource:Source) " +
		"WHERE s <> coCoSource " +
		"MATCH (coCoSource)<-[:AUTHOR]-(author:Author) " + 
		"RETURN author " +
		"ORDER_BY author.snatches DESC LIMIT 1"
		console.log(uuid);
		var params = {uuid : uuid};
		var session = driver.session()
		session.run(query,params).then(data => {
			cb(data);
		})
	}
	,
	recommendClass : function(driver, uuid, cb){
		var query = "MATCH (c:Class {uuid: $uuid})-[:TAGS]->(s:Source)<-[:TAGS]-(c1:Class)-[:TAGS]->"+
		"(coSource:Source)<-[:TAGS]-(c2:Class)-[:TAGS]->(coCoSource:Source) " +
		"WHERE s <> coCoSource " +
		"MATCH (coCoSource)<-[:TAGS]-(class:Class) " + 
		"RETURN class ORDER BY class.snatches" +
		"LIMIT 1"
		console.log(uuid);
		var params = {uuid : uuid};
		var session = driver.session()
		session.run(query,params).then(data => {
			cb(data);
		})
	}
}