var intervalId;
var timeoutId;
function setGlitching(){
  $(document).ready(function(){
    let content = $("<div />").append($(".container").clone()).html();
    intervalId = setInterval(function(){
      timeoutId = setTimeout(function(){
        $(".container").glitch();
        setTimeout(function(){
          $('canvas').remove();
          $('body').prepend(content);
        }, 500)
      }, Math.floor(Math.random() * (3000 - 1000 + 1)) + 2000);
    }, 3100);
  });
}

function disableGlitching(){
  // clearInterval(intervalId);
  // clearTimeout(timeoutId);
  var highestTimeoutId = setTimeout(";");
  for (var i = 0 ; i < highestTimeoutId ; i++) {
      clearTimeout(i);
  }
}

function setEnterAsNextView(nextPage, finalQuestion){
  let secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.add('show');


  document.onkeypress = function(e){
    if(e.keyCode == 13){
      document.onkeypress = undefined;
      disableGlitching();
      if(finalQuestion){
        document.querySelector('#next-final').volume = 0.1;
        document.querySelector('#next-final').play();
        timeoutTime = 700;
      }
      else{
        document.querySelector('#next').volume = 0.1;
        document.querySelector('#next').play();
        timeoutTime = 100;
      }


      setTimeout(function(){
        setView(nextPage);
      }, timeoutTime);
    }
  }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeEnterAsNextView(){
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

function sendData() {
  let XHR = new XMLHttpRequest();
  let urlEncodedData = "";
  let urlEncodedDataPairs = [];
  let name;

  //random number between 3 and 10
  let randomNum = Math.floor(Math.random() * 10) + 3;
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

function setView(view){
  $.ajax({
   url:view.href,
   type:'GET',
   success: function(data){
     $(".container").remove();
     $("body").prepend(data);
     $("head title").html(view.title);
     view.js();
   }
  });
}

views = {
  loading:{
    title: "LOADING",
    href: "loading.html",
    js: function(){
      document.querySelector('#music').volume = 0.1;
      document.querySelector('#music').play();
      setTimeout(function(){
        setView(views.welcome);
      },6000)
    }
  },
  welcome:{
    title: "WELCOME",
    href: "welcome.html",
    js: function(){
      document.querySelector('#welcome').volume = 0.1;
      document.querySelector('#welcome').play();
      setTimeout(function(){
        document.querySelector('.primary>.text').classList.remove('fade-in');
        document.querySelector('.primary>.text').classList.add('initial');
        document.querySelector('.primary>.text').classList.remove('show');

        setGlitching();
      }, 3600);
      setTimeout(function(){
        setEnterAsNextView(views.headphones);
      }, 3000);
    }
  },
  headphones:{
    title: "HEADPHONES",
    href: "headphones.html",
    js: function(){
      setTimeout(function(){
        document.querySelector('.primary>.text').classList.remove('fade-in');
        document.querySelector('.primary>.text').classList.add('initial');
        document.querySelector('.primary>.text').classList.remove('show');

        setGlitching();
      }, 3600);
      setTimeout(function(){
        setEnterAsNextView(views.instructions);
      }, 3000);
    }
  },
  instructions:{
    title: "INSTRUCTIONS",
    href: "instructions.html",
    js: function(){
      let str = 'Follow and answer the next 5 questions.<br/><br />Use the keypad and mouse to answer the randomly generated queries.';
      type('.message>span', str, function(){
        // let task = pickTask();
        setEnterAsNextView(views.tasks.task18);
      })
    }
  },
  finished:{
    title: "FINISHED",
    href: "finished.html",
    js: function(){
      var str = 'You have now finished a work rotation.^1500<br/><br />Please take your ticket reward.';
      let secondaryMessage = document.querySelector('.secondary>span');
      type('.message>span', str, function(){
        secondaryMessage.classList.add('show');
        setEnterAsNextView(views.printing);
      });
    }
  },
  printing:{
    title: "PRINTING",
    href: "printing.html",
    js: function(){
      document.querySelector('#printing').volume = 0.1
      document.querySelector('#printing').play();
      sendData();
      setTimeout(function(){
        setView(views.thankyou);
      }, 8000);
    }
  },
  thankyou:{
    title: "THANK YOU",
    href: "thankyou.html",
    js: function(){
      setTimeout(function(){
        document.querySelector('.primary>.text').classList.remove('fade-in');
        document.querySelector('.primary>.text').classList.add('initial');
        document.querySelector('.primary>.text').classList.remove('show');

        setTimeout(function(){
          document.querySelector('#music').pause();

          $(".container").glitch();
          document.querySelector('#thankyou').volume = 0.4;
          document.querySelector('#thankyou').play();
          setTimeout(function(){
            window.location.href = 'index.html';
          }, 1400)
        },3500)

      }, 2000);
    }
  },
  tasks:{
    task2:{
      title: "COW",
      href: "tasks/task2.html",
      js: function(){
        let input = document.querySelector(".input__field");
        let el = document.querySelector('.cow');
        el.children[0].src = "assets/cowoutline.SVG";

        type('.title>span', 'Double click this icon.', function(){
          el.classList.remove('hide');
        });

        el.ondblclick = function(e){

          el.children[0].src = "assets/cowfull.SVG";
          el.classList.add('filled');
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          setTimeout(function(){
            setEnterAsNextView(views.tasks.task12);
          }, 1200);
        }

        el.onfocus = function(){

          if(dateValid) {
            input.classList.add('valid');
          }
        }

      }
    },
    task3:{
      title: "HEART",
      href: "tasks/task3.html",
      js: function(){
        let input = document.querySelector(".input__field");
        let el = document.querySelector('.heart');
        el.firstChild().src = "assets/heartoutline.SVG";

        type('.title>span', 'Double click this icon.', function(){
          el.classList.remove('hide');
        });

        el.ondblclick = function(e){

          el.children[0].src = "assets/heartfull.SVG";
          el.classList.add('filled');
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          setTimeout(function(){
            setEnterAsNextView(views.tasks.task16);
          }, 1200);
        }

      }
    },
    task6:{
      title: "HUNGRINESS",
      href: "tasks/task6.html",
      js: function(){
        let el = document.querySelector('.btn-group');
        type('.title>span', 'On a scale from 1-10, rate your hunger level, 10 being<br />the hungriest.', function(){
            el.classList.remove('hide');
        });


        let buttons = document.querySelectorAll('.btn-group div');
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click',function(e){
            let cursor = document.querySelector('.typed-cursor');
            if(cursor){
              cursor.remove();
            }
            for (var i = 0; i < buttons.length; i++) {
              buttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
            setTimeout(function(){
              setEnterAsNextView(views.tasks.task16);
            }, 1700);
          });
        }

      }
    },
    task12:{
      title: "DATE",
      href: "tasks/task12.html",
      js: function(){
        let dateValid = false;
        let input = document.querySelector(".input__field");
        let el = document.getElementById('task-input');

        type('.title>span', 'Enter the DD/MM of your birth date.', function(){
          el.parentNode.classList.remove('hide');
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr) || el.value.length > 4) {
              return false;
          }

        }
        el.onkeyup = function(e){
          if(el.value.length == 2 && e.keyCode != 8){
            el.value = el.value + '/';
          }
          else{
            let day = el.value.split("/")[0];
            let month = el.value.split("/")[1];
            dateValid = day <= 31 && month <= 12 && month.length == 2;
            let secondaryMessage = document.querySelector('.secondary>span');
            if(dateValid){
              input.classList.add('valid');
              el.onkeyup = undefined;
              setEnterAsNextView(views.tasks.task6);
            }
            else {
              input.classList.remove('valid');
              removeEnterAsNextView();
            }
          }
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        let cursor = document.querySelector('.typed-cursor').cloneNode();
        el.onfocus = function(){
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          if(dateValid) {
            input.classList.add('valid');
          }
        }

        el.onblur = function(){
          document.querySelector('.typed-cursor').style.visibility = 'visible';
          input.classList.remove('valid');
        }
      }
    },
    task16:{
      title: "LOCATION",
      href: "tasks/task16.html",
      js: function(){
        let validInput = false;
        let timeoutId;
        let input = document.querySelector(".input__field");
        let el = document.getElementById('task-input');

        type('.title>span', 'Enter your current location.', function(){
          el.parentNode.classList.remove('hide');
        });



        el.onkeypress = function(e){
          if(el.value.length > 5){
            el.onkeypress = undefined;
            setEnterAsNextView(views.finished, true);
          }
        }


        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        let cursor = document.querySelector('.typed-cursor').cloneNode();
        el.onfocus = function(){
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          if(validInput) {
            input.classList.add('valid');
          }
        }

        el.onblur = function(){
          document.querySelector('.typed-cursor').style.visibility = 'visible';
          input.classList.remove('valid');
        }
      }
    },
    task18:{
      title: "NUMBERS",
      href: "tasks/task18.html",
      js: function(){
        let validInput = false;
        let input = document.querySelector(".input__field");
        let el = document.getElementById('task-input');

        type('.title>span', 'Enter 5 random digits.', function(){
          el.parentNode.classList.remove('hide');
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr) || el.value.length > 4) {
              return false;
          }

        }
        el.onkeyup = function(e){

          let numbers = el.value;
          validInput = numbers.length == 5;
          if(validInput){
            input.classList.add('valid');
            el.onkeyup = undefined;
            setEnterAsNextView(views.tasks.task2);
          }
          else {
            input.classList.remove('valid');
            removeEnterAsNextView();
          }

        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        let cursor = document.querySelector('.typed-cursor').cloneNode();
        el.onfocus = function(){
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          if(validInput) {
            input.classList.add('valid');
          }
        }

        el.onblur = function(){
          document.querySelector('.typed-cursor').style.visibility = 'visible';
          input.classList.remove('valid');
        }

      }
    },
  }
}
