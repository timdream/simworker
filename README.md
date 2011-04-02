Simulated Web Workers Interface
==========================

Web Workers for IEs and Mobile Safari.

Auther: Timothy Chien &lt;timdream@gmail.com&gt;

## Usage

Same as the native Web Workers, except a few things to note:
 
1. Before initializing, set the path of IFRAME page that used to crate the 
   worker scope at `window.Worker.iframeURI`.
2. The path of script for the native Web Workers is relative to the document
   URL. Set `window.Worker.baseURI` to tell IFRAME where to find your script.
3. Native Web Workers will be recycled automatically, simulated Worker lived
   in IFRAME that can only be removed by executing `worker.terminate()` 
   explicitly when you finish using Worker.

# What it does

This script creates a Worker interface for browsers without it. When you create 
a instance of it, it opens up an IFRAME, prepare the necessary functions, inject 
your script into it, and listened to `worker.postMessage()` issued and process
`onmessage` event just like a native Worker.

# What it doesn't to

The script doesn't do the magic of taking the task background. Executions still 
block UI, and like any other foreground functions they are subjected to runaway 
timer imposed by the browser. Due to the reason addressed above, not all worker 
programs are suitable to use simulated worker.

For a long complication, you could modify the loop using 
`setTimeout(function () { ... }, 0);` to prevent UI blocking.

Please check the testcases' code for example.