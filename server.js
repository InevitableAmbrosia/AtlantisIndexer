/*
  TODO: img stays constant in edit
*/

import express from 'express';

import Web3 from 'web3'

const app = express();

const port = process.env.PORT || 8080;
import http from 'https';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import fs from 'fs';

import bcrypt from 'bcrypt'

import expressSession from "express-session";

import Redis from 'ioredis';
const redisClient = new Redis();

import RedisStore from 'connect-redis';
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "ATL",
})
/*
if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  expressSession.cookie.secure = true;
}*/

import passport from "passport"

import {Strategy as LocalStrategy} from "passport-local"


passport.serializeUser((user,cb) => { 
    

    return cb(null, user.uuid)

} )

//todo fix this
passport.deserializeUser((uuid, cb) => {
        const session = driver.session()
        var params = {uuid : uuid}
        var query = "MATCH (u:User {uuid : $uuid})-[:ACCESS]->(h:Buoy) " +
        "OPTIONAL MATCH (u)-[i:INVITED]->(ha:Buoy) " +
        "WITH collect({uuid : h.uuid, buoy : h.buoy}) AS buoys, " +
        "collect(DISTINCT ha{.buoy}) AS invite_buoys, collect(DISTINCT i{.uuid}) AS invite_uuids, u " +
        "RETURN u, buoys, invite_buoys, invite_uuids"
        session.run(query,params).then(data=>{
          session.close();
          
          return cb(null, {uuid : data.records[0]._fields[0].properties.uuid, user: data.records[0]._fields[0].properties.user, 
          buoys : data.records[0]._fields[1], invite_buoys : data.records[0]._fields[2],
          invite_uuids : data.records[0]._fields[3]})      
    
        })        
}) 

import util from "util"

import { 
  v1 as uuidv1
} from 'uuid';

import neo4j from 'neo4j-driver'

import he from "he";

import {uri, user, password, SESSION_SECRET} from './config.js'
import st_george from "./js/st_george.js"

import web_torrent from "./js/webtorrent.js"

import getTransactionReceiptMined from "./js/cryptoHash.js";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

import path from 'path';

import bodyParser from 'body-parser'


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.static(path.join(__dirname, 'static')));


app.use(expressSession({
  secret: SESSION_SECRET,
  cookie: {
        secure: false,
        maxAge:86400000
  },
  resave: true,
  rolling:true,
  saveUninitialized: true,
  store: new RedisStore({client: redisClient})
}))

app.use(passport.session());
app.use(passport.initialize())


passport.use(new LocalStrategy ({usernameField: "user", passwordField: "pass"}, function(user,pass,cb){
  const session = driver.session()
  console.log("USER!!: " + user)
  var query = "MATCH (u:User)-[:ACCESS]->(h:Buoy) " + 
  "WHERE toLower(u.user) = toLower($user) " +
  "OPTIONAL MATCH (u)-[i:INVITED]->(ha:Buoy) " +
  "WITH collect({uuid : h.uuid, buoy : h.buoy}) AS buoys, " +
  "collect(DISTINCT ha{.buoy}) AS invite_buoys, collect(DISTINCT i{.uuid}) AS invite_uuids, u, u.pass AS pass " +
  "RETURN u, pass, buoys, invite_buoys, invite_uuids"
  var params = {user: user}

  session.run(query,params).then(data=>{
    session.close();
    if(data.records.length === 0){
      return cb(null,false)
      //return res.json({error: "User does not exist!"})
    }
    bcrypt.compare(pass, data.records[0]._fields[1], function(err, result){
      if(result){
        console.log(util.inspect(data.records[0]._fields))
        console.log("Logged in: " + user)
        return cb(null, {uuid: data.records[0]._fields[0].properties.uuid, pass : data.records[0]._fields[1],
          user : data.records[0]._fields[0].properties.user, buoys : data.records[0]._fields[2], invite_buoys : data.records[0]._fields[3],
          invite_uuids : data.records[0]._fields[4]});
        //return res.end();
      }
      else{
        return cb(null,false)
        console.log("Incorrect password for " + user)
        //return res.json({errors: [{msg: "Incorrect Password!"}]})
      }
    })
    console.log(util.inspect(data.records[0]._fields))
    return cb(null, {uuid: data.records[0]._fields[0].properties.uuid, pass : data.records[0]._fields[1],
          user : data.records[0]._fields[0].properties.user, buoys : data.records[0]._fields[2], invite_buoys : data.records[0]._fields[3],
          invite_uuids : data.records[0]._fields[4]})
  })
 
}))


import { check, validationResult } from 'express-validator';

/*app.get("*", function(req,res,next){
  console.log("REFRESH " + req.user);
  fs.readFile(path.join(__dirname, '/static/index.html'), 'utf8', function (err, data) {

    let result = {user : JSON.stringify(req.user)};
    console.log(req.user)
    data = data.replace(/{{(.+?)}}/g, (_,g1) => result[g1] || g1)

    //data = data.replace(/\{[^\}]+\}/g, '{replacement}');
    console.log(data);
    res.send(data);
  //  next();
  })
})*/



// //  "public" off of current is root




var stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']

function remove_stopwords(str) {
    var res = []
    var str = str.toLowerCase();
    var words = str.split(' ')
    for(var i=0;i<words.length;i++) {
       var word_clean = words[i].split(".").join("")
       if(!stopwords.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '))
}

var public_buoys = getPublicBuoys();


function getPublicBuoys(){
  var session = driver.session();
  var query = "MATCH (h:Buoy {private : false}) " +
  "RETURN h"
  var params = {}
  session.run(query,params).then(data=>{
    return data.records.map(buoy => buoy._fields[0].properties.uuid);
  })
}

//web_torrent.initializeScrapePeers(driver);

app.post("/george_torrent", check("infoHashes").not().isEmpty().trim().escape(), function(req,res){
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    var infoHashes = JSON.parse(he.decode(req.body.infoHashes));
    for (var i = 0; i < infoHashes.length; i++) {
     console.log(infoHashes[i]);
     infoHashes[i] = infoHashes.length > 0 ? infoHashes[i].trim() : ""
     infoHashes[i] = infoHashes.length > 0 ? he.encode(infoHashes[i]) : "";
    }
    st_george.recommendTorrent(driver, infoHashes, function(data){
      if(data.records[0]){
        console.log("FOUND TAB RECO!")
        return res.json({torrent : data.records[0]._fields[0].properties, source : data.records[0]._fields[1]})
      }
      else{
        return res.json({errors : [{msg : "err"}]})
      }
    })
})

app.post("/recommend/:switch", check("switch").not().isEmpty().trim().escape(), check("uuid").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    switch(req.params.switch){
      case "source" : 
        st_george.recommendSource(driver, req.query.uuid, function(data){
          console.log(data.records[0]._fields[0])
          if(data.records[0]){
            return res.json({source : data.records[0]._fields[0].properties})
          }
          else{
            return res.json({errors : [{msg : ""}]})
          }
        })
      break;
      case "author":
        st_george.recommendAuthor(driver, req.query.uuid, function(data){
          if(data.records[0]){
            return res.json({author : data.records[0]._fields[0].properties})
          }
          else{
            return res.json({errors : [{msg : ""}]})
          }
        })
      break;
      case "class":
        st_george.recommendClass(driver, req.query.uuid, function(data){
          if(data.records[0]){
            return res.json({class : data.records[0]._fields[0].properties})
          }
          else{
            return res.json({errors : [{msg : ""}]})
          }
        })
      break;
      default :
        return res.end();
        break
    }   
})

app.post("/edit_select/:buoy", check("buoy").not().isEmpty().trim().escape(), check("media").not().isEmpty().trim().escape(), 
  check("formats").not().isEmpty().trim().escape(), check("types").not().isEmpty().trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var types = JSON.parse(he.decode(req.body.types));
    for (var i = 0; i < types.length; i++) {
     types[i] = he.encode(types[i].trim())
    }

    var media = JSON.parse(he.decode(req.body.media));
    for (var i = 0; i < media.length; i++) {
     media[i] = he.encode(media[i].trim())
    }

    var formats = JSON.parse(he.decode(req.body.formats));
    for (var i = 0; i < formats.length; i++) {
     formats[i] = he.encode(formats[i].trim())
    }

    var params = {types : types, media: media, formats : formats, buoy : req.params.buoy};
    var query = "MATCH (b:Buoy {uuid: $buoy}) " +
    "SET b.types = $types, b.media = $media, b.formats = $formats"

    session.run(query, params).then(data => {
      session.close();
      return res.end();
    })
  })

app.get("/upload_structure/:buoy", check('buoy').not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var params = {buoy : req.params.buoy}
  var query = "MATCH (b:Buoy {uuid : $buoy}) " + 
  "RETURN b"
  session.run(query,params).then(data=>{
    session.close();
    return res.json({buoy : data.records[0]._fields[0].properties})
  })
})

app.post("/bulletin/:buoy", check("buoy").not().isEmpty().trim().escape(), check("text").not().isEmpty().trim().escape(), check("title").not().isEmpty().trim().escape(),
  function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var params = {buoy : req.params.buoy, title : req.body.title, text : req.body.text}

  var query = "MATCH (b:Buoy {uuid : $buoy}) " + 
  "SET b.bulletin_title = b.bulletin_title + $title " +
  "SET b.bulletin_text = b.bulletin_text  + $text"
  session.run(query,params).then(data=>{
    session.close();
    return res.end();
  })
})

app.get("/search", check("term").trim().escape(), check("field").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()
  
  console.log(req.query.field)


  req.query.term = remove_stopwords(req.query.term);

  var query = "";  

  switch(req.query.field){
    case "search_sources":
      query += "CALL db.index.fulltext.queryNodes('titles', $sourceName) YIELD node " +
      "RETURN node " 
      break;
    case "search_authors":
      query += "CALL db.index.fulltext.queryNodes('authors', $authorName) YIELD node " +
      "RETURN node "
      break;
    case "search_classes":
      query += "CALL db.index.fulltext.queryNodes('classes', $className) YIELD node " +
      "RETURN node " 
      break; 
  }


  var params = {sourceName : req.query.term, authorName : req.query.term, className : req.query.term};
  console.log(params);
  session.run(query , params).then(data => {
      session.close()
      var recordData = []
      if(data.records){
        data.records.forEach(function(data, i){
          switch(req.query.field){
            case "search_sources":
              recordData.push({label : data._fields[0].properties.title, value : data._fields[0].properties.uuid});
              break;
            case "search_authors":
              recordData.push({label : data._fields[0].properties.author, value : data._fields[0].properties.uuid});
              break;
            case "search_classes":
              recordData.push({label : data._fields[0].properties.name, value : data._fields[0].properties.uuid});
              break;
            default: 
              break;
          }
        }) 
        console.log(recordData);
        return res.send(recordData); 
      }
      else{
        return res.end();
      }
  }).catch(function(err){
    console.log(err);
    return res.end();
  })
})

/*
with p,collect(b) as books, count(b) as total
with p,total,books 
unwind books as book
match (book)-[:CATEGORIZED_AS]->(c)
return p,c, count(book) as subtotal, total
*/
var torrentQuery = "OPTIONAL MATCH (a:Author)-[]->(s) " + 
  "WITH s, a, count " +  
  "OPTIONAL MATCH (e:Edition)<-[:PUB_AS]-(s) " +
  "WITH s,a,e, count " +
  "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
  "WITH s,a,e,t,count, {ETH_price: t.ETH_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " +  
  "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
  "WITH s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c, count "
 

 app.get("/infoHash/:uuid", check("uuid").not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  console.log(req.params.uuid);
  var query = "OPTIONAL MATCH (free:Torrent { uuid : $uuid} ) WHERE free.ETH_price = 0 " +
  "OPTIONAL MATCH (prem:Torrent { uuid :$uuid})<-[:BOUGHT {confirmed : true}]-(u:User{uuid : $userUUID}) "+
  "RETURN free.infoHash, prem.infoHash"
  var params = {uuid: req.params.uuid, userUUID : req.user ? req.user.uuid : "null"}
  var session = driver.session();
  session.run(query,params).then(data=>{
    console.log('HERE' + data.records[0]);
    session.close();
    if(data.records[0] && (data.records[0]._fields[0] || data.records[0]._fields[1])){
      return res.json({free : data.records[0]._fields[0], prem: data.records[0]._fields[1] })
    }
    else{
      return res.end();
    }

  })
 })

 app.get("/page_graph", check("buoy").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = 'MATCH (c:Class)-[:TAGS]->(s:Source {buoy: $buoy})<-[:AUTHOR]-(a:Author) ' +
              'RETURN s, c, a ORDER BY s.created_at DESC LIMIT 4000'


  var params = {uuid : req.params.uuid, buoy : req.query.buoy}
  
  session.run(query , params).then(data => {
      session.close()
      return res.json({data: data.records});
  })

 })

app.get("/source_graph/:uuid", check("uuid").trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = 'MATCH (s:Source {uuid: $uuid}) ' +
              'WITH s ' + 
              'OPTIONAL MATCH (s)<-[:TAGS]-(c:Class) ' +
              'WITH s,c ' +
              'OPTIONAL MATCH (d:Source)<-[:TAGS]-(c) ' +
              'WITH s, c, d ' +
              'OPTIONAL MATCH (s)<-[:AUTHOR]-(a:Author) ' +
              'WITH s,c,d,a ' +
              'OPTIONAL MATCH (e:Source)<-[:AUTHOR]-(a) ' +
              'RETURN s, c, d, a, e ORDER BY s.snatches DESC LIMIT 27'


  var params = {uuid : req.params.uuid}
  
  session.run(query , params).then(data => {
      session.close()
      return res.json({data: data.records});
  })

})

app.post("/torrents", [check("start").trim().escape(), check("buoy").not().isEmpty().trim().escape(), check("length").trim().escape()], function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  
  const session = driver.session()

  console.log(req.body.buoy)

  console.log("here");
  var query = '';

  var params = {};

  query += "MATCH (so:Source {buoy:$buoy}) " +
  "WITH count(so) AS count "
  + "MATCH (s:Source {buoy:$buoy}) "
  query += torrentQuery;
  query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.created_at DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

  params = {skip : req.body.start, limit : req.body.length, buoy : req.body.buoy}
  console.log(params);

  session.run(query , params).then(data => {
      session.close()      
      var recordsTotal;
      var recordsFiltered;
      if(data.records.length > 0){
        recordsTotal = parseInt(data.records[0]._fields[4]);
        recordsFiltered = parseInt(data.records[0]._fields[4])
      }
      return res.json({recordsTotal: recordsTotal, recordsFiltered: recordsFiltered, data: data.records});
    })
})

app.post("/author/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = '';

  query +=
  "MATCH (:Author {uuid : $uuid})-[]->(so:Source) " + 
  "WITH count(so) AS count " +
  "MATCH (a:Author {uuid : $uuid})-[]->(s:Source) " + 
  "WITH a, s, count " +  
  "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
  "WITH s,a,e, count " +
  "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
  "WITH s, a, e,  {ETH_price: t.ETH_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent ,count " +
  "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
  "WITH s,a, collect(DISTINCT {edition: e, torrent: torrent}) AS edition_torrents, c, count " + 
  "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
  console.log(util.inspect(req.body));

  var params = {skip : req.body.start, limit : req.body.length, uuid : req.params.uuid}

  session.run(query , params).then(data => {
      session.close()
      return res.json({recordsTotal: parseInt(data.records[0]._fields[4]), recordsFiltered: parseInt(data.records[0]._fields[4]), data: data.records});
  })
 
})

app.post("/merge_source/:uuid", check("uuid").trim().escape(), check("mergeInto").trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  console.log("UUID " + req.params.uuid, "mergeInto " + req.body.mergeInto)

  var query = 'MATCH (s:Source {uuid : $uuid})-[:PUB_AS]->(e:Edition)-[:DIST_AS]->(t:Torrent) ' +
              'WITH s,e,t ' +
              'MATCH (so: Source {uuid : $mergeInto}) ' +
              'DETACH DELETE (s) ' +
              'MERGE (so)-[:PUB_AS]->(e)-[:DIST_AS]->(t) '

  var params = {uuid : req.params.uuid, mergeInto: req.body.mergeInto};

  session.run(query , params).then(data => {
      session.close()
      return res.end();
  })
})

app.post("/source/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = '';

  query += "MATCH (s:Source {uuid : $uuid}) "
  query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
  "WITH s, a " +  
  "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
  "WITH s,a,e " +
  "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
  "WITH s, a, e,  {ETH_price: t.ETH_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " + 
  "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
  "WITH s, a, collect(DISTINCT{edition: e, torrent: torrent}) AS edition_torrents, c "
  query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c) SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
  console.log(util.inspect(req.body));

  var params = {uuid : req.params.uuid, skip : req.body.start, limit : req.body.length};

  session.run(query , params).then(data => {
      session.close()
      return res.json({recordsTotal: 1, recordsFiltered: 1, data: data.records});
  })  
})

app.post("/add_class", check("name").trim().escape().toLowerCase().isLength({max : 256}).not().isEmpty(),
 function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()
  console.log(req.body.name);
  var uuid = uuidv1();
  var query = 'MERGE (c:Class {name : $className}) ' +
  'ON CREATE SET c.uuid = randomUUID() ' + 
  'RETURN c.uuid ';
  var params = {className : he.decode(req.body.name)};
 
  session.run(query , params).then(data => {
      session.close()
      return res.json({uuid : data.records[0]._fields[0]})
  })  
})

app.post("/classes", function(req,res){
  const session = driver.session()

  //two match clauses to count
  var query = 'MATCH (cl:Class) ' +
    "WITH count(cl) AS count " + 
    "MATCH (c:Class) " +
    "WITH c, count " + 
    "OPTIONAL MATCH (s:Source)<-[:TAGS]-(c) " + 
    "WITH TOFLOAT(count(s)) AS numSources, c, count " +
    "RETURN c, count, numSources SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)"
    console.log(req.body.start, req.body.length)
  var params = {skip : req.body.start, limit : req.body.length};


  session.run(query , params).then(data => {
    session.close()
    if(data.records && data.records[0]){
      return res.json({recordsTotal: parseInt(data.records[0]._fields[1]), recordsFiltered: parseInt(data.records[0]._fields[1]), data: data.records});
    }
    else{
      return res.json({ errors : [{msg : "Error loading torrents"}]});
    }
  })  

})

app.post("/class/:uuid", check("uuid").trim().escape().isLength({max : 256}), 
  check("skip").trim().escape(),
  check("length").trim().escape(),
  function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = 'MATCH (cl:Class {uuid : $uuid}) '
  query += "WITH cl "
  query += "OPTIONAL MATCH (cl)-[:TAGS]->(so:Source)" 
  query += "WITH count(so) AS count "
  query += "MATCH (c:Class {uuid: $uuid}) "
  query += "WITH c, count "
  query += "MATCH (c)-[:TAGS]->(s:Source) " +
  "WITH count, s " +
  "OPTIONAL MATCH (cla:Class)-[:TAGS]->(s) " +
  "WITH count, s, cla " +
  "OPTIONAL MATCH (a:Author)-[]->(s) " + 
  "WITH s, a, count, cla " +  
  "OPTIONAL MATCH (e:Edition)<-[:PUB_AS]-(s) " +
  "WITH s,a,e, count, cla " +
  "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +  
  "WITH s, a, cla, count, e, {ETH_price: t.ETH_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " +
  "WITH s, a, cla, collect(DISTINCT {edition: e, torrent: torrent}) AS edition_torrents, count "
  query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) " //SIZE((:Edition)<-[:PUB_AS]-(s))
  
  var params = {uuid : he.decode(req.params.uuid), skip: req.body.start, limit: req.body.length};
  session.run(query , params).then(data => {
      session.close()
      var recordsTotal;
      var recordsFiltered;
      if(data.records.length > 0){
        recordsTotal = parseInt(data.records[0]._fields[4]);
        recordsFiltered = parseInt(data.records[0]._fields[4])
      }
      return res.json({recordsTotal: recordsTotal, recordsFiltered: recordsFiltered, data: data.records});
    })
})

//add source to class
app.post("/add_source/:uuid", check("source_uuid").trim().escape().isLength({max:256}), check("uuid").trim().escape().isLength({max:256}), 
  function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }

    console.log(req.body.source_uuid, req.params.uuid);

    const session = driver.session()

    var query = 'MATCH(c:Class {uuid : $classUUID}) '
    query += 'WITH c '
    query += "MATCH (s:Source {uuid : $sourceUUID}) "
    query += 'MERGE (c)-[:TAGS]->(s) '

    var params = {sourceUUID : he.decode(req.body.source_uuid), classUUID : he.decode(req.params.uuid)}
    session.run(query , params).then(data => {
      session.close()
      res.end();
    })
  })

app.post("/delete_torrent/:infoHash", check("infoHash").trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = "MATCH (t:Torrent {infoHash: $torrentInfoHash}) " +
              "SET t.deleted = true "

  var params = {torrentInfoHash : req.params.infoHash}
    session.run(query , params).then(data => {
      session.close()
      res.end();
    })
})

app.post("/restore_torrent/:infoHash", check("infoHash").trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = "MATCH (t:Torrent {infoHash: $torrentInfoHash}) " +
              "SET t.deleted = false "

  var params = {torrentInfoHash : req.params.infoHash}
    session.run(query , params).then(data => {
      session.close()
      res.end();
    })
})

app.get("/upload/:uuid", check("buoy").not().isEmpty().trim().escape(), check("uuid").trim().escape().isLength({max:256}), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = '';
  var params = {buoy : req.query.buoy};


/*
MATCH (c:ContainerNode)<-[:BELONGS_TO]-(n:Node)
WITH c, collect({ id: id(n), name: n.name, type: labels(n)[0] }) AS nodes
WITH { id: id(c), name: c.name, type: labels(c)[0], SubNodes: nodes } AS containerNode
RETURN {nodes: collect(containerNode) }
*/

  query += "MATCH (s:Source {uuid : $uniqueID}) " +
  "WITH s " +
  "OPTIONAL MATCH (a:Author)-[]->(s) " +
  "WITH s, a " +
  "OPTIONAL MATCH (c:Class)-[]->(s) " +
  "WITH s, a, c " +
  "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
  "WITH s,a,e,c, {title : e.title, date: e.date, pages : e.pages, img: e.img, uuid: e.uuid, publisher: e.publisher} AS edition " +
  "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) " +
  "WITH s,a,e,c,edition,t " +
  "MATCH (b:Buoy {uuid: $buoy}) " +
  "RETURN s.title AS title, COLLECT(DISTINCT {uuid: a.uuid, author : a.author}) AS author, COLLECT(DISTINCT c.name) AS classes, s.date AS date, " +
  "collect(DISTINCT edition) AS editions, COLLECT(DISTINCT t) AS torrents, s.type AS type, b"

  params["uniqueID"] = req.params.uuid;

  session.run(query , params).then(data => {
    session.close();
    
    console.log(util.inspect(data.records[0]._fields[4]))
    return res.json({record : data.records[0], captcha: res.recaptcha});
  })
})

app.post("/web3/:hash", check("booty").not().isEmpty(), check("hash").not().isEmpty(), check("uuid").not().isEmpty(), check("torrentUUID").not().isEmpty(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }
    console.log("HERE");
    if(req.query.booty === "false" && !req.user){
      return res.end();
    }
    async function getConfirmations(txHash) {
      try {
        // Instantiate web3 with HttpProvider
        const web3 = new Web3('https://mainnet.infura.io/v3/cc91eaca8dbf4271a890887b5e869f8d')

        // Get transaction details
        const trx = await web3.eth.getTransaction(txHash)

        // Get current block number
        const currentBlock = await web3.eth.getBlockNumber()

        // When transaction is unconfirmed, its block number is null.
        // In this case we return 0 as number of confirmations
        return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
      }
      catch (error) {
        console.log(error)
      }
    }

    var session=driver.session();
      var transaction = web3Transactions.find(o => o.uuid === req.query.uuid);
      if(!transaction){
        web3Transactions.push({uuid : req.query.uuid, trxConfirmations : 0})
        transaction = web3Transactions.find(o=>o.uuid===req.query.uuid)
      }
      console.log(transaction);
      console.log("UUID: " + req.query.uuid);

    var query = "MATCH (t:Torrent{uuid: $torrentUUID}) " +
    "MATCH (u:User {uuid : $user}) " +
    "MERGE (u)-[b:BOUGHT {uuid : $uuid}]->(t) " + 
    "SET b.hashes = b.hashes + [$hash], b.confirmed = false";

    var params = {user : req.user, torrentUUID: req.query.torrentUUID, hash: req.params.hash, uuid : req.query.uuid};


    session.run(query,params).then(data=>{
      session.close();
    });

    confirmEtherTransaction(req.params.hash, 10, 0);

    function confirmEtherTransaction(txHash, confirmations, prevConfirmations) {
    setTimeout(async () => {
      
      // Get current number of confirmations and compare it with sought-for value
      const trxConfirmations = await getConfirmations(txHash)
      
      console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)')

      if (trxConfirmations >= confirmations) {
        // Handle confirmation event according to your business logic

        console.log('Transaction with hash ' + txHash + ' has been successfully confirmed')
        res.end();
        
      }
      // Recursive call
      
     
        if(trxConfirmations <= 20 || !trxConfirmations){
          if(trxConfirmations){
            if(Number(trxConfirmations) + Number(trxConfirmations) - Number(prevConfirmations) > 20){
              transaction.trxConfirmations = 20;
            }
             transaction.trxConfirmations += Number(trxConfirmations) - Number(prevConfirmations); 
            }

          
          
          return confirmEtherTransaction(txHash, confirmations, trxConfirmations ? Number(trxConfirmations) : prevConfirmations)
        }
      
    }, 30 * 1000)

    

  }
})

var web3Transactions = [];

app.get("/buyPrice/:uuid", check("uuid").not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }
    var query = "MATCH (t:Torrent{uuid : $uuid}) "+
    "RETURN t.ETH_price"
    var params = {uuid : req.params.uuid};
    var session = driver.session();
    session.run(query,params).then(data=>{
      session.close();
      res.json({buyHash: (data.records[0] && data.records[0]._fields[0]) ? data.records[0]._fields[0] : null})
    })
})

app.post("/pollBatch/:uuid", check("uuid").not().isEmpty(), check("torrentUUID").not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }
    var transaction = web3Transactions.find(o=>o.uuid === req.params.uuid);
    if(!transaction){
      web3Transactions.push({uuid : req.params.uuid, trxConfirmations : 0})
      transaction = web3Transactions.find(o=>o.uuid === req.params.uuid);
    }
    if(Number(transaction.trxConfirmations) >= 20){
      var query = "MATCH (t:Torrent{uuid:$torrentUUID}) " +
        "MATCH (u:User {uuid: $user}) " + 
        "MERGE (u)-[b:BOUGHT {uuid : $uuid}]->(t) " +
        "SET b.confirmed = true " + 
        "RETURN t.infoHash "
        var params = {user : req.user.uuid, uuid : req.params.uuid, torrentUUID : req.query.torrentUUID}
        web3Transactions = web3Transactions.filter((function(o) { return o.uuid === req.query.uuid })); 

        var session = driver.session();
        session.run(query,params).then(data=>{
          session.close();

          return res.json({bought: true, infoHash : data.records[0] && data.records[0]._fields[0] ? data.records[0]._fields[0] : null});

        })
    }
    else{
      return res.json({bought : false})
    }
})

app.post("/pollTransactions/:uuid", check("uuid").not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }

    var transaction = web3Transactions.find(o=>o.uuid === req.params.uuid);
    if(!transaction){
      web3Transactions.push({uuid : req.params.uuid, trxConfirmations : 0})
      transaction = web3Transactions.find(o=>o.uuid === req.params.uuid)
    }
    console.log(Number(transaction.trxConfirmations));    
    res.json({confirmations: Number(transaction.trxConfirmations)});
})

app.post("/dl/:infoHash", check("infoHash").trim().escape().not().isEmpty(), check("numPeers").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }

  var session = driver.session();

  var params = {infoHash: req.params.infoHash, numPeers : parseInt(req.query.numPeers), user : req.user ? req.user.uuid : "null"};
  var query = "MATCH (t:Torrent {infoHash: $infoHash})-[]-(e:Edition) " +
  "SET t.numPeers = TOFLOAT($numPeers) " +
  "WITH t, e MATCH (to:Torrent)-[]-(e) " +
  "WITH t, e, TOFLOAT(SUM(to.numPeers)) AS numPeers " +
  "SET e.numPeers = numPeers " +
  "WITH t " +
  "MATCH (ti:Torrent{infoHash:$infoHash}) " + 
  "SET ti.snatches = toFloat(t.snatches + 1) " +
  "WITH ti " + 
  "MATCH (e:Edition)-[:DIST_AS]->(ti) " +
  "WITH e,ti " +
  "SET e.snatches = toFloat(e.snatches + 1) " +
  "WITH ti " +
  "MATCH (s:Source)-[:PUB_AS]->(e) " +
  "WITH s, ti " +
  "SET s.snatches = toFloat(s.snatches + 1) " +
  "WITH ti " +
  "MATCH (u:User {uuid : $user}) " + 
  "MERGE (u)-[:DOWNLOADED]->(ti)" 

  console.log("PEERLESS :) " + req.query.numPeers);
  session.run(query,params).then(data=>{

    session.close();
    res.end();
  })
  
})

app.post("/upload/:uuid", check("buoy").trim().escape().not().isEmpty(), check("access").trim().escape(), check("type").trim().escape(), 
  check("edition_no").trim().escape().isLength({max: 256}), check("ETH_address").trim().escape().isLength({max:256}), check("ETH_price").trim().escape().isLength({max:256}),
  check("edition_img").trim().escape().isLength({max:9000}), check("edition_pages").trim().escape().isLength({max :256}), check("edition_publisher").trim().escape().isLength({max:256}), check("uuid").trim().escape().isLength({max:256}), check("edition_date").trim().escape().isLength({max:256}), 
  check("date").trim().escape().isLength({max:256}), check("classes").trim().escape().isLength({max:9000}), check("torrent").trim().escape().isLength({max:9000}),
   check("edition_title").trim().escape().isLength({max:256}), check("authors").trim().escape().isLength({max : 9000}), check("edition_uuid").trim().escape(),
   check("title").trim().escape().not().isEmpty().isLength({max : 256}).withMessage("Primary Source Title must be <= 256 characters"), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }

    console.log("UPL REQUEST!")

    if(req.body.authors){
      var authors = JSON.parse(he.decode(req.body.authors));
    }

    console.log(req.params.uuid);
  
    var torrent = JSON.parse(he.decode(req.body.torrent));


    if(req.params.uuid === "undefined" && torrent && !torrent.infoHash){
      return res.json({errors : [{msg : "You must upload a torrent file."}]})
    }

    const session = driver.session()

    var query = '';
    var params = {};

    var edition;
    if(req.body.edition_title.length === 0){
      edition = ""
    }
    else{
      edition = he.decode(req.body.edition_title);
    }

    var classes = JSON.parse(he.decode(req.body.classes));
    for (var i = 0; i < classes.length; i++) {
     classes[i] = he.encode(classes[i].trim())
    }
  

    /* for editing if(!torrent.infoHash){
      console.log("infoHash cannot be blank.");
      return res.json({errors : [{msg: "infoHash cannot be blank."}]})
    } */
    console.log("HERE" + req.user.uuid)
    //new source upload
    if(req.params.uuid === "undefined"){
      //get image thumbnail
      function newUpload(){

          query += 'MATCH (ua:User {uuid : $user})-[ac:ACCESS]->(h:Buoy {uuid:"d2b358ee-b58d-11ed-afa1-0242ac120002"}) ' +
          "SET ac.uploads = ac.uploads + 1 " +
          'WITH ac, ua ' +
          'MERGE (s:Source {buoy : $buoy, title : $sourceTitle, snatches: toFloat(0), top10: DATETIME(), ' +
          'type: $sourceType, date: $sourceDate, uuid : $uniqueID, ' +
          'created_at: toFloat(TIMESTAMP())}) ' +
            //"SET s.img = CASE WHEN $editionIMG IS NOT NULL THEN $editionIMG END " +//, img : $editionIMG 
            //'SET s.date = $sourceDate ' +
            'FOREACH( ' + 
              'class IN $classes | MERGE (c:Class {name : class}) ' +
              'ON CREATE SET c.uuid = randomUUID() ' +
              'MERGE (s)<-[:TAGS]-(c) ' + 
            ') ' +
            'MERGE (e:Edition {title : $editionTitle, snatches: toFloat(0), publisher: $editionPublisher, uuid : randomUUID()})<-[:PUB_AS]-(s) ' +
            'SET e.pages = $editionPages, e.no = $editionNo, e.date = $editionDate, e.img = $editionIMG, e.created_at = toFloat(TIMESTAMP()) ' +     
            'MERGE (t:Torrent {infoHash : $infoHash, media : $media, format: $format})<-[:DIST_AS]-(e) ' +
            'ON CREATE SET t.snatches = toFloat(0), t.uuid = randomUUID(), t.uploaderUUID = $user, t.uploaderUser = $name, t.ETH_address = $ETH_address, ' +
            ' t.ETH_price = $ETH_price, t.created_at = toFloat(TIMESTAMP()), t.deleted = false ' +
            'ON MATCH SET t.created_at = toFloat(TIMESTAMP()) ' +
            "MERGE (ua)-[:UPLOADED]->(t) " 

          params["sourceTitle"] = he.decode(req.body.title);
          params["sourceDate"] = he.decode(req.body.date);
          params["editionTitle"] = he.decode(edition);
          params["editionIMG"] = req.body.edition_img ? he.decode(req.body.edition_img) : null;
          params["editionPublisher"] = he.decode(req.body.edition_publisher)
          params["editionPages"] = he.decode(req.body.edition_pages);
          params["editionDate"] = he.decode(req.body.edition_date);
          params["editionNo"] = he.decode(req.body.edition_no);
          params["uniqueID"] = uuidv1();
          params["classes"] = classes;
          params["sourceType"] = he.decode(req.body.type);
          params["infoHash"] = torrent.infoHash;
          params["media"] = torrent.media;
          params["format"] = torrent.format;
          params["user"] = req.user ? req.user.uuid : "null";
          //TODO: STATE QUESTION!
          params["name"] = req.user ? req.user.user : "Anonymous"
          params["buoy"] = req.body.buoy;
          params["ETH_address"] = req.body.ETH_address;
          params["ETH_price"] = req.body.ETH_price ? req.body.ETH_price : 0.0;
          //params["length"] = torrent.length

        

          if(authors && authors.length > 0){
            authors.forEach(function(author, i){  

              //TO SANITIZE
              switch(author.importance){
                case "author":
                  authorImportance = "AUTHOR";
                  break;
                case "editor" : 
                  authorImportance = "EDITOR";
                  break;
                case "translator":disable
                  authorImportance = "TRANSLATOR";
                  break;
                default:
                  authorImportance = "AUTHOR";
                  break;
              }

              query += 'WITH s, ac ' + 
              'OPTIONAL MATCH (a:Author {uuid : $uniqueID' + i + '}) ' +
              'WITH s, a, ac ' + 
              'MERGE (s)<-[au:' + authorImportance + ' {role : $authorRole' + i + '}]-(a) '
              'RETURN s.uuid AS uuid, ac '
              params["uniqueID" + i] = author.uuid;
              params["authorRole" + i] = author.role
            })
          }
          query += 'RETURN s.uuid AS uuid, ac '
          
          session.run(query , params).then(data => {
                session.close()
                //find source uuid
                //console.log(util.inspect(data));
                if(req.user){
                 // req.session.passport.user.access.uploads++;
                  promote(data.records[0]._fields[1].properties)
                }
                console.log(data.records[0]._fields[0]);
                return res.json({"uuid" : data.records[0]._fields[0]});
            })  
          .catch(function(err){
            console.log(err);
            if(err.code === "Neo.ClientError.Schema.ConstraintValidationFailed"){
              err = "Torrent infoHash already exists on the site."
            }
            console.log("NEO4J ERROR: " + err);
            return res.json({errors: [{msg : err}]})
          })
      }

      newUpload();



    }
    //edit format
    else{

      var edition_uuid;
      console.log(req.body.edition_uuid);
      if(req.body.edition_uuid === "null"){
        edition_uuid = uuidv1();
      }
      else{
        edition_uuid = req.body.edition_uuid;
      }

      query += 'MATCH (s:Source {uuid : $uniqueID}) ' +
      'SET s.date = $sourceDate, s.type = $sourceType, s.title=$sourceTitle, s.top10 = DATETIME(), s.created_at = toFloat(TIMESTAMP())' + //, s.img = CASE WHEN $editionIMG IS NOT NULL THEN $editionIMG END ' +
      'WITH s ' +
      'OPTIONAL MATCH (s)<-[ta:TAGS]-(c:Class) ' +
      'WITH s, ta ' +
      //clear all tags
      'DELETE ta ' + 
      'WITH s ' +
      'FOREACH( ' + 
          'class IN $classes | MERGE (c:Class {name : class}) ' +
          'ON CREATE SET c.uuid = randomUUID() ' +
          'MERGE (s)<-[:TAGS]-(c) ' + 
       ') ' +
       'WITH s ' + 
       "OPTIONAL MATCH (e:Edition {uuid:$edition_uuid})"
       "SET e.date = $editionDate, e.no = $editionNo, e.title = $editionTitle, e.publisher = $editionPublisher, e.pages = $editionPages "

       if(torrent.infoHash){
        query += 'MERGE (e1:Edition {uuid : $edition_uuid}) ' +
       'MERGE (e1)<-[pu:PUB_AS]-(s) ' +
       'ON CREATE SET e1.snatches = toFloat(0), e1.no = $editionNo, e1.date = $editionDate, e1.created_at = toFloat(TIMESTAMP()),' + 
       'e1.pages = $editionPages, e1.title = $editionTitle, e1.publisher = $editionPublisher ' +
       'ON MATCH SET e1.date = $editionDate, e1.no = $editionNo, e1.created_at = toFloat(TIMESTAMP()), e1.pages = $editionPages '
        query += "MERGE (t:Torrent {snatches: toFloat(0), infoHash : $torrentInfoHash, created_at: toFloat(TIMESTAMP()), "+
        "deleted : false, uuid: randomUUID(), media : $torrentMedia, format: $torrentFormat})<-[di:DIST_AS]-(e1) " 
    
       }

      
      params["uniqueID"] = req.params.uuid;
      params["classes"] = classes;
      params["editionIMG"] = req.body.edition_img !== null ? he.decode(req.body.edition_img) : null;
      params["sourceTitle"] = he.decode(req.body.title)
      params["sourceDate"] = he.decode(req.body.date)
      params["editionPublisher"] = he.decode(req.body.edition_publisher)
      params["editionPages"] = he.decode(req.body.edition_pages);
      params["editionDate"] = he.decode(req.body.edition_date);
      params["editionTitle"] = he.decode(req.body.edition_title);
      params["editionNo"] = he.decode(req.body.edition_no);
      params["torrentInfoHash"] = torrent.infoHash;
      params["torrentMedia"] = torrent.media;
      params['torrentFormat'] = torrent.format;
      //params["torrentLength"] = torrent.length;
      params["sourceType"] = he.decode(req.body.type)
      params["edition_uuid"] = edition_uuid;

      var authors = JSON.parse(he.decode(req.body.authors));
      //var publishers = JSON.parse(he.decode(req.body.publishers));

      var authorImportance; //check this


          //clear all authors
          query += 'WITH s ' + 
          'OPTIONAL MATCH (a:Author)-[au]->(s) ' +
          'WITH s, au ' + 
          'DELETE au '

     // console.log(util.inspect(authors));
      if(authors && authors.length > 0){
        authors.forEach(function(author, i){  

          //TO SANITIZE
          switch(author.importance){
            case "author":
              authorImportance = "AUTHOR";
              break;
            case "editor":
              authorImportance = "EDITOR";
              break;
            case "translator":
              authorImportance = "TRANSLATOR";
              break;
            default:
              authorImportance = "AUTHOR";
              break;
          }



          //re-add the authors
          query += 'WITH s ' + 
          'OPTIONAL MATCH (b:Author {uuid : $uniqueID' + i + '}) ' +
          'WITH s, b ' + 
          'MERGE (s)<-[ai:' + authorImportance + '{role : $authorRole' + i + '}]-(b) '
          

          params["uniqueID" + i] = author.uuid;
          params["authorRole" + i] = author.role
        })
      }
      query += 'RETURN s.uuid AS uuid '

      session.run(query , params).then(data => {
            session.close()
            //find source uuid
            //console.log(util.inspect(data));
            return res.json({"uuid" : data.records[0].get("uuid")});
        })  
      .catch(function(err){
        if(err.code === "Neo.ClientError.Schema.ConstraintValidationFailed"){
          err = "Torrent infoHash already exists on the site."
        }
        console.log("ERROR: " + err);
        return res.json({errors: [{msg : err}]})
      })
    }
})

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

app.post("/create_author", check("author").trim().escape().not().isEmpty().isLength({max : 256}).withMessage("Author must be <= 256 characters"), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    console.log("Create Author: " + req.body.author);
    session.run('MERGE (a:Author {author : $authorName}) ' +
    'ON CREATE SET a.uuid = $uniqueID ' +
    'RETURN a.uuid AS uuid, a.author AS author' ,{authorName : he.decode(req.body.author), uniqueID : uuidv1()}).then(data => {
        session.close()
        return res.json({uuid : data.records[0].get('uuid'), author : data.records[0].get('author')});
    })    
})

app.post("/add_author", check("author").trim().escape().not().isEmpty().isLength({max : 256}).withMessage("Author must be <= 256 characters"), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    console.log("Add Author: " + req.body.author);
    session.run('MATCH (a:Author {author : $authorName}) ' +
      'RETURN a.uuid AS uuid, a.author AS author', {authorName : he.decode(req.body.author)}).then(data => {
        session.close()
        if(data.records[0]){
          return res.json({uuid : data.records[0].get('uuid'), author : data.records[0].get('author')});
        }
        else{
          return res.json({});
        }
      })  
})

app.post("/snatched/:infoHash", check("infoHash").trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    console.log(req.params.infoHash);

    var query = "MATCH (t:Torrent{infoHash:$infoHash}) " + 
                "SET t.snatches = toFloat(t.snatches + 1) " +
                "WITH t " + 
                "MATCH (e:Edition)-[:DIST_AS]->(t) " +
                "SET e.snatches = toFloat(e.snatches + 1) " +
                "WITH t " +
                "MATCH (s:Source)-[:PUB_AS]->(e) " +
                "SET s.snatches = toFloat(s.snatches + 1) " +
                "MATCH (c:Class)-[:TAGS])(s) " +
                "SET c.snatches = toFloat(c.snatches + 1) " +
                "MATCH (a:Author)-[:AUTHOR]->(s) " + 
                "SET a.snatches = toFloat(a.snatches +1) " + 
                "WITH t " +
                "MATCH (u:User {uuid : $user}) " + 
                "MERGE (u)-[:DOWNLOADED]->(t)"

    var params = {infoHash: he.decode(req.params.infoHash), user : req.user ? req.user.uuid : "null"}

    session.run(query,params).then(data => {
      session.close();
      return res.end();
    })
})

app.post("/top10_day", check("buoy").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {time: "P1D", buoy:req.body.buoy}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source {buoy : $buoy}) " + 
                "WHERE s.top10 > threshold "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
                "WITH s, a " +  
                "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
                "WITH s,a,e " +
                "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
                "WITH s, a, e, t " + 
                "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
                "WITH s, a, collect(DISTINCT {edition: e, torrent: t}) AS edition_torrents, c "
    query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c) ORDER BY s.snatches DESC LIMIT 10"



    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length >= 10){
        total = 10;
      }
      else{
        total = data.records.length;
      }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})


app.post("/top10_week", check("buoy").not().isEmpty().trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {time: "P7D", buoy: req.body.buoy}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source {buoy : $buoy}) " + 
                "WHERE s.top10 > threshold "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
                "WITH s, a " +  
                "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
                "WITH s,a,e " +
                "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
                "WITH s, a, e, t " + 
                "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
               // "WITH s, a, {edition: e, torrents: collect(DISTINCT t)} AS editions, c "
               "WITH s, a, collect(DISTINCT {edition: e, torrent: t}) AS edition_torrents, c "
    query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c) ORDER BY s.snatches DESC LIMIT 10"



    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length >= 10){
        total = 10;
      }
      else{
        total = data.records.length;
      }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})


app.post("/top10_month", check("buoy").not().isEmpty().trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {time: "P30D", buoy:  req.body.buoy}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source {buoy: $buoy}) " + 
                "WHERE s.top10 > threshold "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
                "WITH s, a " +  
                "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
                "WITH s,a,e " +
                "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
                "WITH s, a, e, t " + 
                "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
                "WITH s, a, collect(DISTINCT {edition: e, torrent: t}) AS edition_torrents, c "
    query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c) ORDER BY s.snatches DESC LIMIT 10"



    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length >= 10){
        total = 10;
      }
      else{
        total = data.records.length;
      }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})

app.post("/top10_year", check("buoy").not().isEmpty().trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {time: "P365D", buoy: req.body.buoy}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source {buoy: $buoy}) " + 
                "WHERE s.top10 > threshold "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
                "WITH s, a " +  
                "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
                "WITH s,a,e " +
                "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
                "WITH s, a, e, t " + 
                "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
                "WITH s, a, collect(DISTINCT {edition: e, torrent: t}) AS edition_torrents, c "
    query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c) ORDER BY s.snatches DESC LIMIT 10"



    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length >= 10){
        total = 10;
      }
      else{
        total = data.records.length;
      }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})


app.post("/top10_alltime", check("buoy").not().isEmpty().trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {buoy : req.body.buoy};


    var query = "MATCH (s:Source {buoy: $buoy}) "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
                "WITH s, a " +  
                "MATCH (e:Edition)<-[:PUB_AS]-(s) " +
                "WITH s,a,e " +
                "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
                "WITH s, a, e, t " + 
                "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
                "WITH s, a, collect(DISTINCT {edition: e, torrent: t}) AS edition_torrents, c "
    query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c) ORDER BY s.snatches DESC LIMIT 10"



    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length >= 10){
        total = 10;
      }
      else{
        total = data.records.length;
      }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})

app.post("/modify_infoHash/:infoHash", function(req,res){
  var params = {infoHash : req.params.infoHash}
  var query = ""

  query += "MATCH (t:Torrent {infoHash: $infoHash})"
})

app.post("/register", [check("user").not().isEmpty().trim().escape().isLength({max:55}).withMessage("Username must be <=55 chars").isAlphanumeric().
  withMessage("Username must be Alphanumeric"), 
  check("pass").not().isEmpty().trim().escape().isLength({min: 8, max:100}).withMessage("Password must be >=8 <=100 chars")],
  function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    bcrypt.hash(req.body.pass, 10, function(err, hash){
      var params = {pass: hash, user : req.body.user}
      //"CREATE (s:Buoy {uuid : 'd2b358ee-b58d-11ed-afa1-0242ac120002'})<-[:ACCESS]-(u)-[:ACCESS]->(s1:Buoy {uuid : 'b5d89482-b58d-11ed-afa1-0242ac120002'}) " +
      var query = "MATCH (h:Buoy) " +
      "WHERE h.private = false " +
      "MERGE (h)<-[:ACCESS {uuid: randomUUID(), uploads : 0, rank : 1, dmca : false, description : false, invites : false, rankTitle: 'Bronze'}]-" + 
      "(u:User {uuid: apoc.create.uuid(), user : $user, pass: $pass, totalDown : 0, totalUp : 0}) " +
      //"SET u.buoys = buoys " +
      "RETURN u"
      session.run(query,params).then(data=>{
        session.close();
        console.log("Created User: " + req.body.user);
        console.log(util.inspect(data))
        req.login(data.records[0]._fields[0].properties, function(err){
          if(err){
            return res.json({errors: [{msg: err}]})
          }
          else{
            return res.json({user:req.user, buoys: req.user.buoys, invite_buoys : req.user.invite_buoys, invite_uuids: req.user.invite_uuids});
          }
        })
      })
      .catch(function(err){
        if(err.code === "Neo.ClientError.Schema.ConstraintValidationFailed"){
          err = "Username already exists"
          return res.json({errors: [{msg : err}]})
        }
        console.log("NEO4J ERROR: " + err);
        return res.json({errors: [{msg : err}]})
      })
    })

})

app.get("/user/:uuid", [check("uuid").not().isEmpty().trim().escape()], function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  var self;
  if(req.user){
    if(req.user.uuid === req.params.uuid){
      self=true;
    }
  }
  const session = driver.session()
  var query = "MATCH (h:Buoy)<-[:ACCESS]-(u:User {uuid : $uuid}) " +
  "OPTIONAL MATCH (u)-[i:INVITED]->(ha:Buoy) " +
  "RETURN collect(h), u, i, ha"
  var params = {uuid : req.params.uuid}

  session.run(query,params).then(data=>{
    session.close();
    if(data.records[0] && data.records[0]._fields[1]){
    return res.json({user : data.records[0]._fields[1].properties, buoys: data.records[0]._fields[0].properties, invite_buoys : 
    data.records[0]._fields[3] ? data.records[0]._fields[3].properties : null, invite_uuids : data.records[0]._fields[2] ? data.records[0]._fields[2]
    .properties : null, self : self});
    }
    else{
      return res.end();
    }
  })
  /*var query = "MATCH (u:User {uuid: $uuid}) "
  "RETURN u"

  var params = {uuid : req.params.uuid};

  session.run(query,params).then(data=>{
    if(!data || data.records.length === 0){
      return res.json({errors : [{msg: "User not found."}]})
    }
    else{
      return res.json({user: data.records[0]._fields[0].properties})
    }
  }).catch(function(err){
    return res.json(err);
  })*/

})


function canInvite(req, res, next){
  console.log(util.inspect(req.user))
 //additional db call just for invites
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()
  var query = "MATCH (:User {uuid: $user})-[a:ACCESS]->(:Buoy{uuid:$buoy}) " +
  "RETURN a.invites"
  var params = {user : req.user.uuid, buoy : req.body.buoy}
  session.run(query,params).then(data=>{
    if(data.records[0]){
      return next();
    }
    else{
      return res.json({errors : [{msg : "401"}]})
    }  
  })
  
}

function isAuthenticated(req, res, next) {
            // request and response objects
    if (req.isAuthenticated()){
        return next();
    }
    // not authenticated then redirect to the login page
    console.log("Is not authenciated when should be")
    return res.json({errors : [{msg : "401"}]})
}

function isNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    console.log("Is authenticated when should not be")
    return res.json({errors :[{msg : "401"}]});
  }
  next();
}

function buoyPermission(req,res,next){
  if(req.isAuthenticated){
    if(req.user.buoys.includes(req.query.buoy)){
      return next();
    }
    else{
      return res.json({errors :[{msg : "401"}]});

    }
  }
  else{
    if(public_buoys.includes(req.query.buoy)){
      return next();
    }
    else{
      return res.json({errors : [{msg : "401"}]});
    }
  }
}


app.post("/logout", isAuthenticated, function(req,res,next){
  req.logout(function(err){
    if(err) {
      console.log(err);
      return next(err);
    }
    console.log("LOGGED OUT");
    return res.end();
  })
})

app.post("/login", [check("user").not().isEmpty().trim().escape().isLength({max:55}).isAlphanumeric().toLowerCase(), 
  check("pass").not().isEmpty().trim().escape().isLength({min: 8, max:100})],
  passport.authenticate('local'), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    console.log("LOGGED IN: " + util.inspect(req.user.uuid));
    return res.json({user: req.user});
    
})

app.get("/auth", function(req,res){
  return res.json({user : req.user})
})

/*app.get("/buoy/:uuid", check("uuid").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  console.log("HARBOR : " + req.params.uuid);
  const session = driver.session()


    var params = {uuid : req.params.uuid}
    var query = "OPTIONAL MATCH (h:Buoy {uuid: $uuid}) " + 
    "RETURN h"
    session.run(query,params).then(data=>{
      session.close();
      console.log(util.inspect(data.records[0]._fields));
      if(data.records[0].fields)
        return res.json({buoy : data.records[0]._fields[0].properties})   
      else 
        return res.end();
    })
})*/

app.get("/buoys", function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("ERRORS IN HARBORS")
    return res.json({ errors: errors.array() });
  }

  const session = driver.session();
  console.log("RETREIVING HARBORS!");
  var user;
  if(req.user){
    user = req.user.uuid;
  }
  else{
    user = "null";
  }
  var params = {user : user};
  var query = "MATCH (h:Buoy)<-[:ACCESS]-(:User {uuid:$user}) " +
  "RETURN h"

  session.run(query,params).then(data=>{
    console.log(util.inspect(data.records))
    session.close();
    console.log("RECORDS! " + util.inspect(data.records))
    return res.json({buoys : data.records})
  })
})

app.get("/buoy/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session();
  var query = "OPTIONAL MATCH (h:Buoy {uuid  : $uuid}) " +
  "OPTIONAL MATCH (h)<-[a:ACCESS]-(u:User {uuid : $user}) " +
  "RETURN h, a, u"
  var user;
  if(!req.user){
    user = "null"
  }
  else{
    console.log("REQ USER"  + req.user.uuid)
    user = req.user.uuid;
  }
  var params = {uuid : req.params.uuid, user : user};
  session.run(query,params).then(data=>{
    session.close();
    console.log(util.inspect(data.records))
    return res.json({buoy : data.records[0]._fields[0] ? data.records[0]._fields[0].properties : null, access: data.records[0]._fields[1] ? 
      data.records[0]._fields[1].properties : null})
  })
})


app.post("/buoy", check("private").trim().escape().not().isEmpty(),
  check("buoy").trim().escape().not().isEmpty().isLength({max:55}).withMessage("Max length 55 chars"), check("user").not().isEmpty().trim().escape(), isAuthenticated,
  function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    const session0 = driver.session();
    var query0 = "MATCH (h:Buoy {buoy : $buoy}) " + 
    "RETURN h"

    var params0 = {buoy : req.body.buoy};
    session0.run(query0,params0).then(data=>{ 
      if(data.records.length > 0){
        return res.json({errors : {msg : "Buoy name already exists in our Library!"}})
      }
      else{
        var priv = req.body.private === "private" ? true : false;
        var query = "MATCH (ua:User {uuid :$user}) " +
        "MATCH (u:User) " +
        "MERGE (h:Buoy {private : $private, buoy : $buoy, types : ['Nonfiction', 'Fiction', 'Holy Book', 'Journal', 'Classical Music', 'Documentary'], " +
        "media : ['Ebook', 'Audiobook', 'Single', 'Album', 'Feature Film'], " + 
        "formats : ['PDF', 'mp3', 'FLAC', 'mkv'], bulletin_title : [], bulletin_text : []" + 
        "})" + 
        "SET h.uuid = randomUUID() " + 
        "WITH {uuid : h.uuid, buoy : h.buoy} AS buoy, h, ua, u " +
        "FOREACH(i in CASE WHEN NOT h.private THEN [1] ELSE [] END | " +
          "MERGE (u)-[:ACCESS {rank:1, rankTitle:'Bronze', description:false, invites:false}]->(h)) " +
        "MERGE (h)<-[a:ACCESS {invites: true, description:true}]-(ua) " +
        "RETURN buoy"
        var params = {private : priv, buoy : req.body.buoy, user : req.user.uuid}
        session.run(query,params).then(data=>{

          session.close();
          console.log("LEN: " + data.records.length)
          if(!req.body.private)

            public_buoys.push(data.records[0]._fields[0].uuid);
          return res.json({buoy : data.records[0]._fields[0]})
        })
      }
    })
    
})


function promote(access){
  var rank;
  var rankTitle;
  var invites;
  var description;
  var dmca;
  var promoted;
  if(access.rank !== 0){
    if(access.uploads === 25){
      rank = 2;
      rankTitle = "Silver";
      invites = true;
      description = false;
      dmca = false;
      promoted = true;
    }
    else if(access.uploads === 100){
      rank = 3;
      rankTitle = "Gold";
      invites = true;
      description = true;
      dmca = false;
      promoted = true;
    }
    else if(access.uploads === 500){
      rank = 4;
      rankTitle = "Guardian";
      invites = true;
      description = false;
      dmca = true;
      promoted = true;
    }
  }
  if(promoted){
    var session=driver.session();
    var query = "MATCH [a:ACCESS {uuid : $uuid}] " +
    "SET a.rank = $rank, a.rankTitle = $rankTitle, a.invites = $invites, a.description = $description, a.dmca = $dmca "
    var params = {uuid: access.uuid, rank : rank, rankTitle : rankTitle, invites : inites, description : description, dmca :dmca}
    session.run(query,params).then(data => {
      session.close();
    })
  }

}

app.post("/update_health", check("totalDown").trim().escape(), check("totalUp").trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var user = req.user ? req.user.uuid : "null";
    var params = {totalDown : parseInt(req.body.totalDown), totalUp : parseInt(req.body.totalUp), ratio : parseFloat(req.body.ratio), user : user}
    var query = "MATCH (u:User { uuid : $user }) " +
    "SET u.totalDown = u.totalDown + $totalDown, u.totalUp = u.totalUp + $totalUp " +
    "RETURN u.totalDown, u.totalUp"
    session.run(query,params).then(data=>{
      session.close();
      return res.json({totalDown : data.records[0]._fields[0], totalUp : data.records[0]._fields[1]})
    })
})

app.post("/invite/:uuid", check("uuid").not().isEmpty().trim().escape(), check("buoy").not().isEmpty().trim().escape(), isAuthenticated, canInvite, 
  function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var params = {uuid : req.params.uuid, buoy : req.body.buoy};
    var query = "MATCH (u:User {uuid:$uuid}) " +
    "MATCH (h:Buoy {uuid:$buoy}) " +
    "MERGE (h)<-[:INVITED {uuid : randomUUID()}]-(u) "
    session.run(query, params).then(data => {
      session.close();
      return res.end();
    })
})

app.post("/accept_invite", check("invite").not().isEmpty().trim().escape(), isAuthenticated, function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var params = {invite : req.query.invite, user : req.user.uuid};
    var query = "MATCH (u:User {uuid : $user})-[i:INVITED { uuid : $invite}]->(h:Buoy) " +
    "MERGE (u)-[:ACCESS]->(h) " +
    "DELETE i " +
    "RETURN h"
    session.run(query,params).then(data=>{
      session.close();
      return res.json({buoy : data.records[0]._fields[0].properties.uuid})
    })
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});
/*
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});*/

app.listen(port);
console.log('Server started at http://localhost:' + port);