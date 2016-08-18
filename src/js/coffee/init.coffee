### global chrome ###

### global marked ###

### global hljs ###

###*
# Copyright (c) 2013, 2015 Constantin Loskutov,
# https://github.com/SynCap/GFMR
###

((w) ->
	d = w.document
	chUrl = chrome.extension.getURL
	# Tab icon
	lnkIcon = mkElement('link',
		rel: 'shortcut icon'
		type: 'image/x-icon'
		href: chUrl('img/gfmr.ico'))
	# Inject a references to the stylesheets.
	# var chUrl = function (path) {return path} // for non Chrome environment debuging purposes only!

	###*
	# Create HTML elements shortcut. Default parent of newly created elements
	# is a `document.head`.
	# @param  {string} tag    Tag name, as used in `document.createElement`
	# @param  {object} params Attributes to be set to element
	# @param  {string} parent Parent element for new element. <HEAD> is default
	#                         if omitted
	# @param  {object} content Inner HTML content of the element
	# @return {node}          Newly created element
	###

	mkElement = (tag, params, parent, content) ->
		e = document.createElement(tag)
		parent = parent or document.head
		if params != 'undefined' and params != null
			for prop of params
				e[prop] = params[prop]
		if content != 'undefined' and content != null
			e.innerHTML = content
		parent.appendChild e
		e

	injectCSS = (fName) ->
		mkElement 'link',
			href: chUrl('css/' + fName + '.css')
			rel: 'stylesheet'
		console.log 'CSS injected: %s', fName
		return

	injectCSS 'gfmr'
	injectCSS 'hl-night-tropicbird'
	# save inital text
	mkElement 'script', {
		type: 'text/plain'
		id: 'mdText'
	}, d.head, d.body.innerText
	console.info 'Initial text saved as script with id = `mdText`'
	# addScript("markdown");
	# d.body.innerHTML = "<div id=\"page\">" + marked(d.body.innerText) + "</div>";
	# console.log("Renderer `marked.js` fired.");
	# addScript("markdown");
	md = window.markdownit(
		html: true
		xhtmlOut: true
		breaks: false
		linkify: true
		typographer: true
		quotes: '«»‘’').use(window.markdownitDeflist).use(window.markdownitEmoji)
	d.body.innerHTML = '<div id="page">' + md.render(d.body.innerText) + '</div>'
	console.log 'Renderer `markdownit.js` fired.'
	# Run syntax hfighlighter for code. Wether we took this not for `*.md` files from `Github`?
	hljs.initHighlighting()
	console.log 'HL initialized.'
	#
	t = document.querySelector('#page h1')
	if t
		mkElement 'title', null, null, t.innerText.trim()
	[].forEach.call document.querySelectorAll('a[href^="http:"],a[href^="https:"]'), (a) ->
		a.target = '_blank'
		return
	[].forEach.call document.querySelectorAll('h1,h2,h3,h4,h5,h6'), (h) ->
		h.id = h.innerText.trim().toLowerCase().replace(/[\s\:&]+/g, '_')
		return
	return
) window
