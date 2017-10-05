(function() {
  var projectList = document.getElementById('project-list');
  if (projectList) {
    initPageTransition(projectList);
  }

  function initPageTransition(list) {
    var viewport = initViewport();
    var hexagonSVG = initHexagonSVG(viewport, { fillColor: '#18bc9c' });
    var thumbFacade = initThumbFacade(viewport);

    list.addEventListener('click', function(event) {
      event.preventDefault();
      if (!event.target.href) return false;

      // Distracting ripple animation while the network request is sent
      hexagonSVG.ripple(event);
      // Maneuver the window so it doesn't jump around
      document.body.style.marginRight = (viewport.width - document.body.clientWidth) + 'px';
      document.body.style.overflow = 'hidden';
      
      // Fetch project page content
      var fetchProject = fetch(event.target.href)
      .then(function(response) {
        if (response.ok) return response.text();
      }).then(function(responseText) {
        // Get new content from response
        var wrapper = document.createElement('div');
        wrapper.innerHTML = responseText;
        var newContent = wrapper.querySelector('main');
        newContent.style.visibility = 'hidden';
        newContent.style.position = 'fixed';
        // Get old content node
        var oldContent = document.querySelector('main');
        // Put the new content in the DOM
        document.body.insertBefore(newContent, oldContent);
        // Get the dest img from the new content
        var destImg = newContent.querySelector('img');
        // Animate the thumbFacade
        thumbFacade.slideIn(event, destImg).then(function() {
          // Swap in new content when the thumbFacade is done sliding
          oldContent.style.opacity = 0;
          document.body.removeChild(oldContent);
          document.body.scrollTop = 0;
          newContent.style.visibility = 'visible';
          newContent.style.position = 'static';
          var options = {
            fill: 'forwards',
            easing: 'cubic-bezier(0.4, 0.25, 0.2, 1)',
            duration: 300
          };
          newContent.animate([
            { opacity: 0 },
            { opacity: 1 }
          ], options);
          // Fade out the overlay
          hexagonSVG.fadeOut(options);
          // Expand the image to its natural size
          thumbFacade.expandToNaturalSize(destImg).then(function() {
            // Reset the window stuff
            document.body.style.marginRight = '';
            document.body.style.overflow = '';
          });
        });
      });
    });
  }

  function initHexagonSVG(viewport, options) {
    var NS = "http://www.w3.org/2000/svg";

    // Create SVG
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1 0.86');

    // Add styles to the SVG
    var svgStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      display: 'none',
      transformOrigin: '50% 50%'
    };
    Object.keys(svgStyles).forEach(function(attribute) {
      svg.style[attribute] = svgStyles[attribute]
    });
    
    // Create polygon (hexagon)
    var polygon = document.createElementNS(NS, 'polygon');
    polygon.setAttribute('points', '0.25 0, 0.75 0, 1 0.43, 0.75 0.86, 0.25 0.86, 0 0.43');
    polygon.setAttribute('fill', options.fillColor || '#000');

    // Attach it to the body
    svg.appendChild(polygon);
    document.body.appendChild(svg);
    
    return {
      ripple: function(event) {
        // Calculate where to translate the svg to so it is centered where the click happened
        var xTransform = 100 * (event.clientX - viewport.width / 2) / viewport.width + "%";
        var yTransform = 100 * (event.clientY - viewport.height / 2) / viewport.height + "%";
        
        // Calculate scale ratio for the hexagon
        var deltaX = Math.max(event.clientX, viewport.width - event.clientX);
        var deltaY = Math.max(event.clientY, viewport.height - event.clientY);
        var farthestCornerOffset = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Find the size of the hexagon that will cover the screen
        var hexWidth = farthestCornerOffset * 4 / Math.sqrt(3);
        var scaleRatio = hexWidth / Math.min(viewport.height, viewport.width);

        // From and To transforms
        var fromTransform = 'translate(' + xTransform + ', ' + yTransform + ') scale(0)';
        var toTransform = 'translate(' + xTransform + ', ' + yTransform + ') scale(' + scaleRatio + ')';

        // Show the svg
        svg.style.display = 'block';
        
        // Start the animation
        var anim = svg.animate([
          {
            transform: fromTransform,
            opacity: 0
          },
          {
            transform: toTransform,
            opacity: 1,
            offset: 0.7
          },
          {
            transform: toTransform,
            opacity: 1,
          }
        ], {
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0.25, 0.2, 1)',
          duration: 1600
        });
      },
      fadeOut: function(options) {
        svg.animate([
          { opacity: 1 },
          { opacity: 0 }
        ], options);
      }
    };
  }

  function initThumbFacade(viewport) {
    // Create thumbfacade
    var thumbFacade = document.createElement('div');
    thumbFacade.classList.add('thumb-facade');

    // Create img element to put inside the thumbfacade
    var facadeImg = new Image();
    thumbFacade.appendChild(facadeImg);
    document.body.appendChild(thumbFacade);

    // Needs to be accessible to both animation methods
    // slideIn sets it first to the 
    var imgAspectRatio;
    
    return {
      slideIn: function(event, destImg) {
        // Hide the dest img
        destImg.style.visibility = 'hidden';
        // Set the thumfacade img src to the dest image src
        facadeImg.src = destImg.src;
        
        // Get the bounding rect of the thumbfacade
        var thumbRect = event.target.getBoundingClientRect();
        // Get the bounding rect of the dest img
        var destRect = destImg.getBoundingClientRect();

        // Get the aspect ratio of the thumbfacade
        var thumbAspectRatio = thumbRect.width / thumbRect.height;

        // Get the aspect ratio of the img, which we will need later
        // when the image expands to its natural size/aspect ratio
        imgAspectRatio = destRect.width / destRect.height;
        
        // Since the thumbRect bg image uses 'background-size: cover'
        // this will make sure the img ends up the exact same size.
        if (imgAspectRatio > thumbAspectRatio) {
          facadeImg.height = thumbRect.height;
        } else {
          facadeImg.width = thumbRect.width;
        }
        
        // Set the thumbfacade to the size of the thumbRect
        thumbFacade.style.maxHeight = thumbRect.height + 'px';
        thumbFacade.style.maxWidth = thumbRect.width + 'px';

        // Set the position where we want it to end up
        thumbFacade.style.top = (destRect.top + destRect.height / 2) + 'px';
        thumbFacade.style.left = (destRect.left + destRect.width / 2) + 'px';

        // Give the thumbFacade a starting position exactly on top
        // of the thumbRect
        var fromTrans = 'translate(' +
          (thumbRect.left - destRect.left) + 'px, ' +
          (thumbRect.top - destRect.top) + 'px)';

        // Ending translation centers the img on its position
        var toTrans = 'translate(-50%, -50%)';
        
        // Set the position and show the thumbFacade
        thumbFacade.style.transform = fromTrans;
        thumbFacade.style.display = 'block';
        event.target.style.visibility = 'hidden';
        
        // Start the animation
        var anim = thumbFacade.animate([
          { transform: fromTrans },
          { transform: toTrans }
        ], {
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          delay: 50,
          duration: 500
        });

        return new Promise(function(resolve, reject) {
          anim.onfinish = function() {
            resolve();
          }
        });
      },
      expandToNaturalSize: function(destImg) {
        // Animation options
        var options = {
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          delay: 50,
          duration: 500
        };
        
        // Get natural dimensions, being careful not to expand
        // the image past the viewport edge if it is bigger
        var toWidth = Math.min(viewport.width, facadeImg.naturalWidth);
        var toHeight = toWidth / imgAspectRatio;

        // Animate the thumbFacade and the img together
        var a1 = thumbFacade.animate([
          {
            maxWidth: thumbFacade.style.maxWidth,
            maxHeight: thumbFacade.style.maxHeight
          },
          {
            maxWidth: toWidth + 'px',
            maxHeight: toHeight + 'px'
          }
        ], options);
        
        var a2 = facadeImg.animate([
          {
            width: facadeImg.width + 'px',
            height: facadeImg.height + 'px'
          },
          {
            width: toWidth + 'px',
            height: toHeight + 'px'
          }
        ], options);

        return Promise.all([a1, a2].map(function(anim) {
          return new Promise(function(resolve, reject) {
            anim.onfinish = function() {
              destImg.style.visibility = 'visible';
              thumbFacade.style.display = 'none';
              resolve();
            }
          });
        }));
      }
    };
  }

  function initViewport() {
    var vp = {
      height: window.innerHeight,
      width: window.innerWidth,
      onresize: debounce(function() {
        this.height = window.innerHeight,
        this.width = window.innerWidth
      })
    };

    window.onresize = vp.onresize.bind(vp);
    return vp;
  }

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
})();