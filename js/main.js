function setGlitching(){
  $(document).ready(function(){
    let content = $("<div />").append($(".container").clone()).html();
    setInterval(function(){
      setTimeout(function(){
        $(".container").glitch();
        setTimeout(function(){
          $('canvas').remove();
          $('body').prepend(content);
        }, 500)
      }, Math.floor(Math.random() * (3000 - 1000 + 1)) + 2000)
    }, 3100);
  });
}

function setImmediateGlitch(){

}
function setEnterAsNextPage(nextPage, q5){
  let secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.add('show');
  document.onkeypress = function(e){
    if(e.keyCode == 13){
      document.querySelector('#next').play();
      timeoutTime = q5 ? 500 : 100;

      setTimeout(function(){
        window.location.href = nextPage;
      }, timeoutTime);
    }
  }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeEnterAsNextPage(){
  let secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.remove('show');
  document.onkeypress = null;
}

function type(querySelector, str, cb, preStringTyped){
  Typed.new(querySelector, {
  	strings: [str],
  	contentType: 'html',
    showCursor: true,
  	cursorChar: "▋",
    typeSpeed: 30,
    callback: function(){
      if(cb) {
        cb();
      }
    },
    preStringTyped: function() {

      if(preStringTyped && title.innerText.length == 3){


        // cursor.remove();
      }
    },
  });
}

function setupButtons(){

}

function sendData() {
  let XHR = new XMLHttpRequest();
  let urlEncodedData = "";
  let urlEncodedDataPairs = [];
  let name;

  //random number between 1 and 10
  let randomNum = Math.floor(Math.random() * 10) + 1;
  let data= {
    arg: randomNum
  }

  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  XHR.addEventListener('load', function(event) {
    console.log('Yeah! Data sent and response loaded.');
    console.log(event);
  });

  XHR.addEventListener('error', function(event) {
    console.log('Oups! Something goes wrong.');
  });

  XHR.open('POST', 'https://api.particle.io/v1/devices/2d0040000d47343432313031/led?access_token=dc9f5e2102aa1394e475dc5cffaf991cbb256a05');
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  XHR.send(urlEncodedData);
}

// function setCookie(c_name,value,exdays)
// {
//     var exdate=new Date();
//     exdate.setDate(exdate.getDate() + exdays);
//     var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
//     document.cookie=c_name + "=" + c_value;
// }
//
// function getCookie(c_name)
// {
//     var i,x,y,ARRcookies=document.cookie.split(";");
//     for (i=0;i<ARRcookies.length;i++)
//     {
//       x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
//       y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
//       x=x.replace(/^\s+|\s+$/g,"");
//       if (x==c_name)
//         {
//         return unescape(y);
//         }
//       }
// }

// function setCookie(cname, cvalue, exdays) {
//   var d = new Date();
//   d.setTime(d.getTime() + (exdays*24*60*60*1000));
//   var expires = "expires="+ d.toUTCString();
//   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }
//
// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(';');
//     for(var i = 0; i <ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }

function setCookie(name, value){
  console.log('setando', name, value)
  localStorage.setItem(name, value);
}

function getCookie(name){
  return localStorage.getItem(name);
}

function playMusic(){
  var song = document.getElementsByTagName('audio')[0];
  var played = false;

  function update() {
    var tillPlayed = getCookie('timePlayed');
    song.volume=0.0;
    if(!played){
        if(tillPlayed){
          song.currentTime = tillPlayed;
          song.play();
          played = true;
        }
        else {
            song.play();
            played = true;
        }
    }
    else {

      setCookie('timePlayed', song.currentTime);
    }
  }
  setInterval(update,300);
}
