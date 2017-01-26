// Worker set up
function createWorker() {
  var worker = new Worker('js/worker.js');
  worker.addEventListener('message', workerMessageHandler);
  return worker;
}

function workerMessageHandler(event) {
  var result = document.querySelector('.result');
  var metrics = result.querySelector('.metrics');
  var n = event.data.n;

  var num;
  if (n % 10 === 1 && n !== 11) num = n + 'st';
  else if (n % 10 === 2 && n !== 12) num = n + 'nd';
  else if (n % 10 === 3 && n !== 13) num = n + 'rd';
  else num = n + 'th';

  metrics.querySelector('#n').textContent = num;
  metrics.querySelector('#p').textContent = event.data.nth;
  metrics.querySelector('#t').textContent = event.data.t;

  result.classList.remove('loading');
  result.classList.add('showing');
}

// Form event handlers
var form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  var input = event.target[0];
  var n = parseInt(input.value);

  if (n < 0) {
    input.parentNode.classList.add('has-error');
    return false;
  }

  if (typeof worker !== 'undefined') worker.terminate();
  worker = createWorker();
  worker.postMessage({ n });

  var result = document.querySelector('.result');
  result.classList.remove('showing');
  result.classList.add('loading');
});

form.addEventListener('keypress', function(event) {
  var field = event.target.parentNode;
  if (field.classList.contains('has-error')) {
    field.classList.remove('has-error');
  }
});

// Ripple button animation
var ripple = (function() {
  function rippleAnimation(event) {
    var tl = new TimelineLite(),
        rippleObj = this.querySelectorAll(".js-ripple"),
        scaleRatio = farthestCornerOffset(event);

    tl.fromTo(rippleObj, 0.5, {
      x: event.offsetX,
      y: event.offsetY,
      transformOrigin: "50% 50%",
      scale: 0,
      opacity: 1
    },{
      opacity: 0,
      scale: scaleRatio
    });
  }

  function farthestCornerOffset(event) {
    var rect = event.target.getBoundingClientRect(),
        x = Math.max(event.clientX, event.target.offsetLeft),
        y = Math.max(event.clientY, event.target.offsetTop),
        deltaX = Math.max(Math.abs(rect.left - x), rect.right - x),
        deltaY = Math.max(Math.abs(rect.top - y), rect.bottom - y);

    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  }

  function arrayize(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  }

  function attachAnimation(button) {
    button.addEventListener("click", rippleAnimation)
  }

  return {
    init: function() {
      var buttons = document.getElementsByClassName("js-ripple-btn");
      arrayize(buttons).forEach(attachAnimation);
    },
  };
})();

ripple.init();
