/**!
 * Copyright (c) 2013, 2015 Constantin Loskutov,
 * https://github.com/SynCap/GFMR
 */

(function(w) {

	var d = w.document;
	var chUrl = chrome.extension.getURL;
	// var chUrl = function (path) {return path} // for non Chrome environment debuging purposes only!

	/**
	 * Create HTML elements shortcut. Default parent of newly created elements
	 * is a `document.head`.
	 * @param  {string} tag    Tag name, as used in `document.createElement`
	 * @param  {object} params Attributes to be set to element
	 * @param  {string} parent Parent element for new element. <HEAD> is default
	 *                         if omitted
	 * @param  {object} content Inner HTML content of the element
	 * @return {node}          Newly created element
	 */
	function mkElement (tag, params, parent, content) {
		var e = document.createElement(tag);
		parent = parent || document.head;
		
		if (params !== 'undefined' && params != null) {
			for (var prop in params) {
				e[prop] = params[prop];
			}			
		}

		if (content !== 'undefined' && content != null) {
			e.innerHTML = content;
		}

		parent.appendChild(e);
		return e;
	}

	
	/**
	 * link the CSS file as `link` tag
	 *
	 * @param      {string}  fName   path to css
	 */
	function injectCSS (fName) {
		mkElement('link',{href:chUrl( 'css/' + fName + '.css' ),rel:"stylesheet"})
		console.log("CSS injected: %s", fName);
	}

	// Tab icon
	var lnkIcon = mkElement('link',{
		rel: "shortcut icon",
		type: "image/x-icon",
		href: chUrl('img/gfmr.ico')
	});

	// Inject a references to the stylesheets.
	injectCSS("gfmr");

	// save inital text
	mkElement('script', {type:'text/plain',id:'mdText'}, d.head, d.body.innerText);
	console.info('Initial text saved as script with id = `mdText`');

	// addScript("markdown");
	var md = window.markdownit({
		  html:         true,       
		  xhtmlOut:     true,       
		  breaks:       false,      
		  linkify:      true,       
		  typographer:  true,
		  quotes: '«»‘’'
	})
		.use(window.markdownitDeflist)
		.use(window.markdownitEmoji);
	d.body.innerHTML = "<div id=\"page\">" + md.render(d.body.innerText) + "</div>";
	console.log("Renderer `markdownit.js` fired.");

	// Run syntax hfighlighter for code. Wether we took this not for `*.md` files from `Github`?
	hljs.initHighlighting();
	console.log("HL initialized.");
	[].forEach.call(document.querySelectorAll('code.hl-js'), hljs.lineNumbersBlock );
	console.log("HL line numbers initialized.");
	// 
	var t = document.querySelector('#page h1');
	if (t) {
		mkElement('title', null, null, t.innerText.trim() );
	}

	// target for external links
	[].forEach.call(
		document.querySelectorAll('a[href^="http:"],a[href^="https:"]'), 
		function(a){a.target = '_blank'; }
	);
	// id values for headings, to be anchors for internal links, 
	// for example: [go to](#element_s_content) 
	[].forEach.call(
		document.querySelectorAll('h1,h2,h3,h4,h5,h6'),
		function(h){h.id=h.innerText.trim().toLowerCase().replace(/[\s\:&]+/g,'_')}
	);
	
}(window));