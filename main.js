$(document).ready(function() {
  // Init viewport object
  viewport = initViewport();

  // Init the overlay svg
  var hexagonSVG = HexagonSVG(viewport, { fill: '#18bc9c', duration: 1.12 })

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
      // Start the ripple overlay
      hexagonSVG.ripple(mouseEvent);
      // Move the clicked li over the overlay
      $(mouseEvent.target).closest('li').css('z-index', 1);
      

  
      // As soon the loading is finished and the old page is faded out, let's fade the new page
      // Promise
      //   .all([this.newContainerLoading, this.fadeOut()])
      //   .then(this.fadeIn.bind(this));
    },
  
    fadeOut: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */

      var tween = TweenLite.to($(this.oldContainer), 0.2, {
        y: 50,
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
        y: 50,
        visibility: 'visible',
        opacity: 0
      },{
        y: 0,
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
      var tween = TweenLite.fromTo($svg, options.duration || 1, {
        x: event.clientX - viewport.width / 2,
        y: event.clientY - viewport.height / 2,
        transformOrigin: "50% 50%",
        scale: 0,
        opacity: 0
      }, {
        scale: scaleRatio,
        opacity: 1
      });
    }
  }
}