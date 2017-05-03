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
function setEnterAsNextPage(nextPage){
  let secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.add('show');
  document.onkeypress = function(e){
    if(e.keyCode == 13){
      window.location.href = nextPage;
    }
  }
}

function removeEnterAsNextPage(){
  let secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.remove('show');
  document.onkeypress = null;
}

function type(querySelector, str, cb){
  Typed.new(querySelector, {
  	strings: [str],
  	contentType: 'html',
    showCursor: true,
  	cursorChar: "|",
    typeSpeed: 50,
    callback: function(){
      if(cb) {
        cb();
      }
    }
  });
}
