document.addEventListener('click', function(e) {
  var el = e.target;

  while (el && !el.href) {
    el = el.parentNode;
  }

  if (el) {
    e.preventDefault();
    history.pushState(null, null, el.href);
    changePage();

    return;
  }
})

window.addEventListener('popstate', changePage);

var main = document.querySelector('main');
var fetchError = '<div class="cc"><h1>Error fetching content :(</h1></div>';

function loadPage(url) {
  return fetch(url, {
    method: 'GET'
  }).then(function(response) {
    if (response.ok) {
      return response.text();
    }
    return fetchError;
  }).catch(function(err) {
    return fetchError;
  });
}

function changePage() {
  var url = window.location.href;

  loadPage(url).then(function(responseText) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = responseText;

    var oldContent = document.querySelector('.cc');
    var newContent = wrapper.querySelector('.cc');

    main.insertBefore(newContent, main.firstChild);
    animate(oldContent, newContent);
  });
}

function animate(oldContent, newContent) {
  newContent.style.position = 'absolute';
  newContent.style.width = '40em';

  var fadeOut = oldContent.animate({
    opacity: [1, 0]
  }, 300);

  var fadeIn = newContent.animate({
    opacity: [0, 1]
  }, 300);

  fadeIn.onfinish = function() {
    oldContent.parentNode.removeChild(oldContent);
    newContent.style.position = '';
    newContent.style.width = '';
  };
}
