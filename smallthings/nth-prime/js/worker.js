function primes(n) {
  var limit = estimateLimit(n);

  var prime = Array(limit + 1).fill(true);
  prime[0] = prime[1] = false;

  for (var i = 2; i * i <= limit; i++) {
    if (prime[i]) {
      for (var j = i * i; j <= limit; j += i) {
        prime[j] = false;
      }
    }
  }

  for (var i = 2, count = 0; count < n; i++) {
    if (prime[i]) count++;
  }
  return(i - 1);
}

function estimateLimit(n) {
  var firstFive = {	1: 2, 2: 3, 3: 5, 4: 7, 5: 11 };
   if (n < 6) return firstFive[n];

  return n >= 7022 ?
         Math.floor(n * Math.log(n) + n * (Math.log(Math.log(n)) - 0.9385)) :
         Math.floor(n * Math.log(n) + n * (Math.log(Math.log(n))));
}

self.addEventListener('message', function (event) {
  var before, after, t;
  before = Date.now();
  var nth = primes(event.data.n);
  after = Date.now();
  t = (after - before) / 1000;
  self.postMessage({ nth, t, n: event.data.n });
});
