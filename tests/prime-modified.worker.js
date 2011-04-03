var send = (typeof workerPostMessage !== 'undefined')?workerPostMessage:postMessage;

var n = 1;

function find () {
  n += 1;
  for (var i = 2; i <= Math.sqrt(n); i += 1)
    if (n % i == 0)
      return;
  // found a prime!
  send(n);
}

if (typeof window === 'undefined') { // We are in Worker scope
  search: while (true) {
    find();
  }
} else {
  function next() {
    find();
    setTimeout(
      next,
      0
    );
  }
  next();
}