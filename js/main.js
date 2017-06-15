var intervalId;
var timeoutId;
function setGlitching(){
  $(document).ready(function(){
    var content = $("<div />").append($(".container").clone()).html();
    setTimeout(function(){
      setInterval(function(){
        $(".container").glitch();
        setTimeout(function(){
          $('canvas').remove();
          $('body').prepend(content);
        }, 500)
      }, 3000);
    }, 1900);
  });
}

function disableGlitching(){
  var highestTimeoutId = setTimeout(";");
  for (var i = 0 ; i < highestTimeoutId ; i++) {
      clearTimeout(i);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var tasksCompleted = [];
function decideNextView(){
  var nextView;
  var finalQuestion = false;
  console.log(tasksCompleted)
  if(tasksCompleted.length == 5){
    finalQuestion = true;
    setEnterAsNextView(views.finished, finalQuestion);
    return;
  }

  if(tasksCompleted.length == 0 || tasksCompleted[tasksCompleted.length - 1] > 11){
    nextView = getRandomInt(1,11);
    while(tasksCompleted.includes(nextView) || nextView == 5 || nextView == 10){
      nextView = getRandomInt(1,11);
    }
  }
  else{
    nextView = getRandomInt(12,20);
    while(tasksCompleted.includes(nextView)){
      nextView = getRandomInt(12,20);
    }
  }

  setEnterAsNextView(views.tasks['task' + nextView], finalQuestion, nextView);
}

function setEnterAsNextView(nextPage, finalQuestion, taskId){
  var secondaryMessage = document.querySelector('.secondary>span');
  secondaryMessage.classList.add('show');
  document.onkeypress = function(e){
    if(e.keyCode == 13){
      // $( ".task" ).css({"height": "auto" });
      document.onkeypress = undefined;
      disableGlitching();

      if(taskId){
        tasksCompleted.push(taskId);
      }

      if(finalQuestion){
        document.querySelector('#next-final').volume = 0.6;
        document.querySelector('#next-final').play();
        timeoutTime = 700;
      }
      else{
        document.querySelector('#next').volume = 0.6;
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
  var secondaryMessage = document.querySelector('.secondary>span');
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
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];
  var name;

  //random number between 1 and 5
  var randomNum = getRandomInt(1,5);
  var data= {
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

  //returns the 4 seconds per number of tickets being printed
  return randomNum*4*1000;
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
      var str = 'Follow and answer the next 5 questions.<br/><br />Use the keypad and mouse to answer the randomly generated queries.';
      type('.message>span', str, function(){
        // var task = pickTask();
        // setEnterAsNextView(views.tasks.task1);
        decideNextView();
      })
    }
  },
  finished:{
    title: "FINISHED",
    href: "finished.html",
    js: function(){
      var str = 'You have now finished a work rotation.^1500<br/><br />Please take your ticket reward.';
      var secondaryMessage = document.querySelector('.secondary>span');
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
      document.querySelector('#printing').volume = 0.5
      document.querySelector('#printing').play();
      var delaytime = sendData();
      setTimeout(function(){
        setView(views.thankyou);
      }, delaytime);
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
    task1:{
      title: "FILE",
      href: "tasks/task1.html",
      js: function(){
        type('.title>span', 'Drag and drop this file into this folder.', function(){
          var hidden = document.getElementsByClassName("hide");
          while (hidden.length){
            hidden[0].classList.remove("hide");
          }
        });

        $( "#page" ).draggable({
          containment: ".task",
          drag: function(){
            document.querySelector('.typed-cursor').style.visibility = 'hidden';
          }
        });
        $( "#folder" ).droppable({
          drop: function( event, ui ) {
            if(ui.draggable.prop('id')=="page"){
              document.getElementById('page').classList.add('hide');
              setTimeout(function(){
                decideNextView();
              }, 1200);
            }
          },
          out: function(event, ui){
            if(ui.draggable.prop('id')=="circle"){
              var highestTimeoutId = setTimeout(";");
              for (var i = 0 ; i < highestTimeoutId ; i++) {
                  clearTimeout(i);
              }
              document.getElementById('square-img').classList.remove('filled');
              removeEnterAsNextView();
            }
          }
        });
      }
    },
    task2:{
      title: "COW",
      href: "tasks/task2.html",
      js: function(){
        var input = document.querySelector(".input__field");
        var el = document.querySelector('.cow');
        el.children[0].src = "assets/cowoutline.SVG";

        type('.title>span', 'Double click this icon.', function(){
          el.classList.remove('hide');
        });

        el.ondblclick = function(e){

          el.children[0].src = "assets/cowfull.SVG";
          el.classList.add('filled');
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          setTimeout(function(){
            decideNextView();
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
        var el = document.querySelector('span.heart');
        el.children[0].src = "assets/heartoutline.SVG";

        type('.title>span', 'Double click this icon.', function(){
          el.classList.remove('hide');
        });

        el.ondblclick = function(e){

          el.children[0].src = "assets/heartfull.SVG";
          el.classList.add('filled');
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          setTimeout(function(){
            decideNextView();
          }, 1200);
        }
      }
    },
    task4:{
      title: "THUMBS UP",
      href: "tasks/task4.html",
      js: function(){
        var el = document.querySelector('.thumb');
        el.firstChild.src = "assets/thumboutline.png";
        type('.title>span', 'Double click this icon.', function(){
          el.classList.remove('hide');
        });

        el.ondblclick = function(e){

          el.children[0].src = "assets/thumbfilled.png";
          el.classList.add('filled');
          document.querySelector('.typed-cursor').style.visibility = 'hidden';
          setTimeout(function(){
            decideNextView();
          }, 1200);
        }
      }
    },
    task5:{
      title: "DRAG",
      href: "tasks/task5.html",
      js: function(){
        type('.title>span', 'Drag and drop the circle into the square.', function(){
          var hidden = document.getElementsByClassName("hide");
          while (hidden.length){
            hidden[0].classList.remove("hide");
          }
        });
        document.querySelector('#circle-img').src = "/assets/circle.svg";
        document.querySelector('#square-img').src = "/assets/square.svg";
        var triangles = document.querySelectorAll('.triangle');
        for (var i = 0; i < triangles.length; i++) {
          triangles[i].children[0].src = "/assets/triangle.svg";
        }
        $( "#circle" ).draggable({
          containment: ".task"
        });
        $( ".triangle" ).draggable({
          containment: ".task"
        });
        $( "#square" ).droppable({
          drop: function( event, ui ) {
            if(ui.draggable.prop('id')=="circle"){
              document.getElementById('square-img').classList.add('filled');
              document.getElementById('circle-img').src = '/assets/circleblue.svg';
              document.querySelector('.typed-cursor').style.visibility = 'hidden';
              setTimeout(function(){
                decideNextView();
              }, 1200);
            }
          },
          out: function(event, ui){
            if(ui.draggable.prop('id')=="circle"){
              document.getElementById('circle-img').src = '/assets/circle.svg';
              document.querySelector('.typed-cursor').style.visibility = 'visible';
              var highestTimeoutId = setTimeout(";");
              for (var i = 0 ; i < highestTimeoutId ; i++) {
                  clearTimeout(i);
              }
              document.getElementById('square-img').classList.remove('filled');
              removeEnterAsNextView();
            }
          }
        });
      }
    },
    task6:{
      title: "HUNGRINESS",
      href: "tasks/task6.html",
      js: function(){
        var el = document.querySelector('.btn-group');
        type('.title>span', 'On a scale from 1-10, rate your hunger level, 10 being<br />the hungriest.', function(){
            el.classList.remove('hide');
        });


        var buttons = document.querySelectorAll('.btn-group div');
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click',function(e){
            var cursor = document.querySelector('.typed-cursor');
            if(cursor){
              cursor.remove();
            }
            for (var i = 0; i < buttons.length; i++) {
              buttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
            setTimeout(function(){
              decideNextView();
            }, 1700);
          });
        }

      }
    },
    task7:{
      title: "HAPPINESS",
      href: "tasks/task6.html",
      js: function(){
        var el = document.querySelector('.btn-group');
        type('.title>span', 'On a scale from 1-10, rate your happiness level, 10 being<br />the happiest.', function(){
            el.classList.remove('hide');
        });


        var buttons = document.querySelectorAll('.btn-group div');
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click',function(e){
            var cursor = document.querySelector('.typed-cursor');
            if(cursor){
              cursor.remove();
            }
            for (var i = 0; i < buttons.length; i++) {
              buttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
            setTimeout(function(){
              decideNextView();
            }, 1700);
          });
        }

      }
    },
    task8:{
      title: "ORGANISE",
      href: "tasks/task8.html",
      js: function(){
        var el = document.querySelector('.btn-group');
        type('.title>span', 'Organise the numbers from 1-5.', function(){
            el.classList.remove('hide');
        });

        $('#btn-group').sortable({
          stop: function(){
            var cursor = document.querySelector('.typed-cursor');
            if(cursor){
              cursor.remove();
            }

            var buttons = document.querySelectorAll('.btn-group div');

            for (var i = 0; i < buttons.length; i++) {

              if(i+1 != Number(buttons[i].getAttribute('value'))){
                for (var j = 0; j < buttons.length; j++) {
                  buttons[j].classList.remove('active');
                }
                removeEnterAsNextView();
                break;
              }
              if(i == 4){
                for (var i = 0; i < buttons.length; i++) {
                  buttons[i].classList.add('active');
                }
                setTimeout(function(){
                  decideNextView();
                }, 1700);
              }
            }
          }
        });
        $('#btn-group').disableSelection();
      }
    },
    task9:{
      title: "EMOTION",
      href: "tasks/task9.html",
      js: function(){
        var el = document.querySelector('.btn-group');
        type('.title>span', 'Which is the closest face to your current emotion?', function(){
            el.classList.remove('hide');
        });


        var faces = document.querySelectorAll('.btn-group img');
        for (var i = 0; i < faces.length; i++) {
          faces[i].addEventListener('click',function(e){
            var cursor = document.querySelector('.typed-cursor');
            if(cursor){
              cursor.remove();
            }
            for (var i = 0; i < faces.length; i++) {
              faces[i].classList.remove('active');
              faces[0].src = "assets/happyoutline.png";
              faces[1].src = "assets/neutraloutline.png";
              faces[2].src = "assets/sadoutline.png";
            }

            e.target.classList.add('active');
            if(e.target.id == "happy"){
              e.target.src = "assets/happyfull.png";
            }
            else if(e.target.id == "neutral"){
              e.target.src = "assets/neutralfull.png";
            }
            else {
              e.target.src = "assets/sadfull.png";
            }
            setTimeout(function(){
              decideNextView();
            }, 1700);
          });
        }

      }
    },
    task10:{
      title: "CLEAR",
      href: "tasks/task10.html",
      js: function(){
        type('.title>span', 'Click each icon to close it and clear the space below.', function(){
          var hidden = document.getElementsByClassName("hide");
          while (hidden.length){
            hidden[0].classList.remove("hide");
          }
        });

        var clickCounter = 0;
        var icons = document.querySelectorAll('.icons');
        icons[0].src = "/assets/circle.svg";
        icons[1].src = "/assets/triangle.svg";
        icons[2].src = "/assets/square1.png";
        icons[3].src = "/assets/heartfull.SVG";
        icons[4].src = "/assets/folder.png";
        icons[5].src = "/assets/square2.png";
        icons[6].src = "/assets/thumbfilled.png";
        icons[7].src = "/assets/cowfull.SVG";
        for (var i = 0; i < icons.length; i++) {

          icons[i].addEventListener('click', function(e){
            document.querySelector('.typed-cursor').style.visibility = 'hidden';
            e.target.classList.add('hidden');
            setTimeout(function(){
              e.target.style.display = "none";
            }, 1000)
            clickCounter += 1;
            if(clickCounter == icons.length){
              setTimeout(function(){
                decideNextView();
              }, 1000)
            }
          });
        }
      }
    },
    task11:{
      title: "T&C",
      href: "tasks/task11.html",
      js: function(){
        var el = document.querySelector('.terms .body');
        type('.title>span', 'Do you accept the terms and conditions? Click the square box to agree.', function(){
          el.classList.remove('hide');
        });

        var checkbox = el.querySelector('.checkbox');
        checkbox.addEventListener('click', function(){

          if(checkbox.classList.contains('active')){
            checkbox.classList.remove('active');
            checkbox.innerHTML = "";
            removeEnterAsNextView();
            document.querySelector('.typed-cursor').style.visibility = 'visible';
          }
          else{
            checkbox.classList.add('active');
            checkbox.innerHTML = "&times;";
            setTimeout(function(){
              decideNextView();
            }, 1000);
            document.querySelector('.typed-cursor').style.visibility = 'hidden';
          }
        });
      }
    },
    task12:{
      title: "DATE",
      href: "tasks/task12.html",
      js: function(){
        var dateValid = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter the DD/MM of your birth date.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
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
            var day = el.value.split("/")[0];
            var month = el.value.split("/")[1];
            dateValid = day <= 31 && month <= 12 && month.length == 2;
            var secondaryMessage = document.querySelector('.secondary>span');
            if(dateValid){
              input.classList.add('valid');
              el.onkeyup = undefined;
              decideNextView();
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

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
    task13:{
      title: "TELEPHONE",
      href: "tasks/task13.html",
      js: function(){
        var validInput = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter the 5 first digits of your phone number.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr) || el.value.length > 4) {
              return false;
          }

        }
        el.onkeyup = function(e){

          var numbers = el.value;
          validInput = numbers.length == 5;
          if(validInput){
            input.classList.add('valid');
            el.onkeyup = undefined;
            decideNextView();
          }
          else {
            input.classList.remove('valid');
            removeEnterAsNextView();
          }

        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
    task14:{
      title: "WORD",
      href: "tasks/task14.html",
      js: function(){
        var validInput = false;
        var timeoutId;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        input.placeholder="DOOR";

        type('.title>span', 'Enter a random word.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });



        el.onkeypress = function(e){
          if(el.value.length > 1){
            el.onkeypress = undefined;
            decideNextView();
          }
        }


        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
    task15:{
      title: "EMAIL",
      href: "tasks/task15.html",
      js: function(){
        var dateValid = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter any email in the format _____@__.__.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });
        el.onkeyup = function(e){
          if(validateEmail(el.value)){
            input.classList.add('valid');
            // el.onkeyup = undefined;
            decideNextView();
          }
          else {
            input.classList.remove('valid');
            removeEnterAsNextView();
          }
        }

        function validateEmail(email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
        var validInput = false;
        var timeoutId;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        input.placeholder="BUDAPEST, HUNGARY";

        type('.title>span', 'Enter your current location.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });



        el.onkeypress = function(e){
          if(el.value.length > 5){
            el.onkeypress = undefined;
            decideNextView();
          }
        }


        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
    task17:{
      title: "HOUSE",
      href: "tasks/task17.html",
      js: function(){
        var validInput = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter your flat or house number.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr)) {
              return false;
          }

        }
        el.onkeyup = function(e){

          if(el.value.length > 1){
            el.onkeypress = undefined;
            decideNextView();
          }

        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
        var validInput = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter 5 random digits.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr) || el.value.length > 4) {
              return false;
          }

        }
        el.onkeyup = function(e){

          var numbers = el.value;
          validInput = numbers.length == 5;
          if(validInput){
            input.classList.add('valid');
            el.onkeyup = undefined;
            decideNextView();
          }
          else {
            input.classList.remove('valid');
            removeEnterAsNextView();
          }

        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
    task19:{
      title: "LETTERS",
      href: "tasks/task19.html",
      js: function(){
        var validInput = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter the number of letters in your first name.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr)) {
              return false;
          }

        }
        el.onkeyup = function(e){

          if(el.value.length > 0){
            el.onkeypress = undefined;
            decideNextView();
          }
          else{
            removeEnterAsNextView();
          }

        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
    task20:{
      title: "SHOE",
      href: "tasks/task20.html",
      js: function(){
        var validInput = false;
        var input = document.querySelector(".input__field");
        var el = document.getElementById('task-input');

        type('.title>span', 'Enter your shoe size.', function(){
          el.parentNode.classList.remove('hide');
          setTimeout(function(){
            input.focus();
          }, 2000);
        });

        el.onkeypress = function(e){

          var charCode = e.which || e.keyCode;
          var charStr = String.fromCharCode(charCode);
          if (!/[0-9]/.test(charStr)) {
              return false;
          }

        }
        el.onkeyup = function(e){

          if(el.value.length > 0){
            el.onkeypress = undefined;
            decideNextView();
          }
          else{
            removeEnterAsNextView();
          }

        }

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        var cursor = document.querySelector('.typed-cursor').cloneNode();
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
