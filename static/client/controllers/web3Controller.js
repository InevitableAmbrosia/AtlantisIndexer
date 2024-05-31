
async function initializeWeb3(){
      //initPayButton();
      
}

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  console.log("ACCOUNT : " + account)
  return account;
}


async function initPayButton(btn){
  return;
    $(".web3").prop("disabled", true)
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          await web3.eth.requestAccounts();
          console.log("WEB3 CONNECTED!")
        
          

        } catch (err) {
          console.log("ACCESS Web3 DENIED")
          alert("Connect a Metamask wallet to use dAPp features!!!!")
          $(".web3").prop("disabled", false)
          return;
         // $('#status').html('User denied account access', err)
        }
     /* } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
        initPayButton()
      */} else {
        alert("Connect a Metamask wallet to use dAPp features!!!!")
          $(".web3").prop("disabled", false)
        
        return;
        console.log("NO METAMASK INSTALLED!!!")
        //$('#status').html('No Metamask (or other Web3 Provider) installed')
      }
    const account = await getAccount();
    //const contract = await new web3.eth.Contract(json, "0x8f370C3a42054A0C1A216270a85f67B678E2711a")
    console.log("CLICKED")
    // paymentAddress is where funds will be send to

    const propagateAddress = "0xaafB904FFDb0552393651a4E02A88c9f016F41F5"
    const curatorAddress = btn.data("curator-address");
    const torrentUUID = btn.data("torrent-uuid");
    console.log(torrentUUID);
    var yarrr = btn.data("yarrr")
    $("#" + torrentUUID).val("");
    console.log(yarrr);
    
    $.get("/buyPrice/" + torrentUUID, async function(data){

      //no donation just add link to chain with GAS ether

    console.log(curatorAddress);
      console.log(data.buyHash);
      const amountEth = data.buyHash > 0 ? data.buyHash * .5 : yarrr * .5;
      const suggestion_gas = await web3.eth.getGasPrice();
       if(data.buyPrice === 0 && !yarrr) {
        yarr = 0

        $.get("/infoHash/" + torrentUUID, async function(data){
          const estimate_gas3 = await web3.eth.estimateGas({
            "from" : account,
            "to" : "0x" + data.free
          })
          web3.eth.sendTransaction({
            to:"0x" + data.free, 
            from:account,
            gasPrice: web3.utils.toHex(suggestion_gas),
            gasLimit: web3.utils.toHex(estimate_gas3),
            value:web3.utils.toWei(0, "ether")
          })
          $(".web3").prop("disabled", false)
          return;  
        })
        
      };
      //  var batch = new web3.BatchRequest();
     /* */
      var transactionHash0;
      var transactionHash1;
      //get suggestion Gas price

//get estimate Gas
const estimate_gas = await web3.eth.estimateGas({
    'from': account,
    'to': propagateAddress
 
});

const estimate_gas2 = await web3.eth.estimateGas({
  'from' : account,
  'to' : curatorAddress
})


//params for sign transaction
        var waitInterval;
        var transactionInterval;
        var uuid = crypto.randomUUID();
        var sent = false;
        var recCtn = false;
    web3.eth.sendTransaction({
          to:propagateAddress, 
          from:account,
          gasPrice: web3.utils.toHex(suggestion_gas),
          gasLimit: web3.utils.toHex(estimate_gas),
          value:web3.utils.toWei(amountEth, "ether")
        }).once("transactionHash", function(hash){
          transactionHash0 = hash;
        }).on("sent",function(){
            web3.eth.sendTransaction({
              to:curatorAddress, 
              from:account,
              gasPrice: web3.utils.toHex(suggestion_gas),
              gasLimit: web3.utils.toHex(estimate_gas),
              value:web3.utils.toWei(amountEth, "ether")
            }).once("transactionHash", function(hash){
              transactionHash1 = hash;
              }).on("sent",function(){
              sentTransaction();
            }).on('receipt', function(receipt){
              procReceipt(transactionHash1);

           }).catch(function(err){
            transErr(err);
           })
           sentTransaction();
         })
        .on('receipt', function(receipt){
          procReceipt(transactionHash0)
          }).catch(function(err){
        transErr(err);
       })
       
    
        
       function transErr(err){
         alert(err.message)
        console.log(err)
        $(".web3").prop("disabled", false)
        $(".web3Status").hide();
        $(".web3Loader").fadeOut(777)
          dismissPP2();
          clearInterval(transactionInterval);
          clearInterval(waitInterval);
       } 
  
      function sentTransaction(){
          if(!sent){
             initializePP2();
            $(".web3Status").show();
            $(".web3Loader").show();
            $(".web3Loader").text("Processing payment!!!!")
            startLoading();
            sent = true;
          }

             
          
           
      }

      var confirmations = 0;
      function startLoading(){
            var intervalMs = 300;

            waitInterval = setInterval(function(){
              var el = $(".web3Status");
              var dotsStr = el.text();
              var dotsLen = dotsStr.length;

              var maxDots = 5;
              $(".web3Status").text(dotsLen < maxDots ? dotsStr + '.' : '');
            }, intervalMs);
        }
        var pollInterval;
      function procReceipt(transactionHash){
          $(".web3Loader").fadeIn(1337);
          clearInterval(waitInterval);
        
         
         
          
          console.log(recCtn);
          if(!recCtn){
            recCtn = true;
            startLoading();
           pollInterval = setInterval(function(){
              $.post("/pollTransactions/" + uuid, function(data){
              $(".web3Loader").text("Verifying: " + (20 - data.confirmations) + " remaining")
                confirmations = 20 - data.confirmations;                   
              })
            }, 33333)
          }
          else{
            recCtn = false;
            $(".web3Loader").text("Verifying: " + (20 - confirmations) + "  remaining")

            transactionInterval = setInterval(function(){
         
            
              $.post("/pollBatch/" + uuid + "?torrentUUID=" + torrentUUID, async function(data){
                if(data.bought){
                  dismissPP2();
                  $(".web3Status").hide();
                  $(".web3Loader").hide();
                  sent = false;

                  const estimate_gas3 = await web3.eth.estimateGas({
                    "from" : account,
                    "to" : "0x" + data.infoHash 
                  })
                  web3.eth.sendTransaction({
                    to:"0x" + data.infoHash, 
                    from:account,
                    gasPrice: web3.utils.toHex(suggestion_gas),
                    gasLimit: web3.utils.toHex(estimate_gas3),
                    value:web3.utils.toWei(0, "ether")
                  })
                  clearInterval(pollInterval);
                  clearInterval(waitInterval);
                  clearInterval(transactionInterval);
                  $(".web3").prop("disabled", false)
                }
              })
           }, 37800)   
          }
         
          
         
         $.post("/web3/" + transactionHash + "?uuid=" + uuid + "&torrentUUID=" + torrentUUID +"&booty=" + (data.buyHash > 0 ? "true" : "false"), function(){
          
         })
         
      }

      function send(){
          sent = true;
          initializePP();
          $(".web3Status").show();
          $(".web3Loader").show();
          $(".web3Loader").text("Processing crypto pay!")
          
        function startLoading(){
            var intervalMs = 300;

            waitInterval = setInterval(function(){
              var el = $(".web3Status");
              var dotsStr = el.text();
              var dotsLen = dotsStr.length;

              var maxDots = 5;
              $(".web3Status").text(dotsLen < maxDots ? dotsStr + '.' : '');
            }, intervalMs);
        }
        startLoading(); 
      }
        /*.catch(function(err){
        
       })*/
      
    })
  

}

var ppInterval2;
function initializePP2(){
$('#popupImage')
     //.hide()
     .fadeIn(737);
   

   var pp=1;
    ppInterval2 = setInterval(function(){
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

function dismissPP2(){
  if(ppInterval2)
      clearInterval(ppInterval2);
  $(".popupImage").hide();
  $("#popupImage2").fadeOut();
  $("#popupImage").fadeOut();
    
}
