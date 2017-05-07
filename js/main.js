function setGlitching(){
  $(document).ready(function(){
    var content = $("<div />").append($(".container").clone()).html();
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
  	cursorChar: "|",
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
