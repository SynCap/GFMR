/**
 * Copyright (c) 2013, 2015 Constantin Loskutov,
 * www.syncap.ru, <syncap.ru@gmail.com>
 */

(function(d) {

	var chUrl = chrome.extension.getURL;
	// var chUrl = function (path) {return path} // for non Chrome environment debuging purposes only!

	function injectCSS (fName) {
		var type = 'css';
		var e = d.createElement("link");
		e.href = chUrl( type + "/" + fName + "." + type );
		e.rel = "stylesheet";
		d.head.appendChild(e);
		console.log("Inject <%s>: %s", type, fName);
	}

	// Inject a references to the stylesheets.
	injectCSS("gfmr");
	injectCSS("hl-github");

	// addScript("markdown");
	d.body.innerHTML = "<div id=\"page\">" + (new sd2.converter()).makeHtml(d.body.innerText) + "</div>";
	console.log("SD2 fired.");

	// Run syntax hfighlighter for code. Wether we took this not for `*.md` files from `Github`?
	// addScript("hl");
	hljs.initHighlighting();
	console.log("HL initialized.");

}(document));
