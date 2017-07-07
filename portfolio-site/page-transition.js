var pageTransition = (function() {
  var viewport = {
    height: window.innerHeight,
    width: window.innerWidth,
    onresize: function() {
      this.height = window.innerHeight,
      this.width = window.innerWidth
    }
  };
  var hexagonSVG = initHexagonSVG({ fillColor: '#18bc9c' });
  var detailView = initDetailView();
  var thumbFacade = initThumbFacade({ topOffset: 0.35 });

  function initHexagonSVG(options) {
    var fillColor = options.fillColor || '#000';
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, 'svg');
    var polygon = document.createElementNS(NS, 'polygon');
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
    
    svg.setAttribute('viewBox', '0 0 1 0.86');
    
    polygon.setAttribute('points', '0.25 0, 0.75 0, 1 0.43, 0.75 0.86, 0.25 0.86, 0 0.43');
    polygon.setAttribute('fill', fillColor);
    
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
        return svg.animate([
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
      }
    };
  }

  function initThumbFacade(options) {
    // topOffset and leftOffset determine where the image will slide to
    // default is in the center of the viewport. Units are percentage
    var topOffset = options.topOffset || 0.5;
    var leftOffset = options.leftOffset || 0.5;
    var thumbFacade = document.createElement('div');
    var img = new Image();
    var imgAspectRatio;
    
    thumbFacade.classList.add('thumb-facade');
    thumbFacade.style.top = (topOffset * 100) + 'vh';
    thumbFacade.style.left = (leftOffset * 100) + 'vw';
    thumbFacade.appendChild(img);
    document.body.appendChild(thumbFacade);
    
    return {
      slideIn: function(event) {
        var bgUrl = event.target.style['background-image'].replace(/^url\(|\)$|\'|\"/gi, '');
        img.src = bgUrl;
              
        var thumbRect = event.target.getBoundingClientRect();
        var thumbAspectRatio = thumbRect.width / thumbRect.height;
        imgAspectRatio = img.width / img.height;
        
        if (imgAspectRatio > thumbAspectRatio) {
          img.height = thumbRect.height;
        } else {
          img.width = thumbRect.width;
        }
        
        thumbFacade.style.maxHeight = thumbRect.height + 'px';
        thumbFacade.style.maxWidth = thumbRect.width + 'px';

        var fromTrans = 'translate(' +
          (thumbRect.left - viewport.width * leftOffset) + 'px, ' +
          (thumbRect.top - viewport.height * topOffset) + 'px)';

        var toTrans = 'translate(-50%, -50%)';
        
        thumbFacade.style.transform = fromTrans;
        thumbFacade.style.display = 'block';
        event.target.style.visibility = 'hidden';
        
        return thumbFacade.animate([
          { transform: fromTrans },
          { transform: toTrans }
        ], {
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          delay: 50,
          duration: 500
        });
      },
      expandToNaturalSize: function() {
        var options = {
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          delay: 50,
          duration: 500
        };
        
        var toWidth = Math.min(viewport.width, img.naturalWidth);
        var toHeight = toWidth / imgAspectRatio;
        
        var fromStyles = {
          maxWidth: thumbFacade.style.maxWidth,
          maxHeight: thumbFacade.style.maxHeight
        };
        
        var toStyles = {
          maxWidth: toWidth + 'px',
          maxHeight: toHeight + 'px'
        };
    
        thumbFacade.animate([fromStyles, toStyles], options);
        
        img.animate([
          {
            width: img.width + 'px',
            height: img.height + 'px'
          },
          {
            width: toWidth + 'px',
            height: toHeight + 'px'
          }
        ], options);
      }
    };
  }

  function initDetailView() {
    var detailView = document.createElement('div');
    detailView.setAttribute('id', 'project-container');

    var title = document.createElement('h1');
    var image = document.createElement('img');
    var content = document.createElement('div');
    detailView.appendChild(title);
    detailView.appendChild(image);
    detailView.appendChild(content);
    document.body.appendChild(detailView);
    
    return {
      fadeIn: function() {
        detailView.style.visibility = 'visible';
        detailView.animate([
          {
            opacity: 0
          },
          {
            opacity: 1
          }
        ], {
          fill: 'forwards',
          easing: 'ease-out',
          duration: 600
        })
      },
      setTitle: function(text) {
        title.textContent = text;
      },
      setContent: function(newContent) {
        console.log(newContent);
        content.appendChild(newContent);
      },
      setImage: function(src) {

      }
    }
  }  

  function doTransition(event) {
    // should move this so it's only prevented if fetch is successful
    event.preventDefault();
    // Fetch detail page content then...
    fetch(event.target.href).then(function(response) {
      if (response.ok) {
        return response.text();
      }
    }).then(function(responseText) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = responseText;
      var newContent = wrapper.querySelector('.content');
      detailView.setContent(newContent);
    });

    detailView.setTitle('Project Title');
    

    // Add a negative margin to avoid the jumping scrollbar
    document.body.style.marginRight = (viewport.width - document.body.clientWidth) + 'px';
    document.body.style.overflow = 'hidden';
    
    hexagonSVG.ripple(event);
    var facadeSlide = thumbFacade.slideIn(event);
    facadeSlide.onfinish = function() {
      thumbFacade.expandToNaturalSize();
      detailView.setImage('');
      detailView.fadeIn();
    }
  }
  
  return {
    init: function(thumbs) {
      for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', doTransition);
      }

      window.onresize = viewport.onresize.bind(viewport);
    }
  };
})();

var list = document.getElementById('project-list');
pageTransition.init(list.querySelectorAll('a'));


