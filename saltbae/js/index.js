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

var saltiness = 0.75;
var grains = 500
var fallSpeed = 0.25;

// Individual salt grain
function Salt() {
  var x, y, t;
  var radius = Math.max(2, canvas.height / 300);

  function draw() {
		if (y > canvas.height) return;
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    y += fallSpeed * t;
    x += fallSpeed * drift(t);
    t++;
  }

  function drift(t) {
    return (Math.random() * 2 - 1) * t;
  }

	function setStartPos(xStart, yStart) {
		t = 0;
		x = xStart;
		y = yStart;
	}

  return {
		draw: draw,
		setStartPos: setStartPos,
	};
}

// Bae
function SaltBae(saltiness) {
	this.salting = false;
	var baeImage = new Image();
  baeImage.src = 'images/saltbae_cutout.png';
  var imgX = 0;

	var saltGrains = [];
	for (var i = 0; i < grains; i++) {
		saltGrains.push(Salt());
	}

	var j = 0;
  function dropSalt() {
		if (this.salting) {
			if (Math.random() < saltiness) {
				saltGrains[j % grains].setStartPos(
					imgX + canvas.height / 5, canvas.height / 7
				);
				j++;
			}
		};
		saltGrains.forEach(function(salt) {
			salt.draw();
		});
  }

  function drawBae() {
    var sx = 0, sy = 0,
        sh = baeImage.height, sw = baeImage.width,
        dx = imgX, dy = 0,
        dh = canvas.height,
        dw = canvas.height * (sw / sh);
    ctx.drawImage(baeImage, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  function move(x) {
    var imgWidth = canvas.height * baeImage.width / baeImage.height;
    if ((x - imgWidth / 2) < 0) {
      imgX = 0;
    } else {
      imgX = Math.min(canvas.width - imgWidth, x - imgWidth / 2);
    }
  }

  return {
    drawBae: drawBae,
    dropSalt: dropSalt,
    move: move,
  };
}

var saltBae = SaltBae(saltiness);
(function animLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saltBae.drawBae();
	saltBae.dropSalt();
  rAF(animLoop);
})();

// events
// resize
window.onresize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
  saltBae = SaltBae(saltiness);
};

// mousemove
document.addEventListener('mousemove', function(event) {
  saltBae.move(event.clientX);
});

// mousedown
document.addEventListener('mousedown', function(event) {
	saltBae.salting = true;
});

// mouseup
document.addEventListener('mouseup', function(event) {
	saltBae.salting = false;
});
