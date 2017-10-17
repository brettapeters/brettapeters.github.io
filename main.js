$(document).ready(function() {
  // Init Barba
  Barba.Pjax.start();

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      // Wait for new content to load and fadeOut to complete
      // before fading in new content
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this))
        .then(this.finish.bind(this));
    },
  
    fadeOut: function() {
      var tween = TweenLite.to($(this.oldContainer), 0.2, {
        opacity: 0,
        y: 30,
        ease: Power1.easeInOut
      });
      
      return tweenPromise(tween);
    },
  
    fadeIn: function() {
      var _this = this;

      $(this.oldContainer).hide();
  
      var tween = TweenLite.fromTo($(this.newContainer), 0.2, {
        visibility: 'visible',
        opacity: 0,
        y: 30
      },{
        opacity: 1,
        y: 0,
        ease: Power1.easeInOut
      });
      
      return tweenPromise(tween);
    },

    finish: function() {
      $(window).scrollTop(0);
      this.done();
    }
  });
  
  Barba.Pjax.getTransition = function() {
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