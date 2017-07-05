function initHexagonSVG(options) {
  var fillColor = options.fillColor || '#000';
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, 'svg');
  var polygon = document.createElementNS(NS, 'polygon');
  var svgStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
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
      svg.style.display = 'block';
      var xTransform = 100 * (event.clientX - window.innerWidth / 2) / window.innerWidth + "%";
      var yTransform = 100 * (event.clientY - window.innerHeight / 2) / window.innerHeight + "%";

      return svg.animate([
        {
          // from
          transform: 'translate(' + xTransform + ', ' + yTransform + ') scale(0)',
          opacity: 0
        },
        {
          // to
          transform: 'translate(' + xTransform + ', ' + yTransform + ') scale(1)',
          opacity: 1
        }
      ], {
        fill: 'forwards',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        duration: 1400
      });
    }
  };
}

function initThumbFacade() {
  var thumbFacade = document.createElement('div');
  var img = new Image();
  var imgAspectRatio;
  
  thumbFacade.classList.add('thumb-facade');
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
        (thumbRect.left - window.innerWidth / 2) + 'px, ' +
        (thumbRect.top - window.innerHeight * 4 / 100) + 'px)';
      
      thumbFacade.style.transform = fromTrans;
      thumbFacade.style.display = 'block';
      event.target.style.visibility = 'hidden';
      
      return thumbFacade.animate([
        {
          // from
          transform: fromTrans
        },
        {
          // to
          transform: 'translate(-50%, 0)'
        }
      ], {
        fill: 'forwards',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: 150,
        duration: 600
      });
    },
    expandToNaturalSize: function() {
      var options = {
        fill: 'forwards',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: 150,
        duration: 600
      };
      
      var toWidth = Math.min(window.innerWidth, img.naturalWidth);
      var toHeight = toWidth / imgAspectRatio;
      
      var from = {
        maxWidth: thumbFacade.style.maxWidth,
        maxHeight: thumbFacade.style.maxHeight
      };
      
      var to = {
        maxWidth: toWidth + 'px',
        maxHeight: toHeight + 'px'
      };
  
      thumbFacade.animate([from, to], options);
      
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
  detailView.classList.add('detail-view');
  document.querySelector('.thumb-facade').appendChild(detailView);
  
  return {
    slideIn: function() {
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
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        duration: 400
      })
    }
  }
}

var pageTransition = (function() {
  var hexagonSVG = initHexagonSVG({ fillColor: '#000021' });
  var thumbFacade = initThumbFacade();
  var detailView = initDetailView();
  
  function doTransition(event) {
    event.preventDefault();
    document.body.style.overflow = 'hidden';
    
    hexagonSVG.ripple(event);
    var facadeSlide = thumbFacade.slideIn(event);
    facadeSlide.onfinish = function() {
      thumbFacade.expandToNaturalSize();
      detailView.slideIn();
    }
  }
  
  return {
    init: function(thumbs) {
      for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', doTransition);
      }
      window.onresize = getWindowSize;
    }
  };
})();

var list = document.getElementById('project-list');
pageTransition.init(list.querySelectorAll('a'));


