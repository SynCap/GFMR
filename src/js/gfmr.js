(function(d) {

	function addScript (fName) {
		scr = d.createElement('script');
		// scr.src = fName+'.js' ;
		scr.src = chrome.exntension.getURL('js/' + fName + '.js' ) ;
		d.head.appendChild( scr );
		console.log('Script injected: '+fName);
	}

	function addStyleLink (fName) {
		var ss = d.createElement('link');
		ss.rel = 'stylesheet';
		// ss.href = fName+'.css';
		ss.href = chrome.extension.getURL('css/' + fName + '.css');
		d.head.appendChild(ss);
		console.log('Style injected: '+fName);
	}

	// addScript('markdown');
	d.body.innerHTML = '<div id="page">' + (new sd2.converter()).makeHtml(d.body.innerText) + '</div>';
	console.log('SD2 fired.');

	// Run syntax hfighlighter for code. Wether we took this not for *.md files from Github?
	// addScript('hl');
	hljs.initHighlighting();
	console.log('HL initialized.');

	// Inject a references to the stylesheets.

	addStyleLink('gfmr');
	addStyleLink('hl-github');

}(document));
