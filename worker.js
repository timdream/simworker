"use strict";

if (!window.Worker || window.forceIframeWorker) {
	if (window.Worker) window.nativeWorker = window.Worker;
	window.Worker = function (script) {
		var worker = this;

		// prepare and inject iframe
		worker._iframeEl = document.createElement('iframe');
		worker._iframeEl.style.visibility = 'hidden';
		worker._iframeEl.style.width = '1px';
		worker._iframeEl.style.height = '1px';
		worker._iframeEl.onload = worker._iframeEl.onreadystatechange = function () {
			if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") return;
			worker._iframeEl.onload = worker._iframeEl.onreadystatechange = null;
			var w = this.contentWindow,
			doc = this.contentWindow.document;
			
			function injectScript(script, callback) {
				var scriptEl = doc.createElement('script');
				scriptEl.src = script;
				scriptEl.type = 'text/javascript';
				scriptEl.onload = scriptEl.onreadystatechange = function () {
					if (scriptEl.readyState && scriptEl.readyState !== "loaded" && scriptEl.readyState !== "complete") return;
					scriptEl.onload = scriptEl.onreadystatechange = null;
					doc.body.removeChild(scriptEl);
					scriptEl = null;
					if (callback) {
						callback();
					}
				};
				doc.body.appendChild(scriptEl);
			}

			// Some interfaces within the Worker scope.
			
			w.Worker = window.Worker; // yes, worker could spawn another worker!
			w.onmessage = function (ev) {}; // placeholder function
			var postMessage = function (data) {
				if (typeof worker.onmessage === 'function') {
					worker.onmessage.call(
						worker,
						{
							currentTarget: worker,
							timeStamp: (new Date()).getTime(),
							srcElement: worker,
							target: worker,
							data: data
						}
					);
				}
			};
			w.postMessage = w.workerPostMessage = postMessage;
			if (w.postMessage !== postMessage) {
				// IE doesn't allow overwriting postMessage
			}
			w.close = function () {
				worker.terminate();
			};
			w.importScripts = function () {
				for (var i = 0; i < arguments.length; i++) {
					injectScript(window.Worker.baseURI + arguments[i]);
				}
			}

			// inject worker script into iframe			
			injectScript(window.Worker.baseURI + script, function () {
				worker._quere.push = function (callback) {
					if (!worker._unloaded) {
						callback();
					}
				};
				if (!worker._unloaded) {
					while (worker._quere.length) {
						(worker._quere.shift())();
					}
				}
			});
		};
		this._iframeEl.src = window.Worker.iframeURI;
		(document.getElementsByTagName('head')[0] || document.body).appendChild(this._iframeEl);
		
		worker._quere = [];
		worker._unloaded = false;
	};
	window.Worker.prototype.postMessage = function (obj) {
		var worker = this;
		setTimeout(
			function () {
				worker._quere.push(
					function () {
						// IE8 throws an error if we call worker._iframeEl.contentWindow.onmessage() directly
						var win = worker._iframeEl.contentWindow, onmessage = win.onmessage;
						onmessage.call(win, {data:obj});
					}
				);
			},
			0
		);
	};
	window.Worker.prototype.terminate = function () {
		if (!this._unloaded) {
			(document.getElementsByTagName('head')[0] || document.body).removeChild(this._iframeEl);
		}
		this._iframeEl = null;
		this._unloaded = true;
	};
	window.Worker.prototype.addEventListener = function () {
	};
	window.Worker.prototype.removeEventListener = function () {
	};
	
	window.Worker.notNative = true;
	window.Worker.iframeURI = './worker.iframe.html';
	window.Worker.baseURI = '';
}
