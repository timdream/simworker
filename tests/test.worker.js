onmessage = function(event) {
	var t = (new Date()).getTime();
	while (true) {
		if ((new Date()).getTime() - t > 3000) break;
	}
	postMessage(event.data);
};
