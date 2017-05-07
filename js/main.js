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
function setEnterAsNextPage(nextPage){
  let secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.add('show');
  document.onkeypress = function(e){
    if(e.keyCode == 13){
      window.location.href = nextPage;
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
