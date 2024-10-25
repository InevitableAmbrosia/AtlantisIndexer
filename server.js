import express from 'express';

import Web3 from 'web3'

import puppeteer from "puppeteer";

import dotenv from "dotenv"

dotenv.config();

import axios from 'axios'

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
          invite_uuids : data.records[0]._fields[3], atlsd : data.records[0]._fields[0].properties.atlsd})      
    
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

import atlsd from "./js/atlsd.js"


//import web_torrent from "./js/webtorrent.js"

import getTransactionReceiptMined from "./js/cryptoHash.js";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

import path from 'path';

import bodyParser from 'body-parser'


app.use( bodyParser.json({limit : "50mb"}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit : "50mb"
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


// The main search function
var google_web_search = function(search, callback) {
    console.log('Searching the web for: ', search);
    var options = {
        method: 'GET',
        url: 'https://www.googleapis.com/customsearch/v1',
        qs: {
            q: search,
            key: 'AIzaSyBxghksAFQZ7yIbEJ5a_h7xAZ_Iu4J9Xfo',
            cx: 'f73e8c767efda439d',
        }
    };

    request(options, function (error, response, body) {
        callback(error, body);
    });
};


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
        return cb(null, {uuid: data.records[0]._fields[0].properties.uuid, atlsd: data.records[0]._fields[0].properties.atlsd, pass : data.records[0]._fields[1],
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

app.get("/download_class", check("uuid").trim().escape(), function(req,res){
const session = driver.session();
  
  var query = "MATCH (t:Torrent)-[]-(e:Edition)-[]-(s:Source)<-[:TAGS]-(c:Class {uuid: $uuid}) WHERE t.USD_price <= 0 " +
  "MATCH (s)-[]-(a:Author) " +
  "RETURN t.infoHash, s, collect(DISTINCT a), e"

  var params = {uuid :req.query.uuid}
  session.run(query,params).then(data=>{
    session.close();
    return res.json({records: data.records});
  })
})

app.get("/download_author", check("uuid").trim().escape(), function(req,res){
  const session = driver.session();
  
  var query = "MATCH (t:Torrent)-[]-(e:Edition)-[]-(s:Source)<-[]-(a:Author {uuid :$uuid}) WHERE t.USD_price <= 0 " +
  "MATCH (s)-[]-(a:Author) " +
  "RETURN t.infoHash, s, collect(DISTINCT a), e "

  var params = {uuid : req.query.uuid}
  session.run(query,params).then(data=>{
    session.close();
    return res.json({records: data.records});
  })
})

app.get("/download_source", function(req,res){
  const session = driver.session();
  
  var query = "MATCH (t:Torrent)-[]-(e:Edition)-[]-(s:Source {uuid : $uuid}) WHERE t.USD_price <= 0 " +
  "MATCH (s)-[]-(a:Author) " +
  "RETURN t.infoHash, s, collect(DISTINCT a), e "

  var params = {uuid : req.query.uuid}
  session.run(query,params).then(data=>{
    session.close();
    return res.json({records: data.records});
  })
})

app.post("/download_page", check("all").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  var infoHashes = JSON.parse(he.decode(req.body.all));
  var params = {infoHashes : infoHashes}
  var session = driver.session();
  var query = "MATCH (t:Torrent) WHERE t.uuid IN $infoHashes " +
  "SET t.snatches = t.snatches + 1 " +
  "WITH t " +
  "MATCH (e:Edition)-[]-(t) " +
  "SET e.snatches = e.snatches + 1 " +
  "WITH t " +
  "MATCH (t)-[]-(e:Edition)-[]-(s:Source) " +
  "SET s.snatches = s.snatches + 1 " +
  "WITH t " +
  "MATCH (t)-[]-(e:Edition)-[]-(s:Source)-[]-(c:Class) " +
  "SET c.snatches = c.snatches + 1 " +
  "RETURN t.infoHash" 
  session.run(query,params).then(data=>{
    return res.json({all : data.records})
  })
})

app.get("/download_all", function(req,res){
  const session = driver.session();
  
  var query = "MATCH (t:Torrent)-[]-(e:Edition)-[]-(s:Source) WHERE t.USD_price <= 0 " +
  "MATCH (s)-[]-(a:Author) " +
  "RETURN t.infoHash, s, collect(DISTINCT a), e "

  var params = {}
  session.run(query,params).then(data=>{
    session.close();
    return res.json({records: data.records});
  })
})

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
    session.close();
    return data.records.map(buoy => buoy._fields[0].properties.uuid);
  })
}

/*import nodeCron from "node-cron"

nodeCron.schedule('0 0 * * *', () => {
  var query = "MATCH (t:Torrent)-[:UPLOADED]-(u:User) WHERE u.atlsd IS NOT NULL AND t.mintChecked = false AND " +
  " t.ETH_address IS NOT NULL AND t.numPeers >= 2 " +
  "SET t.mintChecked = true "+
  "RETURN u.uuid, u.atlsd"
  var params = {}
  var session = driver.session();
  session.run(query,params).then(data=>{
    if(data.records && data.records.length > 1){
      data.records.forEach(function(record){
        atlsd.mintUpload(axios, Web3, driver, record._fields[0], record._fields[1], null, 1)
      })
    }
  })

});*/

//web_torrent.initializeScrapePeers(driver);
/* MINTUPLOAD TEST */
//atlsd.mintUpload(axios, Web3, driver, "47a4a7f5-4992-404e-a88e-964b77721995", "0x68663EB789CB1b20eBa9F693fdf927Dc195DB114", "467fd57c73d316b11aa92c7e485cbad1048c5f14")

//puppeteer.use(puppeteerExtraPluginStealth())

const amazonIsbnSearchUrl = (isbn, author) =>
"https://www.amazon.com/s?i=stripbooks&rh=p_27%3A" + author + " %2Cp_28%3A" + isbn + "&s=relevanceexprank&Adv-Srch-Books-Submit.x=31&Adv-Srch-Books-Submit.y=16&unfiltered=1&ref=sr_adv_b"

function parseSrcset(srcset) {
  if (!srcset) return null;
  return srcset
    .split(", ")
    .map((d) => d.split(" "))
    .reduce((p, c) => {
      if (c.length !== 2) {
        // throw new Error("Error parsing srcset.");
        return;
      }
      p[c[1]] = c[0];
      return p;
    }, {});
}

async function scrape(isbn, author, options = {}) {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 800, height: 600, deviceScaleFactor: 3 },
    args : ['--no-sandbox', '--disable-setuid-sandbox'],
    ...options
  });
  const page = await browser.newPage();
  await page.setCacheEnabled(false)
  await page.goto(amazonIsbnSearchUrl(isbn, author));
  const images = await page.$$(".s-image");
  const srcsets = [];
  if (images.length > 0) {
    for (let image of images) {
      const element = await image.asElement();
      const propertyHandle = await element.getProperty("srcset");
      const propertyValue = await propertyHandle.jsonValue();
      if(propertyValue){
        srcsets.push(propertyValue);

      }
    }
  }
  await browser.close();
  const thumbs = srcsets.map(parseSrcset).filter((a) => !!a);
  return thumbs.length > 0 ? thumbs[0] : null;
}

let previousRequest = Promise.resolve();

async function get(isbn, author, options = {}) {
 
  // queue requests
  const executeFetch = () => {
    return scrape(isbn, author, options)
      .then((data) => {
        return data;
      })
      .catch((e) => {
        throw e;
      });
  };
  previousRequest = previousRequest.then(executeFetch, executeFetch);
  const data = await previousRequest;
  //TEMP
  var session = driver.session();
  var query = "MATCH (s:Source {title:$title}) " +
    "SET s.imgSrc = $cover"
  var params = {cover: data ? data["1x"] : "", title: isbn}
  session.run(query,params).then(data=>{
    session.close();
  })
  return data;
}

async function open(title, author){
  //
  const browser = await puppeteer.launch({
    defaultViewport: { width: 800, height: 600, deviceScaleFactor: 3 }
  });
  const srcsets = [];
  const page = await browser.newPage();
  await page.setCacheEnabled(false)
  await page.goto("https://openlibrary.org/search?title=" + title + "&author=" + author);
  const imgs = await page.$$eval('.bookcover a img', imgs => imgs.map(img => img.getAttribute('src')));
      /*if(propertyValue){
        srcsets.push(propertyValue);

    }

    function parseSrcset(srcset) {
      if (!srcset) return null;
      return srcset
        .split(", ")
        .map((d) => d.split(" "))
        .reduce((p, c) => {
          if (c.length !== 2) {
            // throw new Error("Error parsing srcset.");
            return;
          }
          p[c[1]] = c[0];
          return p;
        }, {});
    }
    await browser.close();
    const thumbs = srcsets.map(parseSrcset).filter((a) => !!a);*/
    //return thumbs.length > 0 ? thumbs[0] : null; 
    if(imgs[0]){
      imgs[0] = imgs[0].substring(2);
      imgs[0] = "http://www." + imgs[0];
      var session = driver.session();
      var query = "MATCH (s:Source {title:$title}) " +
        "SET s.imgSrc = $cover"
      var params = {cover: imgs[0], title: title} 
      session.run(query,params).then(data=>{
        console.log(title, imgs[0])
        session.close();
        return imgs[0];
      })
    }    
    
  
  /*const element = await img.asElement();
  const src = await element.getProperty("src");
  console.log(src)
  return src;*/
}

function isKing(req,res,next){
  var query = "MATCH (u:User {uuid : $uuid})-[a:ACCESS]->(b:Buoy{uuid : 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
  "RETURN a.rankTitle "
  var params = {uuid : req.user.uuid};
  var session = driver.session();
  session.run(query,params).then(data=>{
    session.close();
    if(data.records && data.records.length > 0 && data.records[0]._fields[0] === "Philosopher King"){
      console.log("PHILOSOPHER KING CHECKING INVITES")
      return next();
    }
    else{
      console.log("NO KING!")
      return res.json({errors : [{msg : "401"}]})
    }
  })
}

app.get("/stats", function(req,res){
  const session = driver.session()
  var query = ""
  query += "MATCH (s:Source {title:'BENZA GURU!'}) "
  query += "WITH s "
  query += "MATCH (t:Torrent) "
  query += "WITH count(t) AS numTorrents, sum(t.snatches) AS snatches, s "
  query += "MATCH (so:Source) "
  query += 'WITH count(so) as numSources, snatches, numTorrents, s '
  query += 'MATCH (e:Edition) '
  query += "WITH count(e) as numEditions, snatches, numTorrents, numSources, s "
  query += "MATCH (u:User) "
  query += "WITH count(u) AS numUsers, numSources, snatches, numEditions, numTorrents, s "
  query += "MATCH (c:Class) "
  query += "WITH count(c) AS numClasses, s, numSources, snatches, numTorrents, numUsers " 
  query += "MATCH (a:Author) "
  query += "RETURN s, numSources, snatches, numTorrents, numUsers, numClasses, count(a)"
  var params = {}
  session.run(query,params).then(data=>{
    if(data.records && data.records[0]){
      return res.json({source: data.records[0]._fields[0], 
                       numAuthors: data.records[0]._fields[6],
                      snatches: data.records[0]._fields[2],
                      numTorrents: data.records[0]._fields[3],
                      numUsers: data.records[0]._fields[4],
                      numClasses: data.records[0]._fields[5]})
    }    
    else{
      return res.end();
    }
  })
})

app.post("/accept/:uuid", isAuthenticated, isKing, check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  var session = driver.session();
  var query = "MATCH (i:Invite {uuid : $uuid}) " + 
  "WITH i, i.user AS user " +
  "DELETE i " +
  "WITH user " +
  "MATCH (u:User {uuid : user}) " +
  "SET u.accepted = true"

  var params = {uuid : req.params.uuid};
  session.run(query,params).then(data=>{
    session.close();
    res.end();
  })
})

app.get("/invite_requested", function(req,res){
  var session = driver.session();
  var query = "MATCH (i:Invite {user: $user}) " +
  "RETURN i"
  if(!req.user){
    return res.json({requested : false})
  }
  var params = {user : req.user ? req.user.uuid : "null" }
  console.log(params.user);
  console.log("THERE")
  session.run(query,params).then(data=>{
    session.close();
    if(data.records && data.records[0]){
      console.log("HERE " + data.records[0])
      return res.json({requested: true})
    }
    else{
      console.log("REQUESTED FALSE");
      return res.json({requested : false})
    }  
      
  })
})


app.post("/reject/:uuid", isAuthenticated, isKing, check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  var session = driver.session();
  var query = "MATCH (i:Invite {uuid : $uuid}) " + 
  "WITH i, i.user AS user " +
  "DELETE i " +
  "WITH user " +
  "MATCH (u:User {uuid : user}) " +
  "SET u.accepted = false"
  var params = {uuid : req.params.uuid};
  console.log(params.uuid)

  session.run(query,params).then(data=>{
    session.close();
    res.end();
  })
})


app.get("/get_invites", isAuthenticated, isKing, function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  var query = "MATCH (i:Invite) " +
  "RETURN i"
  var params = {}
  var session = driver.session();
  session.run(query,params).then(data=>{
    try{
      session.close();
      console.log(util.inspect(data.records))
      res.json({invites : data.records})
    }
    catch(err){
      session.close();
      console.log("GET INVITES ERR")
      res.end();
    }
  })
})

app.post("/request_invite", isAuthenticated, check("why").trim().escape().not().isEmpty().isLength({max: 1000}),
 check("bt").trim().escape().not().isEmpty().isLength({max: 1000}), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  var query = "MERGE (i:Invite {why : $why, bt: $bt, user : $user, uuid : randomUUID(), userName : $userName})"
  var params = {why: req.body.why, bt: req.body.bt, user: req.user ? req.user.uuid : "null", userName : req.user ? req.user.user : "Anonymous"};
  var session = driver.session();
  console.log("HERE");
  session.run(query,params).then(data=>{
    session.close();
    if(params.user === "null"){
      res.json({errors : [{msg:"You must be logged in to use this feature!"}]});
    }
    else{
      res.json({success : true})
    }
  })
 })

app.get("/source_cover/:title", check("title").trim().escape().not().isEmpty(), check("author").trim().escape(), async function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    //var  cover = await open(req.params.title, req.query.author);
    //if(!cover){
       var cover = await get(req.params.title, req.query.author)["1x"];
    //}
    res.json({cover : cover})
    //})
})

app.post("/google_img/:uuid", check("uuid").trim().escape().not().isEmpty(), check("img").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
  var query = "MATCH (s:Source {uuid : $uuid}) " +
  "SET s.imgSrc = $img"
  var params = {img : req.body.img, uuid : req.params.uuid}
  var session = driver.session();
  session.run(query,params).then(data=>{
    session.close();
    return res.end();
  })
})

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
      case "user_uploads":
        st_george.recommendUserUpload(driver, req.query.uuid, function(data){
          if(data.records && data.records[0]){
            return res.json({user : data.records[0]._fields[0].properties})
          }
          else{
            return res.json({errors : [{msg : "There is no user to recommend in the graph database!"}]})
          }
          console.log(data.records);
        })
        break;
      case "user_downloads":
        st_george.recommendUserDownload(driver, req.query.uuid, function(data){
          if(data.records && data.records[0]){
            return res.json({user : data.records[0]._fields[0].properties})
          }
          else{
            return res.json({errors : [{msg : "There is no user to recommend in the graph database!"}]})
          }
        })
        break;
      
      default :
        return res.end();
        break
    }   
})

app.post("/edit_select", check("media").not().isEmpty().trim().escape(), 
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

    var params = {types : types, media: media, formats : formats};
    var query = "MATCH (b:Buoy {uuid: 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
    "SET b.types = $types, b.media = $media, b.formats = $formats"

    session.run(query, params).then(data => {
      session.close();
      return res.end();
    })
  })

app.post("/graph_search", check("class_all").trim().escape().isLength({max:100}), check("title").trim().escape().isLength({max: 400}),
 check("author").trim().escape().isLength({max: 200}), check("classes").trim().escape().isLength({max:1251}),
  check("publisher").trim().escape().isLength({max: 612}), check("type").trim().escape().isLength({max:200}), check("media").trim().escape().isLength({max:350}),
  check("format").trim().escape().isLength({max:360}), function(req,res){
    console.log("HERE!!!!", validationResult(req))
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var query = ""
    if(req.body.title && req.body.type === "all"){
      console.log("THERE!!!")
      query += "CALL db.index.fulltext.queryNodes('titles', $title) YIELD node " +
      "MATCH (s:Source) WHERE s.uuid = node.uuid "
    }
    else if(req.body.title && req.body.type !== "all"){
      query += "CALL db.index.fulltext.queryNodes('titles', $title) YIELD node " +
      "MATCH (s:Source {type : $type}) WHERE s.uuid = node.uuid "
    }
    else if(!req.body.title && req.body.type !== "all"){
      query += "MATCH (s:Source {type : $type}) "
    }
    else{
      query += "MATCH (s:Source) "
    }
    query += "WITH s " 
    if(req.body.author){
      query += "CALL db.index.fulltext.queryNodes('authorSearch', $author) YIELD node " +
      "MATCH (a1:Author)-[:AUTHOR]->(s) WHERE a1.uuid = node.uuid " + 
      "OPTIONAL MATCH (a:Author)-[:AUTHOR]->(s) "
    }
    else{
      query += "OPTIONAL MATCH (a:Author)-[]->(s) "
    }
    query += "WITH s, a "
    if(req.body.publisher){
      query += "CALL db.index.fulltext.queryNodes('publisher', $publisher) YIELD node " +
        "MATCH (e:Edition)-[]-(s) WHERE e.publisher = node.publisher "
      }
    else{
      query += "OPTIONAL MATCH (e:Edition)<-[:PUB_AS]-(s) " 

    }
  query += "WITH s "
  if(req.body.media !== "all" && req.body.format !== "all"){
    query += "MATCH (t:Torrent {media: $media, format:$format})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else if(req.body.media !== "all"){
    query += "MATCH (t:Torrent {media: $media})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else if(req.body.format !== "all"){
    query += "MATCH (t:Torrent {format:$format})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else{
    query += "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  query+= "WITH s " 
  if(req.body.classes){
    var classes = JSON.parse(he.decode(req.body.classes)).split(",");
    if(classes[0] === ['']){
      classes = []
    }
    else{
      for (var i = 0; i < classes.length; i++) {
       classes[i] = he.decode(classes[i].trim()).replace(/['"]+/g, '')
      }  
    }
    console.log(req.body.class_all)
    if(req.body.class_all === "true"){
      query += "MATCH (c1:Class) WHERE c1.name IN $classes "+ 
      "WITH s, collect(c1) as classes " +
      "WITH s, head(classes) as head, tail(classes) as classes " +
      "MATCH (head)-[:TAGS]->(s) " +
      "WHERE ALL(c1 in classes WHERE (c1)-[:TAGS]->(s)) "
    }
    else{
      query += "WITH s " +
      "MATCH (c1:Class)-[:TAGS]->(s) WHERE c1.name IN $classes "
    }
  
    query += "WITH s ORDER BY s.created_at LIMIT 2000 " +
              "CALL {"+
                "WITH s "+
                "MATCH (s)-[]-(a:Author) " +
                "RETURN a " +
                "LIMIT 1000 " +
              "}" +
               "CALL {"+
                "WITH s, a "+
                "MATCH (s)-[]-(c:Class) " +
                "RETURN c " +
                "LIMIT 1000 " +
              "}"+
              'RETURN s, c, a'

    
    
  }
  else{
   query += "WITH s ORDER BY s.created_at LIMIT 2000 " +
              "CALL {"+
                "WITH s "+
                "MATCH (s)-[]-(a:Author) " +
                "RETURN a " +
                "LIMIT 1000 " +
              "}" +
               "CALL {"+
                "WITH s, a "+
                "MATCH (s)-[]-(c:Class) " +
                "RETURN c " +
                "LIMIT 1000 " +
              "}"+
              'RETURN s, c, a'
  }
  console.log(query);
  var params = {skip : req.body.start, limit : req.body.length, title : req.body.title, author :req.body.author, 
  classes: classes, publisher : req.body.publisher, type : req.body.type, media: req.body.media, format : req.body.format}
  console.log(params.classes)

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

app.post("/advanced_search", check("class_all").trim().escape().isLength({max:100}), check("title").trim().escape().isLength({max: 400}),
 check("author").trim().escape().isLength({max: 200}), check("classes").trim().escape().isLength({max:1251}),
  check("publisher").trim().escape().isLength({max: 612}), check("type").trim().escape().isLength({max:200}), check("media").trim().escape().isLength({max:350}),
  check("format").trim().escape().isLength({max:360}), function(req,res){
    console.log("HERE!!!!", validationResult(req))
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var query = ""
    if(req.body.title && req.body.type === "all"){
      console.log("THERE!!!")
      query += "CALL db.index.fulltext.queryNodes('titles', $title) YIELD node " +
      "MATCH (s:Source) WHERE s.uuid = node.uuid "
    }
    else if(req.body.title && req.body.type !== "all"){
      query += "CALL db.index.fulltext.queryNodes('titles', $title) YIELD node " +
      "MATCH (s:Source {type : $type}) WHERE s.uuid = node.uuid "
    }
    else if(!req.body.title && req.body.type !== "all"){
      query += "MATCH (s:Source {type : $type}) "
    }
    else{
      query += "MATCH (s:Source) "
    }
    query += "WITH s " 
    if(req.body.author){
      query += "CALL db.index.fulltext.queryNodes('authorSearch', $author) YIELD node " +
      "MATCH (a1:Author)-[:AUTHOR]->(s) WHERE a1.uuid = node.uuid " + 
      "OPTIONAL MATCH (a:Author)-[:AUTHOR]->(s) "
    }
    else{
      query += "OPTIONAL MATCH (a:Author)-[]->(s) "
    }
    query += "WITH s, a "
    if(req.body.publisher){
      query += "CALL db.index.fulltext.queryNodes('publisher', $publisher) YIELD node " +
        "MATCH (e:Edition)-[]-(s) WHERE e.publisher = node.publisher "
      }
    else{
      query += "OPTIONAL MATCH (e:Edition)<-[:PUB_AS]-(s) " 

    }
  query += "WITH s,a,e "
  if(req.body.media !== "all" && req.body.format !== "all"){
    query += "MATCH (t:Torrent {media: $media, format:$format})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else if(req.body.media !== "all"){
    query += "MATCH (t:Torrent {media: $media})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else if(req.body.format !== "all"){
    query += "MATCH (t:Torrent {format:$format})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else{
    query += "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  query+= "WITH s,a,e,t, {USD_price : t.USD_price, copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " 
  if(req.body.classes){
    var classes = JSON.parse(he.decode(req.body.classes)).split(",");
    if(classes[0] === ['']){
      classes = []
    }
    else{
      for (var i = 0; i < classes.length; i++) {
       classes[i] = he.decode(classes[i].trim()).replace(/['"]+/g, '')
      }  
    }
    console.log(req.body.class_all)
    if(req.body.class_all === "true"){
      query += "MATCH (c:Class)-[:TAGS]->(s) " +
      "WITH s,a,e,t,c,torrent " +
      "MATCH (c1:Class) WHERE c1.name IN $classes "+ 
      "WITH s,a,e,t,c,torrent, collect(c1) as classes " +
      "WITH s,a,e,t,c,torrent,head(classes) as head, tail(classes) as classes " +
      "MATCH (head)-[:TAGS]->(s) " +
      "WHERE ALL(c1 in classes WHERE (c1)-[:TAGS]->(s)) "
    }
    else{
      query += "MATCH (c:Class)-[:TAGS]->(s) " + 
      "WITH s,a,e,t,c,torrent " +
      "MATCH (c1:Class)-[:TAGS]->(s) WHERE c1.name IN $classes "
    }
  
    query += "WITH s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c, count(s) AS count "
    //query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "  
    
    
  }
  else{
    query += "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " 
    query += "WITH s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c, count(s) AS count "
    //query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
  }
  switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
  console.log(query);
  var params = {skip : req.body.start, limit : req.body.length, title : req.body.title, author :req.body.author, 
  classes: classes, publisher : req.body.publisher, type : req.body.type, media: req.body.media, format : req.body.format}
  console.log(params.classes)

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

app.get("/advanced_search_ui", function(req,res){
  const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    console.log("HERE!!!!!!!!!!!!!!!!!!!!!!!")
    var params = {}
    var query = "MATCH (b:Buoy {uuid : 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " + 
    "RETURN b"
    session.run(query,params).then(data=>{
      session.close();
      console.log(util.inspect(req.user))
      return res.json({buoy : data.records[0]._fields[0].properties, atlsd : req.user ? req.user.atlsd : ""})
    })
})

app.get("/upload_structure", function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var params = {buoy : req.params.buoy}
  var query = "MATCH (b:Buoy {uuid : 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " + 
  "RETURN b"
  session.run(query,params).then(data=>{
    session.close();
    console.log(util.inspect(req.user))
    return res.json({buoy : data.records[0]._fields[0].properties, atlsd : req.user ? req.user.atlsd : ""})
  })
})


app.post("/bulletin", check("text").not().isEmpty().trim().escape(), check("title").not().isEmpty().trim().escape(),
  isAuthenticated, canBulletin, function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var params = {buoy : req.params.buoy, title : req.body.title, text : req.body.text}

  var query = "MATCH (b:Buoy {uuid : 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " + 
  "SET b.bulletin_title = b.bulletin_title + $title " +
  "SET b.bulletin_text = b.bulletin_text  + $text"
  session.run(query,params).then(data=>{
    session.close();
    return res.end();
  })
})

app.post("/bulletin/node", check('text').trim().escape().not().isEmpty(), check('title').trim().escape().not().isEmpty(), isAuthenticated, canBulletin, function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var params = {buoy : req.params.buoy, title : req.body.title, text : req.body.text, userName: req.user ? req.user.user : "Anonymous", userUUID : req.user ? req.user.uuid : "null"}

  var query = "MATCH (b:Buoy {uuid : 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " + 
  "MATCH (u:User {uuid : $userUUID}) " +
  "MERGE (u)-[:POSTED]->(bu:Bulletin {title : $title, text: $text, time: TOFLOAT(TIMESTAMP()), uuid: randomUUID(), userName : $userName, userUUID: $userUUID})<-[:HOME]-(b) "
  session.run(query,params).then(data=>{
    session.close();
    return res.end();
  })
})

function canBulletin(req,res,next){
  console.log(util.inspect(req.user))
 //additional db call just for invites
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()
  var query = "MATCH (:User {uuid: $user})-[a:ACCESS]->(:Buoy{uuid:'d2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
  "RETURN a.bulletin"
  var params = {user : req.user.uuid, buoy : req.body.buoy}
  session.run(query,params).then(data=>{
    session.close();
    if(data.records[0]){
      return next();
    }
    else{
      return res.json({errors : [{msg : "401"}]})
    }  
  })
}

app.get("/search", check("term").trim().escape(), check("field").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()
  
  console.log(req.query.field)


  req.query.term = remove_stopwords(req.query.term);

  var query = "";  
  console.log("HERE");
  console.log(req.query.field)
  switch(req.query.field){
    case "search_sources":
      query += "CALL db.index.fulltext.queryNodes('titles', $sourceName) YIELD node " +
      "MATCH (s:Source) WHERE s.uuid = node.uuid " +
      "RETURN s " 
      break;
    case "search_authors":
      query += "CALL db.index.fulltext.queryNodes('authorSearch', $authorName) YIELD node " +
      "MATCH (a:Author)-[:AUTHOR]->(s:Source) WHERE a.uuid = node.uuid " +
      "RETURN a "
      break;
    case "search_classes":
      query += "CALL db.index.fulltext.queryNodes('classes', $className) YIELD node " +
      "MATCH (c:Class) WHERE c.uuid = node.uuid " +
      "RETURN c " 
      break;
    case "search_publishers":
      query += "CALL db.index.fulltext.queryNodes('publisher', $publisherName) YIELD node " +
      "MATCH (e:Edition)-[]-(s:Source) WHERE e.uuid = node.uuid " +
      "RETURN e "
      break; 
  }

  console.log(query);
  var params = {sourceName : req.query.term, authorName : req.query.term, className : req.query.term, publisherName: req.query.term};
  console.log(params);
  session.run(query , params).then(data => {
      session.close()
      var recordData = []
      if(data.records){
        data.records.forEach(function(data, i){
          if(recordData.find(n=>n.value === (req.query.field === "search_publishers" ? data._fields[0].properties.publisher : 
            data._fields[0].properties.uuid))){
            return;
          }
          switch(req.query.field){
            case "search_sources":
              recordData.push({label : data._fields[0].properties.title, value : data._fields[0].properties.uuid});
              console.log(recordData[0])
              break;
            case "search_authors":
              recordData.push({label : data._fields[0].properties.author, value : data._fields[0].properties.uuid});
              break;
            case "search_classes":
              recordData.push({label : data._fields[0].properties.name, value : data._fields[0].properties.uuid});
              break;
            case "search_publishers":
              recordData.push({label : data._fields[0].properties.publisher, value : data._fields[0].properties.publisher});
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
  "WITH s,a,e,t,count, {USD_price : t.USD_price, copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " +  
  "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
  "WITH s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c, count "
 

 app.get("/infoHash/:uuid", check("uuid").not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  console.log(req.params.uuid);
  var query = "OPTIONAL MATCH (free:Torrent { uuid : $uuid} ) WHERE free.USD_price = 0.0 " +
  "OPTIONAL MATCH (prem:Torrent { uuid :$uuid})<-[:BOUGHT {confirmed : true}]-(u:User{uuid : $userUUID}) " +
  "OPTIONAL MATCH (free)<-[:UPLOADED]-(u:User) " +
  "RETURN free.infoHash, prem.infoHash, u.user"
  var params = {uuid: req.params.uuid, userUUID : req.user ? req.user.uuid : "null"}
  var session = driver.session();
  session.run(query,params).then(data=>{
    console.log('HERE' + data.records[0]);
    session.close();
    if(data.records[0] && (data.records[0]._fields[0] || data.records[0]._fields[1])){
      return res.json({free : data.records[0]._fields[0], prem: data.records[0]._fields[1], user: data.records[0]._fields[2] })
    }
    else{
      return res.end();
    }

  })
 })

 app.get("/page_graph", function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = 'MATCH (s:Source) ' +
              "WITH s ORDER BY s.created_at LIMIT 2000 " +
              "CALL {"+
                "WITH s "+
                "MATCH (s)-[]-(a:Author) " +
                "RETURN a " +
                "LIMIT 1000 " +
              "}" +
               "CALL {"+
                "WITH s, a "+
                "MATCH (s)-[]-(c:Class) " +
                "RETURN c " +
                "LIMIT 1000 " +
              "}"+
              'RETURN s, c, a'


  var params = {uuid : req.params.uuid}
  
  session.run(query , params).then(data => {
      session.close()
      console.log(data.records)
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

app.post("/publisher/:publisher", [check("start").trim().escape(), check("publisher").trim().escape().not().isEmpty(), check("length").trim().escape()], function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  console.log (util.inspect(req.user))
  const session = driver.session()
  console.log("PUBLISHER: " + he.decode(req.params.publisher))

  console.log("here");
  var query = '';

  var params = {};

  query += "MATCH (so:Source)-[]-(e:Edition {publisher : $publisher}) " +
  "WITH count(so) AS count "
  + "MATCH (s:Source)-[]-(e1:Edition {publisher : $publisher}) "
  query += "OPTIONAL MATCH (a:Author)-[]->(s) " + 
  "WITH s, a, e1, count " +  
  "OPTIONAL MATCH (e:Edition)<-[:PUB_AS]-(s) " +
  "WITH s,a,e, e1, count " +
  "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
  "WITH s,a,e, e1, t,count, {USD_price : t.USD_price, copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " +  
  "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
  "WITH s, a, e1, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c, count "
  switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
  params = {skip : req.body.start, limit : req.body.length, publisher : he.decode(req.params.publisher)}
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

app.post("/torrents", [check("start").trim().escape(), check("length").trim().escape()], function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()


  var query = '';

  var params = {};
  console.log("COLUMN: " + util.inspect(req.body.order));
  query += "MATCH (so:Source) " +
  "WITH count(so) AS count "
  + "MATCH (s:Source) "
  query += torrentQuery;
  switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }

  params = {skip : req.body.start, limit : req.body.length}

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
  "WITH s, a, e,  {USD_price: t.USD_price, copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent ,count " +
  "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
  "WITH s,a, collect(DISTINCT {edition: e, torrent: torrent}) AS edition_torrents, c, count "
  switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
  console.log(util.inspect(req.body));

  var params = {skip : req.body.start, limit : req.body.length, uuid : req.params.uuid}

  session.run(query , params).then(data => {
      session.close()
      return res.json({recordsTotal: parseInt(data.records[0]._fields[4]), recordsFiltered: parseInt(data.records[0]._fields[4]), data: data.records});
  })
 
})
/*
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
})*/

app.post("/source/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
   /*const userAgent = req.headers['user-agent'] || ''; // Detects if the request came from a browser or a crawler bot.
    if (isbot(userAgent) && req.params.uuid){
      const session = driver.session();
      var query = "MATCH (t:Torrent)-[]-(e:Edition)-[]-(s:Source {uuid : $uuid})-[]-(a:Author) RETURN s, e, t, a "
      var params = {uuid : req.params.uuid}
      session.run(query,params).then(data=>{
        const raw = fs.readFileSync(path.join(__dirname, '/static/index.html'))
        //if(data.records && data.records[0]){
          const updated = raw.replace('<title>The New Library of The Atlantis</title>', "<meta name='description' content="
          +"'Download" + data.records[0]._fields[2].format + " here!'><title>" + (data.records[0]._fields[3] ? data.records._fields[3].author + " - " : "") + 
          data.records[0]._fields[0].properties.title + "</title>")
          return res.sendFile(updated)
       // }     
        

    })

  }*/
  //else{
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
    "WITH s, a, e,  {copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
    "payment : t.payment, USD_price: t.USD_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
      "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " + 
    "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
    "WITH s, a, collect(DISTINCT{edition: e, torrent: torrent}) AS edition_torrents, c, count(s) AS count "
    switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
    console.log(util.inspect(req.body));

    var params = {uuid : req.params.uuid, skip : req.body.start, limit : req.body.length};

    session.run(query , params).then(data => {
        session.close()
        return res.json({recordsTotal: 1, recordsFiltered: 1, data: data.records});
    })  
//  }
  
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
  var params = {className : he.encode(req.body.name)};
 
  session.run(query , params).then(data => {
      session.close()
      return res.json({uuid : data.records[0]._fields[0]})
  })  
})

app.post("/classes", function(req,res){
  const session = driver.session()

  //two match clauses to count

  var query = "MATCH (cl:Class) " +
    "WITH count(cl) AS count " + 
    "MATCH (c:Class) " +
    "WITH c, count " + 
    "OPTIONAL MATCH (s:Source)<-[:TAGS]-(c) " + 
    "WITH TOFLOAT(count(s)) AS numSources, c, count, c.snatches AS snatches " 
  console.log(req.body.start, req.body.length)
  var params = {skip : req.body.start, limit : req.body.length};

  switch(req.body.order[0].column){
    case '0':
      console.log(req.body.order[0])
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN c, count, numSources, snatches ORDER BY c.name ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 

      }
      else{
        query += "RETURN c, count, numSources, snatches ORDER BY c.name DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 

      }      break;
    
    case '1':
      console.log("HERE2")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN c, count, numSources, snatches ORDER BY numSources ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 

      }
      else{
        query += "RETURN c, count, numSources, snatches ORDER BY numSources DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 
      }
      break;
    case '2':
      console.log("HERE3")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN c, count, numSources, snatches ORDER BY c.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 

      }
      else{
        query += "RETURN c, count, numSources, snatches ORDER BY c.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 

      }
      break;
    default :
      console.log("HERE4")
        query += "RETURN c, count, numSources, snatches ORDER BY numSources DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)" 
        break;


  }
  console.log(query)
  session.run(query , params).then(data => {
    session.close()
    var count = 0;
      console.log(util.inspect(data.records[0]._fields[0]));

    if(data.records && data.records[0]){
      return res.json({recordsTotal: parseInt(data.records[0]._fields[1]), recordsFiltered: parseInt(data.records[0]._fields[1]), data: data.records});
    }
    else{
      return res.json({ errors : [{msg : "Error loading torrents"}]});
    }
  })  

})

app.post("/classes/top", function(req,res){
  const session = driver.session()

  //two match clauses to count
  var query = "WITH DATETIME() - duration('P1D') AS threshold " + 
    "MATCH (c:Class) WHERE c.updated > threshold " +
    "WITH c " +
    "OPTIONAL MATCH (so:Source)<-[:TAGS]-(c) " +
    "WITH TOFLOAT(count(so)) AS numSources, c, c.snatches AS snatches " +
    "RETURN c, 10, numSources, snatches ORDER BY snatches DESC LIMIT 10"
    console.log(req.body.start, req.body.length)
  var params = {time: "P1D", skip : req.body.start, limit : req.body.length};


  session.run(query , params).then(data => {
    session.close()
    if(data.records && data.records[0]){
      return res.json({recordsTotal: 10, recordsFiltered: 10, data: data.records});
    }
    else{
      return res.json({ errors : [{msg : "Error loading torrents"}]});
    }
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
    "RETURN c, count, numSources ORDER BY c.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)"
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
  "WITH s, a, cla, count, e, {copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, USD_price: t.USD_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " +
  "WITH s, a, cla, collect(DISTINCT {edition: e, torrent: torrent}) AS edition_torrents, count "
  switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
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
/*
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
})*/

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

app.get("/upload/:uuid", check("uuid").trim().escape().isLength({max:256}), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }
  const session = driver.session()

  var query = '';
  var params = {};


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
  "MATCH (b:Buoy {uuid: 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
  "RETURN s.title AS title, COLLECT(DISTINCT {uuid: a.uuid, author : a.author}) AS author, COLLECT(DISTINCT c.name) AS classes, s.date AS date, " +
  "collect(DISTINCT edition) AS editions, COLLECT(DISTINCT t) AS torrents, s.type AS type, b"

  params["uniqueID"] = req.params.uuid;

  session.run(query , params).then(data => {
    session.close();
    
    console.log(util.inspect(data.records[0]._fields[4]))
    return res.json({record : data.records[0], captcha: res.recaptcha, atlsd: req.user ? req.user.atlsd : ""});
  })
})

app.post("/web3/:hash", check("hash").not().isEmpty(), check("uuid").not().isEmpty(),
 check("torrentUUID").not().isEmpty(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }
    console.log("HERE /web3 " + req.params.hash);
    if(!req.user){
      return res.end();
    }
    async function getConfirmations(txHash) {
      try {
        // Instantiate web3 with HttpProvider
        const web3 = new Web3("https://mainnet.infura.io/v3/55724cc441884c0c9847056cb17cff21"); //https://mainnet.infura.io/v3/55724cc441884c0c9847056cb17cff21") //'https://rpc2.sepolia.org')

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
      console.log("TORRENT UUID: " + req.query.torrentUUID)
      console.log("UUID: " + req.query.uuid);

    var query = "MATCH (t:Torrent{uuid: $torrentUUID}) " +
    "MATCH (u:User {uuid : $user}) " +
    "MERGE (u)-[b:BOUGHT {uuid : $uuid}]->(t) " + 
    "SET b.hashes = b.hashes + [$hash], b.confirmed = false "
    "RETURN u.user, t.infoHash ";

    var params = {user : req.user, torrentUUID: req.query.torrentUUID, hash: req.params.hash, uuid : req.query.uuid};


    session.run(query,params).then(data=>{
      console.log(util.inspect(data.records[0]))
      session.close();
    });

    confirmEtherTransaction(req.params.hash, 2, 0);

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
      
     
        if(trxConfirmations <= 2 || !trxConfirmations){
          if(trxConfirmations){
            if(Number(trxConfirmations) + Number(trxConfirmations) - Number(prevConfirmations) > 2){
              transaction.trxConfirmations = 2;
            }
             transaction.trxConfirmations += Number(trxConfirmations) - Number(prevConfirmations); 
            }

          
          
          return confirmEtherTransaction(txHash, confirmations, trxConfirmations ? Number(trxConfirmations) : prevConfirmations)
        }
      
    }, 30 * 1000)

    

  }
})

var web3Transactions = [];

app.post("/receipt_confirmed/:uuid", check("transactionHash").not().isEmpty().trim().escape(), check("torrentUUID").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(util.inspect(errors.array()));
    return res.json({ errors: errors.array() });
  }
  var query = "MATCH (t:Torrent{uuid:$torrentUUID}) " +
      "MATCH (u:User {uuid: $user}) " + 
      "MERGE (u)-[b:BOUGHT {uuid : $uuid}]->(t) " +
      "SET b.confirmed = true " + 
      "RETURN t.infoHash "
  var params = {user : req.user ? req.user.uuid : "null", uuid : req.params.uuid, torrentUUID : req.body.torrentUUID}

  var session = driver.session();
  session.run(query,params).then(data=>{
    session.close();

    return res.json({bought: true, infoHash : data.records[0] && data.records[0]._fields[0] ? data.records[0]._fields[0] : null});

  })
})

app.get("/buyPrice/:uuid", check("uuid").not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }
    var query = "MATCH (u:User{uuid:$user}) " +
    "MATCH (t:Torrent{uuid : $uuid}) " +
    "OPTIONAL MATCH (u)-[b:BOUGHT]->(t) " +
    "RETURN t.USD_price, b.confirmed"
    var params = {uuid : req.params.uuid, user: req.user ? req.user.uuid : "null"};
    var session = driver.session();
    session.run(query,params).then(data=>{
      session.close();
      res.json({USD_price
: (data.records[0] && data.records[0]._fields[0]) ? data.records[0]._fields[0] : null, confirmed : data.records[0]._fields[1]})
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
    console.log("UUID: " + req.params.uuid)
    if(Number(transaction.trxConfirmations) >= 2){
      var query = "MATCH (t:Torrent{uuid:$torrentUUID}) " +
        "MATCH (u:User {uuid: $user}) " + 
        "MERGE (u)-[b:BOUGHT {uuid : $uuid}]->(t) " +
        "SET b.confirmed = true " + 
        "RETURN t.infoHash "
        var params = {user : req.user ? req.user.uuid : "null", uuid : req.params.uuid, torrentUUID : req.query.torrentUUID}
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

/*
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
})*/

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
  "MATCH (to:Torrent)-[]-(e1:Edition)-[]-(s:Source)-[]-(e:Edition)-[]-(t) " +
  "WITH t, TOFLOAT(SUM(to.numPeers)) AS numPeers, s " +
  "SET s.numPeers = numPeers " +
  "WITH t " +
  "MATCH (u:User {uuid : $user}) " + 
  "SET u.downloaded = TOFLOAT(u.downloaded) + 1 "

  console.log("PEERLESS :) " + req.query.numPeers);
  session.run(query,params).then(data=>{

    session.close();
    res.end();
  })
  
})

app.post("/upload/:uuid", check("public_domain").trim().escape(), check("copyrighted").trim().escape(), check("payWhatYouWant").trim().escape(),
  check("payment").trim().escape(), check("access").trim().escape(), check("type").trim().escape(), 
  check("edition_no").trim().escape().isLength({max: 256}), check("ETH_address").trim().escape().isLength({max:256}), check("USD_price").trim().escape().isLength({max:256}), check("edition_img").trim().escape().isLength({max:9000}), check("edition_pages").trim().escape().isLength({max :256}), check("edition_publisher").trim().escape().isLength({max:256}), check("uuid").trim().escape().isLength({max:256}), check("edition_date").trim().escape().isLength({max:256}), 
  check("date").trim().escape().isLength({max:256}), check("classes").trim().escape().isLength({max:9000}), check("torrent").trim().escape().isLength({max:9000}),
   check("edition_title").trim().escape().isLength({max:256}), check("authors").trim().escape().isLength({max : 9000}), check("edition_uuid").trim().escape(),
   check("title").trim().escape().not().isEmpty().isLength({max : 256}).withMessage("Primary Source Title must be <= 256 characters"), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(util.inspect(errors.array()));
      return res.json({ errors: errors.array() });
    }

    if(req.body.copyrighted === "true" && !req.body.ETH_address){
      return res.json({errors : [{msg: "You must enter an ETH address if your work is copyrighted."}]});
    }
    if(!req.body.public_domain && !req.body.payment){
      return res.json({errors: [{msg: "You must legally certify that you have the copyrights to this work, or that it is in the public domain!"}]})
    }
    if(req.body.copyrighted === "false" && req.body.public_domain === "false"){
      req.body.public_domain = true;
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
      edition = req.body.edition_title;
    }

    var classes = JSON.parse(he.decode(req.body.classes));
    if(classes[0] === ['']){
      classes = []
    }
    else{
      for (var i = 0; i < classes.length; i++) {
       classes[i] = he.encode(classes[i].trim())
      }  
    }
    
  

    /* for editing if(!torrent.infoHash){
      console.log("infoHash cannot be blank.");
      return res.json({errors : [{msg: "infoHash cannot be blank."}]})
    } */
    //new source upload
    if(req.params.uuid === "undefined"){
      //get image thumbnail
      function newUpload(){

          query += 'MATCH (ua:User {uuid : $user})-[ac:ACCESS]->(h:Buoy {uuid:"d2b358ee-b58d-11ed-afa1-0242ac120002"}) ' +
          "SET ac.uploads = ac.uploads + 1 " +
          'WITH ac, ua ' +
          'MERGE (s:Source {title : $sourceTitle, snatches: toFloat(0), counter : 1, top10: DATETIME(), ' +
          'type: $sourceType, date: $sourceDate, uuid : $uniqueID, updated : toFloat(TIMESTAMP()), ' +
          'created_at: toFloat(TIMESTAMP())}) ' +
            //"SET s.img = CASE WHEN $editionIMG IS NOT NULL THEN $editionIMG END " +//, img : $editionIMG 
            //'SET s.date = $sourceDate ' +
            'FOREACH( ' + 
              'class IN $classes | MERGE (c:Class {name : class}) ' +
              'ON CREATE SET c.uuid = randomUUID(), c.snatches = 0 ' +
              'MERGE (s)<-[:TAGS]-(c) ' + 
            ') ' +
            'MERGE (e:Edition {title : $editionTitle, snatches: toFloat(0), publisher: $editionPublisher, uuid : randomUUID()})<-[:PUB_AS]-(s) ' +
            'SET e.pages = $editionPages, e.no = $editionNo, e.date = $editionDate, e.img = $editionIMG, e.created_at = toFloat(TIMESTAMP()) ' +     
            'MERGE (t:Torrent {mintChecked : false, public_domain: $public_domain, infoHash : $infoHash, media : $media, format: $format})<-[:DIST_AS]-(e) ' +
            'ON CREATE SET t.payment = $payment, t.payWhatYouWant = $payWhatYouWant, t.copyrighted = $copyrighted, ' +
            't.snatches = toFloat(0), t.uuid = randomUUID(), t.uploaderUUID = $user, t.uploaderUser = $name, t.ETH_address = $ETH_address, ' +
            ' t.USD_price = $USD_price, t.created_at = toFloat(TIMESTAMP()), t.deleted = false ' +
            'ON MATCH SET t.created_at = toFloat(TIMESTAMP()) ' +
            "MERGE (ua)-[:UPLOADED]->(t) " 

          params["sourceTitle"] = he.encode(req.body.title);
          params["sourceDate"] = he.encode(req.body.date);
          params["editionTitle"] = he.encode(edition);
          params["editionIMG"] = req.body.edition_img ? he.encode(req.body.edition_img) : null;
          params["editionPublisher"] = he.encode(req.body.edition_publisher)
          params["editionPages"] = he.encode(req.body.edition_pages);
          params["editionDate"] = he.encode(req.body.edition_date);
          params["editionNo"] = he.encode(req.body.edition_no);
          params["uniqueID"] = uuidv1();
          params["classes"] = classes;
          params["sourceType"] = he.encode(req.body.type);
          params["infoHash"] = torrent.infoHash;
          params["media"] = torrent.media;
          params["format"] = torrent.format;
          params["user"] = req.user ? req.user.uuid : "null";
          //TODO: STATE QUESTION!
          params["name"] = req.user ? req.user.user : "Anonymous"
          params["ETH_address"] = req.body.ETH_address;
          params["USD_price"] = parseFloat(req.body.USD_price) ? parseFloat(req.body.USD_price
) : 0.0;
          params["public_domain"] = req.body.public_domain === "true" ? true : false;
          params["copyrighted"] = req.body.copyrighted === "true" ? true : false;
          params["payWhatYouWant"] = req.body.payWhatYouWant === "true" ? true : false;
          params["payment"] = req.body.payment === "true" ? true : false;
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

              query += 'WITH s, ac, t ' + 
              'OPTIONAL MATCH (a:Author {uuid : $uniqueID' + i + '}) ' +
              'WITH s, a, t, ac ' + 
              'MERGE (s)<-[au:' + authorImportance + ' {role : $authorRole' + i + '}]-(a) '
              'RETURN s.uuid AS uuid, ac, t.infoHash AS infoHash '
              params["uniqueID" + i] = author.uuid;
              params["authorRole" + i] = author.role
            })
          }
          query += 'RETURN s.uuid AS uuid, ac, t.infoHash AS infoHash '
          
          session.run(query , params).then(data => {
                session.close()
                //find source uuid
                //console.log(util.inspect(data));
                if(req.user){
                 // req.session.passport.user.access.uploads++;
                  promote(data.records[0]._fields[1].properties)
                  //atlsd.accumulate(driver, req.user, 1)
                  //atlsd.mintUpload(axios, Web3, driver, req.user.uuid, req.user.atlsd, data.records[0]._fields[2], 1)
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
      console.log("EDITION UUID: " + req.body.edition_uuid);
      console.log("SOURCE UUID " + params.uniqueID)
      if(req.body.edition_uuid === "null"){
        edition_uuid = uuidv1();
      }
      else{
        edition_uuid = req.body.edition_uuid;
      }
      /*
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
        */


       if(torrent.infoHash){
        query += 'MATCH (s:Source {uuid : $uniqueID}) ' +
        "SET s.updated = toFloat(TIMESTAMP()) " +
        'WITH s ' +
        "OPTIONAL MATCH (e:Edition {uuid:$edition_uuid}) " +
        "SET e.date = $editionDate, e.no = $editionNo, e.title = $editionTitle, e.publisher = $editionPublisher, e.pages = $editionPages " +
        "WITH s " 
        query += 'MERGE (e1:Edition {uuid : $edition_uuid})<-[pu:PUB_AS]-(s) ' +
       'ON CREATE SET e1.snatches = toFloat(0), e1.no = $editionNo, e1.date = $editionDate, e1.created_at = toFloat(TIMESTAMP()),' + 
       'e1.pages = $editionPages, e1.title = $editionTitle, e1.publisher = $editionPublisher ' 
        query += "WITH s, e1 MERGE (t:Torrent {snatches: toFloat(0), infoHash : $torrentInfoHash, created_at: toFloat(TIMESTAMP()), "+
        "deleted : false, uuid: randomUUID(), media : $torrentMedia, uploaderUUID : $userUUID, uploaderUser : $user, " +
        "USD_price : $USD_price, ETH_address : $ETH_address, format: $torrentFormat, payment : $payment, public_domain: $public_domain, "+
        "payWhatYouWant : $payWhatYouWant, copyrighted : $copyrighted" +
        "})<-[di:DIST_AS]-(e1) " 
    
       }

      
      params["uniqueID"] = req.params.uuid;
      params["classes"] = classes;
      params["editionIMG"] = req.body.edition_img !== null ? he.encode(req.body.edition_img) : null;
      params["sourceTitle"] = he.encode(req.body.title)
      params["sourceDate"] = he.encode(req.body.date)
      params["editionPublisher"] = he.encode(req.body.edition_publisher)
      params["editionPages"] = he.encode(req.body.edition_pages);
      params["editionDate"] = he.encode(req.body.edition_date);
      params["editionTitle"] = he.encode(req.body.edition_title);
      params["editionNo"] = he.encode(req.body.edition_no);
      params["torrentInfoHash"] = torrent.infoHash;
      params["torrentMedia"] = torrent.media;
      params['torrentFormat'] = torrent.format;
      //params["torrentLength"] = torrent.length;
      params["sourceType"] = he.encode(req.body.type)
      params["edition_uuid"] = edition_uuid;

      params["userUUID"] = req.user ? req.user.uuid : "null";
      //TODO: STATE QUESTION!
      params["user"] = req.user ? req.user.user : "Anonymous"
      params["ETH_address"] = req.body.ETH_address;
      params["USD_price"] = parseFloat(req.body.USD_price
) ? parseFloat(req.body.USD_price
) : 0.0;
      params["public_domain"] = req.body.public_domain === "true" ? true : false;
      params["copyrighted"] = req.body.copyrighted === "true" ? true : false;
      params["payWhatYouWant"] = req.body.payWhatYouWant === "true" ? true : false;
      params["payment"] = req.body.payment === "true" ? true : false;
      var authors = JSON.parse(he.decode(req.body.authors));
      //var publishers = JSON.parse(he.decode(req.body.publishers));

      var authorImportance; //check this

/*
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
      }*/
      query += 'RETURN s.uuid AS uuid, t.infoHash AS infoHash '
      console.log(query);
      session.run(query , params).then(data => {
            session.close()
            console.log(data.records[0]._fields[0])
            //find source uuid
            //console.log(util.inspect(data));
            if(req.user){
              //atlsd.accumulate(driver, req.user, 1)
            }
            //atlsd.mintUpload(axios, Web3, driver, req.user.uuid, req.user.atlsd, data.records[0]._fields[1], 2)
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
    var searchableDecoded = he.decode(req.body.author);
    var searchable = he.encode(searchableDecoded.split(",")[0]);
    console.log("Create Author: " + req.body.author);
    session.run('MERGE (a:Author {author : $authorName, searchable : $searchable}) ' +
    'ON CREATE SET a.uuid = $uniqueID ' +
    'RETURN a.uuid AS uuid, a.author AS author' ,{authorName : he.encode(req.body.author), searchable : searchable, uniqueID : uuidv1()}).then(data => {
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
                "WITH t, e " +
                "MATCH (s:Source)-[:PUB_AS]->(e) " +
                "SET s.snatches = toFloat(s.snatches + 1) " +
                "WITH s, t, e " +
                "MATCH (c:Class)-[:TAGS]-(s) " +
                "SET c.snatches = toFloat(c.snatches + 1), c.updated = DATETIME() " +
                "WITH s,t " +
                "MATCH (a:Author)-[:AUTHOR]->(s) " +
                "SET a.snatches = toFloat(a.snatches +1) "

    var params = {infoHash: he.decode(req.params.infoHash), user : req.user ? req.user.uuid : "null"}

    session.run(query,params).then(data => {
      session.close();
      return res.end();
    })
})


function getTop10Query(type, media, format, publisher, classes, class_all, count){
  var query = ""
   if(type !== "all"){
      query += "MATCH (s {type : $type}) "
      if(count){
        query += "WITH s, e, count"
      }
      else{
        query += "WITH s, e "

      }
    }
   
    if(publisher){
      query += "CALL db.index.fulltext.queryNodes('publisher', $publisher) YIELD node " +
        "MATCH (e)-[]-(s) WHERE e.publisher = node.publisher "
      }
    
  if(count){
        query += "WITH s, e, count "
      }
      else{
        query += "WITH s, e "

      }
  if(media !== "all" && format !== "all"){
    query += "MATCH (t:Torrent {media: $media, format:$format})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else if(media !== "all"){
    query += "MATCH (t:Torrent {media: $media})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else if(format !== "all"){
    query += "MATCH (t:Torrent {format:$format})<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  else{
    query += "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e)-[]-(s) WHERE t.deleted = false " 

  }
  if(count){
    query += "WITH count, s,e,t, {USD_price : t.USD_price, copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " 
  }
  else{
    query+= "WITH s,e,t, {USD_price : t.USD_price, copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
  "payment : t.payment, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
    "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " 
  }
  
  if(classes){
    var classes = JSON.parse(he.decode(classes)).split(",");
    if(classes[0] === ['']){
      classes = []
    }
    else{
      for (var i = 0; i < classes.length; i++) {
       classes[i] = he.decode(classes[i].trim()).replace(/['"]+/g, '')
      }  
    }
    console.log(class_all)
    if(class_all === "true"){
      if(count){
        query += "MATCH (c:Class)-[:TAGS]->(s) " +
        "WITH count, s,e,t,c,torrent " +
        "MATCH (c1:Class) WHERE c1.name IN $classes "+ 
        "WITH count, s,e,t,c,torrent, collect(c1) as classes " +
        "WITH count, s,e,t,c,torrent,head(classes) as head, tail(classes) as classes " +
        "MATCH (head)-[:TAGS]->(s) " +
        "WHERE ALL(c1 in classes WHERE (c1)-[:TAGS]->(s)) "
      }
      else{
        query += "MATCH (c:Class)-[:TAGS]->(s) " +
        "WITH s,e,t,c,torrent " +
        "MATCH (c1:Class) WHERE c1.name IN $classes "+ 
        "WITH s,e,t,c,torrent, collect(c1) as classes " +
        "WITH s,e,t,c,torrent,head(classes) as head, tail(classes) as classes " +
        "MATCH (head)-[:TAGS]->(s) " +
        "WHERE ALL(c1 in classes WHERE (c1)-[:TAGS]->(s)) "
      }
    }
    else{
      if(count){
        query += "MATCH (c:Class)-[:TAGS]->(s) " + 
        "WITH count, s,e,t,c,torrent " +
       "MATCH (c1:Class)-[:TAGS]->(s) WHERE c1.name IN $classes "
      }
      else{
        query += "MATCH (c:Class)-[:TAGS]->(s) " + 
        "WITH s,e,t,c,torrent " +
        "MATCH (c1:Class)-[:TAGS]->(s) WHERE c1.name IN $classes "
      }
      
    }
    query += "OPTIONAL MATCH (a:Author)-[]->(s) "
    if(count){
      query += "WITH count, s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c "
      query += "MATCH (s:Source) "
      query += "WITH cont, s, a, edition_torrents, c LIMIT 250 "
    }
    else{
      query += "WITH s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c "
      query += "MATCH (s:Source) "
      query += "WITH s, a, edition_torrents, c LIMIT 250 "
    }
    
    if(count){
      query += "WITH s, count, collect(DISTINCT a) AS authors, edition_torrents, collect(DISTINCT c) as classes, count LIMIT 250 "

    }
    else{
      query += "WITH s, count(s) AS count, collect(DISTINCT a) AS authors, edition_torrents, collect(DISTINCT c) AS classes LIMIT 250 "

    }
    
    
  }
  else{
    query += "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " 
    query += "OPTIONAL MATCH (a:Author)-[]->(s) "
    query += "MATCH (s:Source) "
    if(count){
       query += "WITH s, collect(DISTINCT a) AS authors, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, collect(DISTINCT c) AS classes, count LIMIT 250 "
    }
    else{
       query += "WITH s, collect(DISTINCT a) AS authors, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, collect(DISTINCT c) AS classes LIMIT 250 "
    }
   

  }
  return {query : query, classes : classes}
}

app.post("/top10_day/adv_search", check("search").trim().escape(), check("format").trim().escape(), check("media").trim().escape(), check("classes").trim().escape(),
  check("publisher").trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    console.log(req.body.type);
    var top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, false);
    var params = {limit : req.body.length, skip : req.body.start, time: "P1D", type: req.body.type, media :req.body.media, format :req.body.format, publisher : req.body.publisher, classes: top10Query.classes}

    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source)-[]-(e:Edition) " + 
                "WHERE s.top10 > threshold "
    query += top10Query.query;
    query += "WITH count(DISTINCT s) AS count "
    query += "WITH DATETIME() - duration($time) AS threshold, count " +
              "MATCH (s:Source)-[]-(e:Edition) " + 
              "WHERE s.top10 > threshold "
    top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, true);
    query += top10Query.query
        query += "RETURN s, authors, edition_torrents, classes, TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "


  session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
          total = data.records[0]._fields[4]
          
        }
      console.log("TOTAL : " + total);
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

  })

app.post("/top10_week/adv_search", check("search").trim().escape(), check("format").trim().escape(), check("media").trim().escape(), check("classes").trim().escape(),
  check("publisher").trim().escape(), function(req,res){
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all);
    var params = {limit : req.body.length, skip : req.body.start, time: "P7D", type: req.body.type, media :req.body.media, format :req.body.format, publisher : req.body.publisher, classes: top10Query.classes}

    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source)-[]-(e:Edition) " + 
                "WHERE s.top10 > threshold "
    query += top10Query.query;
    query += "WITH count(DISTINCT s) AS count "
    query += "WITH DATETIME() - duration($time) AS threshold, count " +
              "MATCH (s:Source)-[]-(e:Edition) " + 
              "WHERE s.top10 > threshold "
    top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, true);
    query += top10Query.query
        query += "RETURN s, authors, edition_torrents, classes, TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "


  session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
                               total = data.records[0]._fields[4];


        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })
  })

app.post("/top10_month/adv_search", check("search").trim().escape(), check("format").trim().escape(), check("media").trim().escape(), check("classes").trim().escape(),
  check("publisher").trim().escape(), function(req,res){
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all);
    var params = {limit : req.body.length, skip : req.body.start, time: "P30D", type: req.body.type, media :req.body.media, format :req.body.format, publisher : req.body.publisher, classes: top10Query.classes}

    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source)-[]-(e:Edition) " + 
                "WHERE s.top10 > threshold "
    query += top10Query.query;
    query += "WITH count(DISTINCT s) AS count "
    query += "WITH DATETIME() - duration($time) AS threshold, count " +
              "MATCH (s:Source)-[]-(e:Edition) " + 
              "WHERE s.top10 > threshold "
    top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, true);
    query += top10Query.query
        query += "RETURN s, authors, edition_torrents, classes, TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

  session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
                                  total = data.records[0]._fields[4];

        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })
  })
app.post("/top10_year/adv_search", check("search").trim().escape(), check("format").trim().escape(), check("media").trim().escape(), check("classes").trim().escape(),
  check("publisher").trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all);
    var params = {limit : req.body.length, skip : req.body.start, time: "P365D", type: req.body.type, media :req.body.media, format :req.body.format, publisher : req.body.publisher, classes: top10Query.classes}

    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source)-[]-(e:Edition) " + 
                "WHERE s.top10 > threshold "
    query += top10Query.query;
    query += "WITH count(DISTINCT s) AS count "
    query += "WITH DATETIME() - duration($time) AS threshold, count " +
              "MATCH (s:Source)-[]-(e:Edition) " + 
              "WHERE s.top10 > threshold "
    top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, true);
    query += top10Query.query
        query += "RETURN s, authors, edition_torrents, classes, TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

  session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
                                   total = data.records[0]._fields[4];

        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })
  })

app.post("/top10_alltime/adv_search", check("search").trim().escape(), check("format").trim().escape(), check("media").trim().escape(), check("classes").trim().escape(),
  check("publisher").trim().escape(), function(req,res){
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, false);
    var params = {limit : req.body.length, skip : req.body.start, type: req.body.type, media :req.body.media, format :req.body.format, publisher : req.body.publisher, classes: top10Query.classes}

    var query = "MATCH (s:Source)-[]-(e:Edition) "
    query += top10Query.query;
    query += "WITH count(s) AS count "
    query += "MATCH (s:Source)-[]-(e:Edition) " 
    var top10Query = getTop10Query(req.body.type, req.body.media, req.body.format, req.body.publisher, req.body.classes, req.body.class_all, true);
    query +=  top10Query.query
        query += "RETURN s, authors, edition_torrents, classes, TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "


  session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
                      total = data.records[0]._fields[4];
        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })
})

var top10Query = "WITH s, count LIMIT 250 " +
    "OPTIONAL MATCH (a:Author)-[]->(s) " + 
    "WITH s, a, count " +  
    "OPTIONAL MATCH (e:Edition)<-[:PUB_AS]-(s) " +
    "WITH s,a,e, count " +
    "OPTIONAL MATCH (t:Torrent)<-[:DIST_AS]-(e) WHERE t.deleted = false " +
    "WITH s,a,e,t, count, {copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, " +
    "payment : t.payment, USD_price : t.USD_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "  +
      "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent " +  
    "OPTIONAL MATCH (c:Class)-[:TAGS]->(s) " +
    "WITH s, a, collect(DISTINCT{edition : e, torrent: torrent} ) AS edition_torrents, c, count "



app.post("/top10_day", function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {limit : req.body.length, skip : req.body.start, time: "P1D", buoy:req.body.buoy}

   

    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 > threshold " +
                "WITH s LIMIT 250 " +
                "WITH count(s) AS count " +
                "WITH DATETIME() - duration($time) AS threshold, count " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 >threshold "

    query += top10Query;
    query += "WITH s, a, edition_torrents, c, count " 
    query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

  


    session.run(query,params).then(data => {
      session.close();
     var total = 0;
      if(data.records.length > 0){
          total = data.records[0]._fields[4]
       
        }
        
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})


app.post("/top10_week", function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {limit : req.body.length, skip : req.body.start, time: "P7D"}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 > threshold " +
                "WITH s LIMIT 250 " +
                "WITH count(s) AS count " +
                "WITH DATETIME() - duration($time) AS threshold, count " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 >threshold "

    query += top10Query;
    query += "WITH s, a, edition_torrents, c, count " 
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "


    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
            total = data.records[0]._fields[4]
        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})


app.post("/top10_month", function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {limit : req.body.length, skip : req.body.start, time: "P30D"}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 > threshold " +
                "WITH s LIMIT 250 " +
                "WITH count(s) AS count " +
                "WITH DATETIME() - duration($time) AS threshold, count " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 >threshold "

    query += top10Query;
    query += "WITH s, a, c, edition_torrents, count " 
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "


    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
           total = data.records[0]._fields[4]
        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})

app.post("/top10_year", function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {limit : req.body.length, skip : req.body.start, time: "P365D"}


    var query = "WITH DATETIME() - duration($time) AS threshold " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 > threshold " +
                "WITH s LIMIT 250 " +
                "WITH count(s) AS count " +
                "WITH DATETIME() - duration($time) AS threshold, count " +
                "MATCH (s:Source) " + 
                "WHERE s.top10 >threshold "

    query += top10Query;
    query += "WITH s, a, edition_torrents, c, count " 
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "


    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
           total = data.records[0]._fields[4]
        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})


app.post("/top10_alltime", function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()

    var params = {limit : req.body.length, skip : req.body.start};


    var query = "MATCH (s:Source) "
    query += "WITH s LIMIT 250 " 
    query += "WITH count(s) AS count " 
    query += "MATCH (s:Source) "
    query += top10Query;
    query += "WITH s, a, edition_torrents, c, count " 
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT c), TOFLOAT(count) ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "



    
    session.run(query,params).then(data => {
      session.close();
      var total;
      if(data.records.length > 0){
           total = data.records[0]._fields[4]
        }
      return res.json({recordsTotal : total, recordsFiltered : total, data: data.records});
    })

})
/*
app.post("/modify_infoHash/:infoHash", function(req,res){
  var params = {infoHash : req.params.infoHash}
  var query = ""

  query += "MATCH (t:Torrent {infoHash: $infoHash})"
})*/

app.post("/settings_paranoia/:uuid", check("paranoia").trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var paranoia;
    if(req.body.paranoia === "true"){
      paranoia = true;
    }
    else{
      paranoia = false;
    }
    var query = "MATCH (u:User {uuid : $uuid}) " +
    "SET u.paranoia = $paranoia"
    var params = {uuid : req.params.uuid, paranoia : paranoia}
    session.run(query,params).then(data=>{
      session.close();
      return res.end();
    })
})

app.post("/user_uploads/:uuid", check("uuid").trim().escape().not().isEmpty(), check('skip').trim().escape(), check("length").trim().escape(),
  function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var query = 'MATCH (u:User {uuid : $uuid, paranoia : false}) '
    query += "WITH u "
    query += "OPTIONAL MATCH (u)-[:UPLOADED]->(t:Torrent)-[]-(e:Edition)-[]-(s:Source) " 
    query += "WITH count(s) AS count, e, t, u, s "
    query += "OPTIONAL MATCH (cla:Class)-[:TAGS]->(s) "
    query == "WITH count, s, t, u, cla "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) "
    query += "WITH s, cla, count, a, e, {copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, "
    query += "payment : t.payment, USD_price: t.USD_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "
    query +=  "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent, u.user AS user "
    query += "WITH s, cla, a, collect(DISTINCT {edition: e, torrent: torrent}) AS edition_torrents, count, user "
    switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
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


app.post("/user_downloads/:uuid", check("uuid").trim().escape().not().isEmpty(), check('skip').trim().escape(), check("length").trim().escape(),
  function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session()
    var query = 'MATCH (u:User {uuid : $uuid, paranoia : false}) '
    query += "WITH u "
    query += "OPTIONAL MATCH (t:Torrent)-[]-(e:Edition)-[]-(s:Source) WHERE t.infoHash IN u.downloads " 
    query += "WITH count(s) AS count, e, t, u, s "
    query += "OPTIONAL MATCH (cla:Class)-[:TAGS]->(s) "
    query == "WITH count, s, t, u, cla "
    query += "OPTIONAL MATCH (a:Author)-[]->(s) "
    query += "WITH s, cla, count, a, e, {copyrighted : t.copyrighted, payWhatYouWant : t.payWhatYouWant, "
    query += "payment : t.payment, USD_price: t.USD_price, uuid : t.uuid, ETH_address: t.ETH_address, format : t.format ,media: t.media, uploaderUUID : t.uploaderUUID, "
    query +=  "uploaderUser : t.uploaderUser, snatches: t.snatches, created_at : t.created_at, numPeers:  t.numPeers} AS torrent, u.user AS user "
    query += "WITH s, cla, a, collect(DISTINCT {edition: e, torrent: torrent}) AS edition_torrents, count, user "
    switch(req.body.order[0].column){
    case '0':
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;
    case '1':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.title ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.title DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      break;
    case '2':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.numPeers ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.numPeers DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '3':
      console.log("SNATCHES SORT")
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.snatches ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.snatches DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    case '4':
      if(req.body.order[0].dir === 'asc'){
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated ASC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "

      }
      else{
        query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      }
      break;
    default :
      query += "RETURN s, collect(DISTINCT a), edition_torrents, collect(DISTINCT cla), count, user  ORDER BY s.updated DESC SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit) "
      break;


  }
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
      "(u:User {uuid: apoc.create.uuid(), downloaded : [], mintUploaded : 0, payout : 0, ATLANTIS : 0, paranoia : true, user : $user, pass: $pass, totalDown : 0, totalUp : 0}) " +
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
  var query = "MATCH (h:Buoy)<-[ac:ACCESS]-(u:User {uuid : $uuid}) " +
  "OPTIONAL MATCH (u)-[i:INVITED]->(ha:Buoy) " +
  "MATCH (u)-[a:ACCESS]->(bu:Buoy {uuid: 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
  "OPTIONAL MATCH (u)-[:UPLOADED]->(tor:Torrent) " +
  "WITH toFloat(count(tor)) AS uploads, u, h, i, a, ha " +
  "OPTIONAL MATCH (u)-[:DOWNLOADED]->(to:Torrent) " +
  "WITH h, u, i, ha, a, uploads, toFloat(count(to)) AS snatches " +
  "RETURN collect(h), u, i, ha, a, uploads, snatches, u.downloaded "
  var params = {uuid : req.params.uuid}

  session.run(query,params).then(data=>{
    session.close();
    console.log("COUNT: " + data.records[0]._fields[5])
    if(data.records[0] && data.records[0]._fields[1]){
    return res.json({user : data.records[0]._fields[1].properties, buoys: data.records[0]._fields[0].properties, invite_buoys : 
    data.records[0]._fields[3] ? data.records[0]._fields[3].properties : null, invite_uuids : data.records[0]._fields[2] ? data.records[0]._fields[2]
    .properties : null, access: data.records[0]._fields[4].properties, self : self, uploads: data.records[0]._fields[5],
     snatches : data.records[0]._fields[6], downloaded : data.records[0]._fields[7]});
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
  var query = "MATCH (:User {uuid: $user})-[a:ACCESS]->(:Buoy{uuid:'d2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
  "RETURN a.invites"
  var params = {user : req.user.uuid, buoy : req.body.buoy}
  session.run(query,params).then(data=>{
    session.close();
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
    session.close();
    return res.json({buoys : data.records})
  })
})

app.get("/home", function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session();
  var query = "OPTIONAL MATCH (h:Buoy {uuid  : 'd2b358ee-b58d-11ed-afa1-0242ac120002'}) " +
  "OPTIONAL MATCH (bu:Bulletin)<-[:HOME]-(h) " +
  "OPTIONAL MATCH (h)<-[a:ACCESS]-(u:User {uuid : $user}) " +
  "WITH h, a, u, bu ORDER BY bu.time DESC " +
  "RETURN h, a, u, COLLECT (DISTINCT bu) AS bulletins "
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
      data.records[0]._fields[1].properties : null, bulletins :data.records[0]._fields[3]})
  })
})



function promote(access){
  var rank;
  var rankTitle;
  var invites;
  var description;
  var dmca;
  var promoted;
  var bulletin;
  if(access.rank !== 0){
    if(access.uploads === 25){
      rank = 2;
      rankTitle = "Silver";
      invites = true;
      description = false;
      dmca = false;
      promoted = true;
      bulletin = false;
    }
    else if(access.uploads === 100){
      rank = 3;
      rankTitle = "Gold";
      invites = true;
      description = true;
      dmca = false;
      promoted = true;
      bulletin = true;
    }
    else if(access.uploads === 500){
      rank = 4;
      rankTitle = "Guardian";
      invites = true;
      description = false;
      dmca = true;
      promoted = true;
      bulletin = true;
    }
  }
  if(promoted){
    var session=driver.session();
    var query = "MATCH [a:ACCESS {uuid : $uuid}] " +
    "SET a.rank = $rank, a.rankTitle = $rankTitle, a.invites = $invites, a.bulletin = $bulletin, a.description = $description, a.dmca = $dmca "
    var params = {uuid: access.uuid, rank : rank, rankTitle : rankTitle, invites : inites, bulletin : bulletin, description : description, dmca :dmca}
    session.run(query,params).then(data => {
      session.close();
    })
  }

}

app.get("/dialectic", function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session=driver.session();
  var params = {uuid : req.params.uuid}
  var query = "CALL {"+                
                "MATCH (b)-[]-(a:Aphorism) WHERE NOT b:Torrent AND NOT b:Edition " +
                "RETURN a " +
                "LIMIT 150 " +
              "}" +
               "CALL {" +
                "WITH a " +
                "MATCH (b)-[]-(a) WHERE NOT b:Torrent AND NOT b:Edition " +
                "RETURN b " +
                "LIMIT 50 " +
              "}" +
              "RETURN a, b ORDER BY a.created_at DESC"
  session.run(query,params).then(data=>{
    session.close();      
    return res.json({data : data.records})
    

  
  })
  
  
})

app.get("/check_source/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session();
  var query = "MATCH (s:Source {uuid : $uuid}) " +
  "RETURN s.uuid"
  var params = {uuid : req.params.uuid}
  session.run(query,params).then(data=>{
    session.close();
    try{
      res.json({uuid : data.records && data.records[0] ? data.records[0]._fields[0] : null})
    }
    catch(err){
      res.json({error : err});
    }
  })
})

app.get("/check_aphorism/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session();
  var query = "MATCH (a:Aphorism {uuid : $uuid})-[:DIALECTIC]-(s:Source) " +
  "RETURN a.uuid, s.uuid"
  var params = {uuid : req.params.uuid}
  session.run(query,params).then(data=>{
    session.close();
    try{
      res.json({aphorismUUID : (data.records && data.records.length > 0) ? data.records[0]._fields[0] : null, sourceUUID : (data.records && data.records.length > 0) ? data._records[0]._fields[1] : null})
    }
    catch(err){
      res.json({error: err})
    }
  })
})

app.get("/source_spirit/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const session = driver.session();

  var params = {uuid : req.params.uuid}
  var query = "MATCH (a:Aphorism)-[:DIALECTIC]-(s:Source {uuid : $uuid}) " + 
  "OPTIONAL MATCH (b)-[:DIALECTIC]-(a) WHERE NOT b:Torrent " +
  "RETURN a, b ORDER BY a.created_at DESC LIMIT 200"

  session.run(query,params).then(data=>{
    session.close();      
    return res.json({data : data.records})
    

  
  })
  
})



app.get("/aphorism/:uuid", check("uuid").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var params = {uuid : req.params.uuid}
    var query = "MATCH (a:Aphorism { uuid : $uuid }) " + 
    "OPTIONAL MATCH (a)<-[:DIALECTIC]-(c:Class) " +
    "OPTIONAL MATCH (a)<-[:DIALECTIC]-(u:User) " +
    "OPTIONAL MATCH (a)-[:DIALECTIC]->(b:Aphorism) " +
    "OPTIONAL MATCH (b)-[:DIALECTIC]->(h:Aphorism) " +
    "OPTIONAL MATCH (a)<-[:DIALECTIC]-(d:Aphorism) " +
    "OPTIONAL MATCH (a)-[:DIALECTIC]->(e:Aphorism) " +
    "OPTIONAL MATCH (a)<-[:DIALECTIC]-(f:Aphorism) " +
    "OPTIONAL MATCH (f)<-[:DIALECTIC]-(g:Aphorism) " +
    "RETURN a.title, a.text, a.dialectic, collect(DISTINCT c), u, b, h, d, e, f, g, a.created_at "
    session.run(query,params).then(data => {
      session.close();
      if(data.records.length > 0){
        return res.json({
          title: data.records[0]._fields[0], 
          text : data.records[0]._fields[1], 
          dialectic: data.records[0]._fields[2],
          classes : data.records[0]._fields[3],
          user : data.records[0]._fields[4],
          synthesis_antithesis: data.records[0]._fields[9],
          synthesis_thesis: data.records[0]._fields[10],
          thesis_antithesis: data.records[0]._fields[5],
          thesis_synthesis :data.records[0]._fields[6],
          antithesis_thesis : data.records[0]._fields[7],
          antithesis_synthesis : data.records[0]._fields[8],
          final : data.records[0]._fields[5] ? true : false,
          created_at :data.records[0]._fields[11]
        })
      }
      else{
        res.json({title: "UUID Not Found!", text : ""})
      }
    })
})

app.get("/dialectic_cite/:infoHash", check("pages").trim().escape(), check("infoHash").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var params = {buoy : req.query.buoy, infoHash : req.params.infoHash }
    var query = "MATCH (t:Torrent {infoHash: $infoHash})-[]-(e:Edition)-[]-(s:Source) " +
    "OPTIONAL MATCH (s)<-[:AUTHOR]-(a:Author) " +
    "RETURN e, collect(DISTINCT a), s.uuid, s.title, s.date "
    session.run(query,params).then(data=>{
      session.close();
      try{
        return res.json({record : data.records[0], uuid : data.records[0]._fields[2], title:data.records[0]._fields[3], date:data.records[0]._fields[4], 
          pages : req.query.pages})
      }
      catch(err){
        return res.end();
      }
    })

})

app.post("/new_aphorism", check("sourceUUID").trim().escape(), check("text").trim().escape().not().isEmpty().isLength({max : 1000}), check("title").trim().escape().not().isEmpty().isLength({max:256}),
  check("dialectic").trim().escape().not().isEmpty(), check("classes").trim().escape().isLength({max:9000}),
   check("target").trim().escape(), check("citations").trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();


    var citations = JSON.parse(he.decode(req.body.citations));
    console.log(citations);
    var classes = JSON.parse(he.decode(req.body.classes));
    for (var i = 0; i < classes.length; i++) {
     classes[i] = he.encode(classes[i].trim())
    }
    console.log(classes);
    var user = req.user ? req.user.uuid : "null"
    var params = {sourceUUID : req.body.sourceUUID, user : user, title: req.body.title, citations : citations, text : req.body.text, 
    dialectic : req.body.dialectic, 
    classes: classes, target: req.body.target}
    var query = "OPTIONAL MATCH (u:User {uuid : $user}) " +
    "MERGE (a:Aphorism {userName : u.user, userUUID: u.uuid, " +
    "dialectic : $dialectic, title: $title, text : $text, created_at : toFloat(TIMESTAMP())}) " +
    "SET a.uuid = randomUUID() " +
    "WITH a, u " +
    "MERGE (u)-[:DIALECTIC]->(a) " +
    "RETURN a.uuid "
    session.run(query, params).then(data=>{
      session.close();
      var query2 = "MATCH (a:Aphorism {uuid: $uuid}) " + 
       "OPTIONAL MATCH (t {uuid : $target}) " +
      "FOREACH (o IN CASE WHEN t IS NOT NULL THEN [1] ELSE [] END | " + 
      "MERGE (a)<-[:DIALECTIC]-(t) " +
      ") " +
      "WITH a " +
      'FOREACH( ' + 
                'class IN $classes | MERGE (c:Class {name : class}) ' +
                'ON CREATE SET c.uuid = randomUUID() ' +
                'MERGE (a)<-[:DIALECTIC]-(c) ' + 
              ') ' +
      "WITH a " +   
  /*    "FOREACH(citation in $citations | " +
        "MERGE (t:Torrent {infoHash : citation.infoHash})-[:DIALECTIC {pages : citation.pages}]->(a)" +
        "SET t.editionText = citation.editionText " +
        ") " +*/
      "UNWIND $citations as citation " +
      "OPTIONAL MATCH (to:Torrent {infoHash : citation.infoHash}) " +
      "MERGE (to)-[:DIALECTIC]->(a) " +
      "WITH a, to, citation " +
      "OPTIONAL MATCH (s:Source)-[]-(:Edition)-[]-(to) " +
      "MERGE (s)-[:DIALECTIC]->(a) " +
      "WITH s, to, a, citation " +
      "OPTIONAL MATCH (to)-[]-(:Edition)-[]-(s:Source) " +
      "WITH a, to, citation " +
      "SET to.editionText = citation.editionText, to.sourceUUID = citation.sourceUUID "
      const session2 = driver.session();
      var params2 = {sourceUUID : req.body.sourceUUID, user : user, title: req.body.title, citations : citations, text : req.body.text, 
    dialectic : req.body.dialectic, 
    classes: classes, target: req.body.target, uuid: data.records[0]._fields[0]}
      session2.run(query2,params2).then(data2=>{
        session2.close();
        if(data.records.length > 0){
          console.log(data.records[0]._fields[0]);
          return res.json({uuid : data.records[0]._fields[0]});
        }
        else{
          return res.end();
        }
      })
      
    })
  })


app.post("/src_new_aphorism", check("sourceUUID").trim().escape(), check("text").trim().escape().not().isEmpty().isLength({max : 1000}), check("title").trim().escape().not().isEmpty().isLength({max:256}),
  check("dialectic").trim().escape().not().isEmpty(), check("classes").trim().escape().isLength({max:9000}),
   check("target").trim().escape(), check("citations").trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();


    var citations = JSON.parse(he.decode(req.body.citations));
    console.log(citations);
    var classes = JSON.parse(he.decode(req.body.classes));
    for (var i = 0; i < classes.length; i++) {
     classes[i] = he.encode(classes[i].trim())
    }
    console.log(classes);
    var user = req.user ? req.user.uuid : "null"
    var params = {sourceUUID : req.body.sourceUUID, user : user, title: req.body.title, citations : citations, text : req.body.text, 
    dialectic : req.body.dialectic, 
    classes: classes, target: req.body.target}
    var query = "OPTIONAL MATCH (u:User {uuid : $user}) " +
    "OPTIONAL MATCH (t {uuid : $target}) " +
    "WITH u, t " +
    "MERGE (a:Aphorism {userName : u.user, userUUID: u.uuid, " +
    "dialectic : $dialectic, title: $title, text : $text, created_at : toFloat(TIMESTAMP())}) " +
    "SET a.uuid = randomUUID() " +
    "FOREACH (o IN CASE WHEN t IS NOT NULL THEN [1] ELSE [] END | " + 
      "MERGE (a)-[:DIALECTIC]->(t) " +
    ") " +
    "WITH a, u " +
    "MERGE (u)-[:DIALECTIC]->(a) " +
    "RETURN a.uuid"
     session.run(query,params).then(data=>{
      session.close();
      var params2 = {sourceUUID : req.body.sourceUUID, user : user, title: req.body.title, citations : citations, text : req.body.text, 
       dialectic : req.body.dialectic, 
       classes: classes, target: req.body.target, uuid : data.records[0]._fields[0]}
         
       var query2 = "MATCH (a:Aphorism {uuid : $uuid}) " +
      "WITH a " +
      'FOREACH( ' + 
                'class IN $classes | MERGE (c:Class {name : class}) ' +
                'ON CREATE SET c.uuid = randomUUID() ' +
                'MERGE (a)<-[:DIALECTIC]-(c) ' + 
              ') ' +
      "WITH a " +   
  /*    "FOREACH(citation in $citations | " +
        "MERGE (t:Torrent {infoHash : citation.infoHash})-[:DIALECTIC {pages : citation.pages}]->(a)" +
        "SET t.editionText = citation.editionText " +
        ") " +*/
      "UNWIND $citations as citation " +
      "OPTIONAL MATCH (to:Torrent {infoHash : citation.infoHash}) " +
      "WITH a, to, citation " +
      "MERGE (to)-[:DIALECTIC]->(a) " +
      "WITH a, to, citation " +
      "OPTIONAL MATCH (to)-[]-(:Edition)-[]-(s:Source) " +
      "WITH a, to, s, citation " +
      "MERGE (a)<-[:DIALECTIC]-(s) " +
      "SET to.editionText = citation.editionText, to.sourceUUID = citation.sourceUUID " +
      "WITH a, to, s " +
      "MERGE (to)-[:DIALECTIC]->(a) " +
      "WITH a, to, s " +
      "MERGE (to)<-[:DIALECTIC]-(s) " +
      "WITH a, to, s " +
      "MERGE (s)-[:DIALECTIC]->(a) " +
      "WITH a " +
      "OPTIONAL MATCH (s:Source {uuid: $sourceUUID})" +
      "WITH a, s " +
      "MERGE (a)<-[:DIALECTIC]-(s) "
      const session2 = driver.session();
      session2.run(query2,params2).then(data2=>{
        session2.close();
        return res.json({uuid : data.records[0]._fields[0]})
      })
    })
    
  })

app.post("/update_health", check("totalDown").trim().escape(), check("totalUp").trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var user = req.user ? req.user.uuid : "null";
    var params = {totalDown : parseInt(req.body.totalDown), totalUp : parseInt(req.body.totalUp), ratio : parseFloat(req.body.ratio), user : user}
    var query = "OPTIONAL MATCH (u:User { uuid : $user }) " +
    "SET u.totalDown = u.totalDown + $totalDown, u.totalUp = u.totalUp + $totalUp " +
    "WITH u " + 
    "OPTIONAL MATCH (anonymous:User {uuid : 'null'}) " +
    "SET anonymous.totalDown = anonymous.totalDown + $totalDown, anonymous.totalUp = anonymous.totalUp + $totalUp " +
    "WITH u, anonymous " +
    "RETURN u.totalDown, u.totalUp, anonymous.totalDown, anonymous.totalUp, u.ATLANTIS "
    session.run(query,params).then(data=>{
      session.close();
      return res.json({totalDown : data.records[0]._fields[0], totalUp : data.records[0]._fields[1],
        anonTotalDown : data.records[0]._fields[2], anonTotalUp : data.records[0]._fields[3], ATLANTIS : data.records[0]._fields[4]})
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

//ATLANTIS

app.post("/payout_transaction/:txHash", check("txHash").trim().escape().not().isEmpty(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var query = "MATCH (u:User { uuid : $user }) " + 
      "MERGE (t:Transaction {transactionHash : $txHash, ETH: true, amount : $amount, toAddress: '0x68663EB789CB1b20eBa9F693fdf927Dc195DB114', time : toFloat(TIMESTAMP())})-[:PAID]->(u) "
    var params = {user : req.user ? req.user.uuid : "null", amount : 2.00, txHash: req.params.txHash};
    session.run(query,params).then(data=>{
      session.close();
      return res.end();
    })
})

app.post("/cashout", function(req,res){
  
    /*if(req.user && req.user.uuid !== req.params.uuid){
      return res.end();
    }*/
  if(req.user && req.user.atlsd){
    var query = "MATCH (u:User {uuid : $user}) " +
    "RETURN u.ATLANTIS "
    var params = {user : req.user.uuid};
    var session = driver.session();
      session.run(query,params).then(data=>{
        session.close()
        var session2 = driver.session();
        if(data.records && data.records.length > 0 && req.user && req.user.atlsd){
          //atlsd.mintUpload(axios, Web3, session2, req.user.uuid, req.user.atlsd, null, parseFloat(data.records[0]._fields[0]), function(transactionHash){
            //console.log("JSON")
            return res.json({status : [{msg : "You have cashed out " + parseFloat(data.records[0]._fields[0] + " ATLANTIS!!! Transaction Hash: " + transactionHash)}]});

          //})
        }
        else{
          return res.json({errors:  [{msg : "You must set an ATLANTIS address in your user settings to receive a payout!"}]})
        }


    })
    
  }
})

app.get("/ATLANTIS", function(req,res){
  
    if(!req.user){
      return res.end();
    }
    var query = "MATCH (u:User {uuid : $user}) " +
    "OPTIONAL MATCH (u)<-[:PAID]-(t:Transaction) " +
    "RETURN u, t ORDER BY t.time ASC "
    var params = {user : req.user.uuid}
    var session = driver.session();
    session.run(query,params).then(data=>{
      session.close();
      if(data.records && data.records.length > 0){
        res.json({records : data.records})
      }
      else{
        res.end();
      }
    })

})

app.post("/settings_atlsd/:userUUID", check("atlsd").trim().escape().not().isEmpty(), check("userUUID").trim().escape().not().isEmpty(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const session = driver.session();
    var query = "MATCH (u:User { uuid : $userUUID }) " +
    "SET u.atlsd = $atlsd"
    var params = {userUUID :req.params.userUUID, atlsd : req.body.atlsd}
    session.run(query,params).then(data=>{
      session.close();
      return res.end();
    })

})

app.post("/mintSeeding", check("amount").not().isEmpty().trim().escape(), function(req,res){
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    console.log(req.body.amount)
  if(req.user){
    //atlsd.accumulate(driver, req.user, req.body.amount)
    //atlsd.mintUpload(axios, Web3, driver, req.user.uuid, req.user.atlsd, null, parseInt(req.body.amount))
  }
  return res.end();
})

//if someone hacks it it just crashes the ATLANTIS price so over time there's not an incentive to create (mint) coins for no work
app.post("/mintBytes", check("adjUp").not().isEmpty().trim().escape(), function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    if(req.user && req.user.atlsd){
      var session = driver.session();
        //104857600 100 mb
 
      var query = "OPTIONAL MATCH (u:User {uuid : $user }) WHERE u.mintUploaded >= 104857600 " +
      "SET u.mintUploaded = 0 " +
      "WITH u " +
      "MATCH (u1:User {uuid : $user}) WHERE u1.mintUploaded < 104857600 " +
      "SET u1.mintUploaded = u1.mintUploaded + $adjUp " + 
      "RETURN u, u1.mintUploaded"
      var params = {user : req.user.uuid, adjUp : parseFloat(req.body.adjUp)}
      session.run(query,params).then(data=>{
        session.close();
        if(data.records && data.records.length > 0){
          if(data.records[0]._fields[0]){
            if(req.user){
              //atlsd.accumulate(driver, req.user, 1)
            }
            //atlsd.mintUpload(axios, Web3, driver, req.user.uuid, req.user.atlsd, null, 10)  
          }
          else{
            console.log(data.records[0]._fields[1])
          }
        }
        

      })
      
    }
    return res.end();

})


app.post("/atlsd/:infoHash", check("infoHash").trim().escape().not().isEmpty(), check("to").trim().escape().not().isEmpty(), function(req,res){
  var propagateAddress = "0x68663EB789CB1b20eBa9F693fdf927Dc195DB114";
  //create transaction hash and send it back to client
})

app.get('*', function(req, res, next) {
  //const userAgent = req.headers['user-agent'] || ''; // Detects if the request came from a browser or a crawler bot.
  //if (isbot(userAgent)) next();
  //else 
  res.sendFile(path.join(__dirname, '/static/index.html'));

    
    
});
/*
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});*/

app.listen(port);
console.log('Server started at http://localhost:' + port);