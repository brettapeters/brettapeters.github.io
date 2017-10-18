// Get all of the images that are marked up to lazy load
var images = document.querySelectorAll('.js-lazy-image');

function preloadImage(image) {
  var height = image.dataset.height;
  var src = image.dataset.src;
  if (!src || !height) {
    return;
  }
  image.style.height = height;
  image.style.backgroundImage = 'url(' + src + ')';
}

// If we don't have support for intersection observer, load the images immediately
if (!('IntersectionObserver' in window)) {
  Array.prototype.forEach.call(images, preloadImage);
} else {
  // It is supported, lazy load the images
  var config = {
    // If the image gets within 50px in the Y axis, start the download.
    rootMargin: '50px 0px',
    threshold: 0.01
  };

  // The observer for the images on the page
  var observer = new IntersectionObserver(onIntersection, config);

  // Observe each of the images
  Array.prototype.forEach.call(images, function(image) {
    observer.observe(image);
  });

  // When an image intersects, stop observing it and preload it
  function onIntersection(entries) {
    // Loop through the entries
    entries.forEach(function(entry) {
      // Are we in viewport?
      if (entry.intersectionRatio > 0) {

        // Stop watching and load the image
        observer.unobserve(entry.target);
        preloadImage(entry.target);
      }
    });
  }
}