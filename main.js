$(document).ready(function() {
  // Init viewport object
  viewport = initViewport();

  // Init the overlay svg
  var hexagonSVG = HexagonSVG(viewport, { fill: '#18bc9c' });

  // Init Barba
  Barba.Pjax.start();
  // Barba.Prefetch.init();
  
  var lastLinkClicked;
  var mouseEvent;

  Barba.Dispatcher.on('linkClicked', function(el, event) {
    lastLinkClicked = el;
    mouseEvent = event;
  });

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */
      
      // Start the hexagon ripple overlay as soon as the transition starts
      hexagonSVG.ripple(mouseEvent);
      // Once the new container is loaded, swap the containers and slide
      // the image over to its new place.
      this.newContainerLoading.then(function() {
        this.slideImg();
        hexagonSVG.fadeOut();
        this.fadeOut().then(this.fadeIn.bind(this));
      }.bind(this));
    },

    slideImg: function() {
      var $img = $(this.newContainer).find('img');

      var position = {
        top: $img.position().top - $(this.oldContainer).height(),
        left: $img.position().left
      };

      var $facade = $('<div>')
        .css({
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          maxHeight: mouseEvent.target.clientHeight,
          maxWidth: mouseEvent.target.clientWidth,
          overflow: 'hidden'
        });

      var $facadeImg = $img.clone()
        .css({
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        });

      // Make the facade look like a background-position: cover element
      // by comparing the aspect ratios and setting the dimensions accordingly
      if (($img.width() / $img.height()) > (mouseEvent.target.clientWidth / mouseEvent.target.clientHeight)) {
        $facadeImg.height(mouseEvent.target.clientHeight);
      } else {
        $facadeImg.width(mouseEvent.target.clientWidth);
      }
      
      $facade.append($facadeImg)
        .appendTo(document.body);

      var offset = $(mouseEvent.target).offset();

      var tween = TweenLite.fromTo($facade, 0.6, {
        x: offset.left - window.scrollX,
        y: offset.top - window.scrollY
      }, {
        x: position.left,
        y: position.top,
        ease: Power1.easeInOut
      });

      $(mouseEvent.target).hide();
    },
  
    fadeOut: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */

      var tween = TweenLite.to($(this.oldContainer), 0.2, {
        opacity: 0,
        ease: Power1.easeInOut
      });
      
      return tweenPromise(tween);
    },
  
    fadeIn: function() {
      /**
       * this.newContainer is the HTMLElement of the new Container
       * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
       * Please note, newContainer is available just after newContainerLoading is resolved!
       */
  
      var _this = this;
  
      $(this.oldContainer).hide();
  
      var tween = TweenLite.fromTo($(this.newContainer), 0.2, {
        visibility: 'visible',
        opacity: 0
      },{
        opacity: 1,
        ease: Power1.easeInOut
      });
      
      tweenPromise(tween).then(function() {
        _this.done();
      });
    }
  });
  
  /**
   * Next step, you have to tell Barba to use the new Transition
   */
  
  Barba.Pjax.getTransition = function() {
    /**
     * Here you can use your own logic!
     * For example you can use different Transition based on the current page or link...
     */
  
    return FadeTransition;
  };
});

// Wraps a tween in a promise that resolves when the tween completes
function tweenPromise(tween) {
  return new Promise(function(resolve, reject) {
    tween.eventCallback('onComplete', function() {
      resolve(true);
    });
  });
}

// Returns an object that contains the viewport dimensions.
// Helps avoids calling window.innerHeight/Width too many times.
function initViewport() {
  var vp = {
    height: window.innerHeight,
    width: window.innerWidth,
    onresize: function() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    }
  };
  window.onresize = debounce(vp.onresize.bind(vp), 100);
  return vp;
}

// Simple debounce function
function debounce(fn, delay) {
  var timeout;
  return function() {
    var args = arguments;
    var ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      fn.apply(ctx, args);
    }, delay);
  }
}

// Create tag with SVG namespace
function SVG(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

// HexagonSVG overlay
function HexagonSVG(viewport, options) {
  var $svg = $(SVG('svg'))
    .attr('viewBox', '0 0 1 0.86')
    .css({
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      opacity: 0,
      pointerEvents: 'none'
    })
    .append($(SVG('polygon'))
      .attr({
        points: '0.25 0, 0.75 0, 1 0.43, 0.75 0.86, 0.25 0.86, 0 0.43',
        fill: options.fill || '#000'
      })
    )
    .appendTo(document.body);

  var tl = new TimelineLite()
  var scaleDuration = options.scaleDuration || 1.2;
  var fadeDuration = options.fadeDuration || 0.8;
  
  return {
    ripple: function(event) {      
      // Calculate farthest corner of viewport from click coordinates
      var deltaX = Math.max(event.clientX, viewport.width - event.clientX);
      var deltaY = Math.max(event.clientY, viewport.height - event.clientY);
      var farthestCornerOffset = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      // Calculate the scale ratio the hexagon will need to scale to in order
      // to cover the screen
      var hexWidth = farthestCornerOffset * 4 / Math.sqrt(3);
      var scaleRatio = hexWidth / Math.min(viewport.height, viewport.width);

      // Tween it up      
      tl.set($svg, {
        x: event.clientX - viewport.width / 2,
        y: event.clientY - viewport.height / 2,
        transformOrigin: "50% 50%",
        scale: 0
      })
      .to($svg, scaleDuration, { scale: scaleRatio })
      .to($svg, 0.01, { opacity: 1 }, '-=' + (scaleDuration - 0.03));

      return tweenPromise(tl);
    },

    fadeOut: function() {
      tl.to($svg, fadeDuration + scaleDuration, { opacity: 0 }, '-=' + (scaleDuration - 0.041));

      return tweenPromise(tl);
    }
  }
}