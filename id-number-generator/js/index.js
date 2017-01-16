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
  
  var result = document.querySelector('.result');
  result.textContent = '';
  
  var ids = document.createDocumentFragment();
  while(n--) {
    var item = document.createElement('li');
    var id = document.createElement('code');
    id.textContent = randId16();
    item.appendChild(id);
    ids.appendChild(item);
  }
  var list = document.createElement('ol');
  list.appendChild(ids);
  result.appendChild(list);
  
  result.classList.add('showing');
});

form.addEventListener('keypress', function(event) {
  var field = event.target.parentNode;
  if (field.classList.contains('has-error')) {
    field.classList.remove('has-error');
  }
});

// Random ID Generator
function randId16() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
              .map(n => ('00' + n.toString(16)).substr(-2)).join('');
}

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