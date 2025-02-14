With this webapp code you can make your own public BitTorrent indexer using WebTorrent, totally free. WebTorrent allows torrents to be downloaded in the Browser. 

The database uses Neo4j and there is a graph visualizer on the front-end.

To interface between WebTorrent browser and WebTorrents on the Desktop, the only BitTorrent client that currently works is BiglyBT with the WebTorrent plugin, so use that.

My site is hosted at propagate.info, and it is for public domain ebooks, audiobooks, classical music, and documentaries. 

To start your own Public BitTorrent indexer, create a new Neo4J Database. There is a free instance available up to 100,000 nodes. Then log into the Neo4J Browser and
```
  CREATE (b:Buoy {uuid : "d2b358ee-b58d-11ed-afa1-0242ac120002")
```
Then register a new user, making that the first and only user.
Now,
```
  MATCH (u:User)-[a:ACCESS]-(b:Buoy)
  SET a.rankTitle = "Philosopher King", a.rank = 0, description : true
```
Now set up a file config.js in your server root, the same folder the server is in:
```
  export const uri = "your_ neo4j_uri"
  export const user = "your_neo4j_user"
  export const password = "your_neo4j_password"
  export const SESSION_SECRET = "generate_a_cookie_session_secret"
```
You should be up and running now. Open an Issue if you have any problems, as I did not test this!
