/**!
 * GFM render chrome extension, v2.1.4, Sep 22 2016
 * Copyright (c) 2013, 2015, 2016 Constantin Loskutov,
 * https://github.com/SynCap/GFMR
 * 
 * TODO: 
 * [ ] the code has grown, refactoring is needed
 */

(function (w) {

'use strict';

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
	function mkElement(tag, params, parent, content, append) {
		var e = document.createElement(tag);
		parent = parent || document.head;
		append = typeof append === 'undefined' ? true : append;

		if (params !== 'undefined' && params != null) {
			for (var prop in params) {
				if (prop === 'class')
					e.className = params[prop];
				else 
					e[prop] = params[prop];
			}
		}

		if (content !== 'undefined' && content != null) {
			e.innerHTML = content;
		}

		if (append)
			parent.appendChild(e);

		return e;
	}


	/**
	 * link the CSS file as `link` tag
	 *
	 * @param      {string}  fName   path to css
	 */
	function injectCSS(fName) {
		mkElement('link', { href: chUrl('css/' + fName + '.css'), rel: 'stylesheet' });
		console.log('CSS injected: %s', fName);
	}

	// =========================================================
	
	function getBlockLineCount(text) {
		if (text.length === 0) return 0;

		var regExp = /\r\n|\r|\n/g;
		var lines = text.match(regExp);
		lines = lines ? lines.length : 0;

		if (!text[text.length - 1].match(regExp)) {
			lines += 1;
		}

		return lines;
	}

	function addBlockLineNumbers (element) {
		if (typeof element !== 'object') return;

		var parent = element.parentNode;
		var lines = getBlockLineCount(element.textContent);

		if (lines > 1) {
			var l = '';
			for (var i = 0; i < lines; i++) {
				l += (i + 1) + '\n';
			}

			var linesPanel = document.createElement('code');
			linesPanel.className = 'hljs hljs-line-numbers';
			linesPanel.style.float = 'left';
			linesPanel.textContent = l;

			parent.insertBefore(linesPanel, element);
			
			parent.classList.add('zebra');
		}

		/*if (lines > 3) {
			parent.classList.add('zebra');
		}*/
	}

	/**
	 * Change objects by selector and callback function
	 *
	 * @param {any} selector	valid selector of objects to change to
	 * @param {any} cb			modification function - f(object, index)
	 */
	function changeTo(selector, cb) {
		// not needed when for…of is working
		[].forEach.call( document.querySelectorAll(selector), cb);
		//  uglifier wan't work :(
		// for ( let obj of document.querySelectorAll(selector) ) cb(obj);
	}

	// =========================================================

	// Tab icon
	// const lnkIcon =
	mkElement('link', {
		rel: 'shortcut icon',
		type: 'image/x-icon',
		href: chUrl('img/gfmr.ico')
	});

	// Inject a references to the stylesheets.
	injectCSS('gfmr');

	// save inital text
	mkElement('script', { type: 'text/plain', id: 'mdText' }, d.head, d.body.innerText);
	console.info('Initial text saved as script with id = `mdText`');

	// addScript("markdown");
	var md = window.markdownit({
		html: true,
		xhtmlOut: true,
		breaks: false,
		linkify: true,
		typographer: true,
		quotes: '«»‘’'
	})
		.use(window.markdownitDeflist)
		.use(window.markdownitEmoji);
	d.body.innerHTML = '<div id="page">' + md.render(d.body.innerText) + '</div>';
	console.log('Renderer `markdownit.js` fired.');

	// Run syntax hfighlighter for code.
	// Wether we took this not for `*.md` files from `Github`?
	hljs.initHighlighting();
	console.log('HL initialized.');

	// Set document title
	var t = document.querySelector('#page h1');
	if (t) {
		mkElement('title', null, null, t.innerText.trim());
	}

	// uglifier don't understand es6 arrow funcion declaration
	// var changeTo = (selector, cb) => {[].forEach.call( document.querySelectorAll(selector), cb);}

	changeTo('code.hljs', addBlockLineNumbers );
	console.log('HL line numbers initialized.');

	// target for external links
	changeTo(
		'a[href^="http:"],a[href^="https:"]',
		// uglifier don't understand es6 arrow funcion declaration
		// a => { a.target = '_blank'; a.classList.add('external'); }
		function (a) { a.target = '_blank'; a.classList.add('external'); }
	);

	// id values for headings, to be anchors for internal links,
	// for example: [go to](#element_s_content)
	changeTo(
		'h1,h2,h3,h4,h5,h6',
		// uglifier don't understand es6 arrow funcion declaration
		// h => { h.id = h.innerText.trim().toLowerCase().replace(/\W+/g, '-'); h.classList.add('anchored'); }
		// TODO: if content is in non-latin it must be salted or translited
		function (h) { h.id = h.innerText.trim().toLowerCase().replace(/\W+/g, '-'); h.classList.add('anchored'); }
	);

	// checklists
	/*changeTo(
		'li',
		l => { l.innerHTML.replace(/^\[([ x?v])\]/i, (m, x) => '<i class="checkmark-' + ('xX?vV'.indexOf(x)+1)?' checked':'empty' + '"></i>' ); };
	);*/
	// just stirp all found textual checkmarks
	// they must be at start of <li> element after rendering
	// but remember, what we've erased
	changeTo(
		'li',
		function (l) { 
			l.innerHTML = l.innerHTML.replace(/^\[([ \-?vx])\]/i, 
				function(m, x) {
					l.classList.add('chkm-' + ('xXvV'.indexOf(x)+1?'yes':'no'));  
					return ''; 
				}
			);
		}
	);

	var menu = mkElement('ul', {'id':'mainMenu', 'class' : 'mainmenu'}, document.body);
	var miToc = mkElement('li', {'id':'btnShowToc', 'class':'icn-toc', 'title':'Table of\nContents'}, menu, ' ');
	var miTune = mkElement('li', {'id':'btnShowProps', 'class':'icn-tune-v', 'title': 'Tune settings'}, menu, ' ');

	var ovrToc = mkElement('div', {'id':'ovrToc', 'class': 'overlay hidden'}, document.body);
	var lstToc = mkElement('ul', {'id': 'lstToc', 'class': 'toc-list'}, ovrToc);
	var btnTocClose = mkElement('div', {'class':'btn-close'}, ovrToc, '&#10060;'); // &#10060; 9760

	changeTo('h1,h2,h3,h4,h5,h6', function(h){
		var liToc = mkElement('li',{'class': 'toc-item-' + h.tagName.toLowerCase()}, lstToc);
		mkElement('a',{'href':'#'  +h.id, 'class': 'toc-link'}, liToc, h.innerHTML).
			addEventListener('click', function(e){
				e.stopPropagation();
			});

	});

	changeTo('.overlay', function(ovr){
		ovr.addEventListener('click',function(){
			ovrToc.classList.add('hidden');
		});
	});

	miToc.addEventListener('click', function(){
		ovrToc.classList.remove('hidden');
	});

	btnTocClose.addEventListener('click', function(){
		ovrToc.classList.add('hidden');
	});

} (window));
