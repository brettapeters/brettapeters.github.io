// RAF shim
window.rAF = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var saltiness = 500;
var fallSpeed = 0.4;

function Salt(x, y) {
  var t = 0;
  var delay = Math.random() * -saltiness;
  var radius = Math.max(2, canvas.height / 300);

  function draw() {
    if (t + delay >= 0) {
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      y += fallSpeed * (t + delay);
      x += fallSpeed * drift(t + delay);
    }
    t++;
  }

  function drift(t) {
    return (Math.random() * 2 - 1) * t;
  }

  return { draw: draw };
}

function SaltBae(saltiness) {
  var baeImage = new Image();
  baeImage.src = 'images/saltbae_cutout.png';
  var imgX = 0;
  var saltX = imgX + canvas.height / 5;
  var stream = [];
  for (var i = 0; i < saltiness; i++) {
    stream.push(Salt(saltX, canvas.height / 7));
  }

  function throwSalt() {
    ctx.drawImage(baeImage,0,0,258,343,imgX,0,
                  canvas.height * (258 / 343),
                  canvas.height);

    stream.forEach(function(salt) {
      salt.draw();
    });
  }

  function move(x) {
    xPos = x;
  }

  return {
    throwSalt: throwSalt,
    move: move,
  };
}

var saltBae = SaltBae(saltiness);
(function animLoop() {
  rAF(animLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saltBae.throwSalt();
})();

// resize
window.onresize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
  saltBae = SaltBae(saltiness);
};
