//
// sd2.js  -- A javascript port of Markdown
// (c) 2013, Constantin Loskutov, www.syncap.ru
//
// Based on showdown.js, Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Most differencies:
// 	  1. GitHub style code blocks i.e.:
//
// 	  		``` LanguageName
// 	  		   ...  Preformatted code ....
// 	  		```
//
// 	  2. Tables in GFM styele:
//
// 	  		___Test 1___
// 	  		| Header 1 | Header 2
// 	  		| -------- | --------
// 	  		| Cell 1   | *Cell 2*
// 	  		| `Cell 3` | Cell 4
// 	  		_AfterTable 1_
//
// 	  		***Test 2***
// 	  		Header A | Header B
// 	  		---------|--------:
// 	  	 	Cell c   | Cell d
// 	  	  Cell e   | Cell f
// 	  	  Cell g   | Cell h
// 	  	  Cell i   | Cell j
// 	  	  _AfterTable 2_
//
//
// 	  		Header dividing line may consist of "-", "|" or ":".
// 	  		Use ":" before "|" to set right align for cell, after for left align.
// 	  		To set center align for cell use ":" on both side of cell next to "|"
//
//
//
//
// Usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new sd2.converter();
//   var html = converter.makeHtml(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//

var sd2 = sd2 || {};

//
// converter
//
// Wraps all "globals" so that the only thing
// exposed is makeHtml().
//
sd2.converter = function() {

//
// Globals:
//

// Global hashes, used by various utility routines
var g_urls;
var g_titles;
var g_html_blocks;

// Used to track when we're inside an ordered or unordered list
// (see _processListItems() for details):
var g_list_level = 0;


this.makeHtml = function(text) {
//
// Main function. The order in which other subs are called here is
// essential. Link and image substitutions need to happen before
// _escapeSpecialCharsWithinTagAttributes(), so that any *'s or _'s in the <a>
// and <img> tags get encoded.
//

	// Clear the global hashes. If we don't clear these, you get conflicts
	// from other articles when generating a page which contains more than
	// one article (e.g. an index page that shows the N most recent
	// articles):
	g_urls = [];
	g_titles = [];
	g_html_blocks = [];


	// Standardize line endings
	text = text.replace(/\r\n/g,"\n"); // DOS to Unix
	text = text.replace(/\r/g,"\n"); // Mac to Unix

	// Make sure text begins and ends with a couple of newlines:
	text = "\n\n" + text + "\n\n";

	// SynCap:
	// Ensure multiline GitHub style codeblocks are HTML blocks before
	// further porcessing, as markdown samples can be present in source
	text = _namedCodeBlocks(text);

	// attacklab: Replace ~ with ~T
	// This lets us use tilde as an escape char to avoid md5 hashes
	// The choice of character is arbitray; anything that isn't
		// magic in Markdown will work.
	text = text.replace(/~/g,"~T");

	// attacklab: Replace $ with ~D
	// RegExp interprets $ as a special character
	// when it's in a replacement string
	text = text.replace(/\$/g,"~D");

	// Convert all tabs to spaces.
	text = _deTab(text);

	// Strip any lines consisting only of spaces and tabs.
	// This makes subsequent regexen easier to write, because we can
	// match consecutive blank lines with /\n+/ instead of something
	// contorted like /[ \t]*\n+/ .
	text = text.replace(/^[ \t]+$/mg,"");

	// Turn block-level HTML blocks into hash entries
	text = _hashHTMLBlocks(text);

	// Strip link definitions, store in hashes.
	text = _stripLinkDefinitions(text);

	// SynCap:
	// render tables
	text = _Tables(text);

	text = _runBlockGamut(text);

	text = _unescapeSpecialChars(text);

	text = text.replace(/\(c\)/gi, "&copy;");
	text = text.replace(/\(r\)/gi, "&reg;");
	text = text.replace(/^[CcFf]\B/gi, "&deg;"); // degree sign with Celsium and Fahrengeit, ie °C
	text = text.replace(/\(tm\)/gi, "&trade;");

	// attacklab: Restore dollar signs
	text = text.replace(/~D/g,"$$");

	// attacklab: Restore tildes
	text = text.replace(/~T/g,"~");

	return text;
};

var _namedCodeBlocks = function(text) {
	/*
		/
		^```								 starting point
			([^\n]*)\n				 language descriptor (name) if any
			((.*\n)*?)				 body of code block. Hmmm. used this, because in Chrome (.*?) doesn't work. why?
		```\n								 block terminator
		/gm

	*/
	return text.replace( /^(```|~+)\s*([^\n]*)(([^\n]*\n)*?)\1\n/mg ,
		function (blockText, type, langName, codeText) {
			return '<pre><code'+(( ( s = langName.trim() ) !== '')? ' class="'+ s +'"':'')+'>'+ (codeText.replace(/</g,'&lt;').trim()) +'</code></pre>';
		}
	);
};

 /**
	* Render HTML tables.
	*/
var _Tables = function ( text ) {

	function _doTable( str, head, underline, content) {
		// Remove any tailing pipes for each line.
		head = head.replace(/[|] *$/m, '');
		underline = underline.replace(/[|] *$/m, '');
		content = content.replace(/[|] *$/m, '');

		var attr = [];

		// Reading alignment from header underline.
		var cols = underline.split(/[ ]*[|][ ]*/);
		var n;
		for(n = 0; n < cols.length; n++) {
			var s = cols[n];
			if (s.match(/^ *-+: *$/))       { attr[n] = ' align="right"'; }
			else if (s.match(/^ *:-+: *$/)) { attr[n] = ' align="center"'; }
			else if (s.match(/^ *:-+ *$/))  { attr[n] = ' align="left"'; }
			else                            { attr[n] = ''; }
		}

		var headers = head.split(/ *[|] */);
		var col_count = headers.length;

		// Write column headers.
		var text = "<table>\n";
		text += "<thead>\n";
		text += "<tr>\n";
		for(n = 0; n < headers.length; n++) {
			text += "  <th" + attr[n] + ">" + _RunSpanGamut(headers[n].trim()) + "</th>\n";
		}
		text += "</tr>\n";
		text += "</thead>\n";

		// Split content by row.
		var rows = content.replace(/(^\n*|\n*$)/g , '') .split("\n");

		text += "<tbody>\n";
		for(var i = 0; i < rows.length; i++) {
			var row = rows[i];

			// Split row by cell.
			var row_cells = row.split(/ *[|] */, col_count);
			while(row_cells.length < col_count) { row_cells.push(''); }

			text += "<tr>\n";
			for(n = 0; n < row_cells.length; n++) {
				text += "  <td" + attr[n] + ">" +  _RunSpanGamut( row_cells[n].trim() )  + "</td>\n";
			}
			text += "</tr>\n";
		}
		text += "</tbody>\n</table>\n";

		return text;
	}

	text = text.replace(  /^[ ]{0,3}[|]([^\n]+)\n[ ]{0,3}[|]([ ]*[\-:]+[\-| :]*)\n((?:(?=([ ]*[|][^\n]*\n))\4)*)/mg,
		function ( str, head, underline, content) {
		//# Remove leading pipes in data rows.
			content = content.replace( /^ *[|]/mg, '' );
			return _doTable ( str, head, underline, content);
		}
	);

	text = text.replace( /^[ ]{0,3}(\S[^\n]*[|][^\n]*)\n[ ]{0,3}([\-:]+[ ]*[|][\-| :]*)\n((?:(?=([^\n]*[|][^\n]*\n))\4)*)/mg,
		_doTable );

	return text;
};

var _stripLinkDefinitions = function(text) {
//
// Strips link definitions from text, stores the URLs and titles in
// hash references.
//

	// Link defs are in the form: ^[id]: url "optional title"

	/*
		var text = text.replace(/
				^[ ]{0,3}\[(.+)\]:  // id = $1  attacklab: g_tab_width - 1
					[ \t]*
					\n?				// maybe *one* newline
					[ \t]*
				<?(\S+?)>?			// url = $2
					[ \t]*
					\n?				// maybe one newline
					[ \t]*
				(?:
					(\n*)				// any lines skipped = $3 attacklab: lookbehind removed
					["(]
					(.+?)				// title = $4
					[")]
					[ \t]*
				)?					// title is optional
				(?:\n+|$)
				/gm,
				function(){...});
	*/

	function collectLinks (wholeMatch,m1,m2,m3,m4) {
		m1 = m1.toLowerCase();
		g_urls[m1] = _encodeAmpsAndAngles(m2);  // Link IDs are case-insensitive
		if (m3) {
			// Oops, found blank lines, so it's not a title.
			// Put back the parenthetical statement we stole.
			return m3+m4;
		} else if (m4) {
			g_titles[m1] = m4.replace(/"/g,"&quot;");
		}

		// Completely remove the definition from the text
		return "";
	}

		text =	text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm, collectLinks );

	return text;
};

var _hashHTMLBlocks = function(text) {
	// attacklab: Double up blank lines to reduce lookaround
	text = text.replace(/\n/g,"\n\n");

	// Hashify HTML blocks:
	// We only want to do this for block-level HTML tags, such as headers,
	// lists, and tables. That's because we still want to wrap <p>s around
	// "paragraphs" that are wrapped in non-block-level tags, such as anchors,
	// phrase emphasis, and spans. The list of tags we're looking for is
	// hard-coded:
	var block_tags_a = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";
	var block_tags_b = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";

	// First, look for nested blocks, e.g.:
	//   <div>
	//     <div>
	//     tags for inner block must be indented.
	//     </div>
	//   </div>
	//
	// The outermost tags must start at the left margin for this to match, and
	// the inner nested divs must be indented.
	// We need to do this before the next, more liberal match, because the next
	// match will start at the first `<div>` and stop at the first `</div>`.

	// attacklab: This regex can be expensive when it fails.
	/*
		var text = text.replace(/
		(            // save in $1
			^          // start of line  (with /m)
			<($block_tags_a)	// start tag = $2
			\b          // word break
								// attacklab: hack around khtml/pcre bug...
			[^\r]*?\n      // any number of lines, minimally matching
			</\2>        // the matching end tag
			[ \t]*        // trailing spaces/tabs
			(?=\n+)        // followed by a newline
		)            // attacklab: there are sentinel newlines at end of document
		/gm,function(){...}};
	*/
	text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,hashElement);

	//
	// Now match more liberally, simply from `\n<tag>` to `</tag>\n`
	//

	/*
		var text = text.replace(/
		(            // save in $1
			^          // start of line  (with /m)
			<($block_tags_b)	// start tag = $2
			\b          // word break
								// attacklab: hack around khtml/pcre bug...
			[^\r]*?        // any number of lines, minimally matching
			.*</\2>        // the matching end tag
			[ \t]*        // trailing spaces/tabs
			(?=\n+)        // followed by a newline
		)            // attacklab: there are sentinel newlines at end of document
		/gm,function(){...}};
	*/
	text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,hashElement);

	// Special case just for <hr />. It was easier to make a special case than
	// to make the other regex more complicated.

	/*
		text = text.replace(/
		(            // save in $1
			\n\n        // Starting after a blank line
			[ ]{0,3}
			(<(hr)				// start tag = $2
			\b          // word break
			([^<>])*?      //
			\/?>)        // the matching end tag
			[ \t]*
			(?=\n{2,})      // followed by a blank line
		)
		/g,hashElement);
	*/
	text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,hashElement);

	// Special case for standalone HTML comments:

	/*
		text = text.replace(/
		(            // save in $1
			\n\n        // Starting after a blank line
			[ ]{0,3}      // attacklab: g_tab_width - 1
			<!
			(--[^\r]*?--\s*)+
			>
			[ \t]*
			(?=\n{2,})      // followed by a blank line
		)
		/g,hashElement);
	*/
	text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,hashElement);

	// PHP and ASP-style processor instructions (<?...?> and <%...%>)

	/*
		text = text.replace(/
		(?:
			\n\n        // Starting after a blank line
		)
		(            // save in $1
			[ ]{0,3}      // attacklab: g_tab_width - 1
			(?:
				<([?%])			// $2
				[^\r]*?
				\2>
			)
			[ \t]*
			(?=\n{2,})      // followed by a blank line
		)
		/g,hashElement);
	*/
	text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,hashElement);

	// attacklab: Undo double lines (see comment at top of this function)
	text = text.replace(/\n\n/g,"\n");
	return text;
}

var hashElement = function(wholeMatch,m1) {
	var blockText = m1;

	// Undo double lines
	blockText = blockText.replace(/\n\n/g,"\n");
	blockText = blockText.replace(/^\n/,"");

	// strip trailing blank lines
	blockText = blockText.replace(/\n+$/g,"");

	// Replace the element text with a marker ("~KxK" where x is its key)
	blockText = "\n\n~K" + (g_html_blocks.push(blockText)-1) + "K\n\n";

	return blockText;
};

var _runBlockGamut = function(text) {
//
// These are all the transformations that form block-level
// tags like paragraphs, headers, and list items.
//
	text = _doHeaders(text);

	// Do Horizontal Rules:
	var key = hashBlock("<hr />");
	text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);
	text = text.replace(/^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm,key);
	text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm,key);

	text = _doLists(text);
	text = _doCodeBlocks(text);
	text = _doBlockQuotes(text);

	// We already ran _hashHTMLBlocks() before, in Markdown(), but that
	// was to escape raw HTML in the original Markdown source. This time,
	// we're escaping the markup we've just created, so that we don't wrap
	// <p> tags around block-level tags.
	text = _hashHTMLBlocks(text);
	text = _FormParagraphs(text);

	return text;
};


var _RunSpanGamut = function(text) {
//
// These are all the transformations that occur *within* block-level
// tags like paragraphs, headers, and list items.
//

	text = _doCodeSpans(text);
	text = _escapeSpecialCharsWithinTagAttributes(text);
	text = _encodeBackslashEscapes(text);

	// Process anchor and image tags. Images must come first,
	// because ![foo][f] looks like an anchor.
	text = _doImages(text);
	text = _doAnchors(text);

	// Make links out of things like `<http://example.com/>`
	// Must come after _doAnchors(), because you can use < and >
	// delimiters in inline links like [this](<url>).
	text = _doAutoLinks(text);
	text = _encodeAmpsAndAngles(text);
	text = _doItalicsAndBold(text);

	// Do hard breaks:
	text = text.replace(/ {2,}\n/g," <br />\n");

	return text;
}

var _escapeSpecialCharsWithinTagAttributes = function(text) {
//
// Within tags -- meaning between < and > -- encode [\ ` * _] so they
// don't conflict with their use in Markdown for code, italics and strong.
//

	// Build a regex to find HTML tags and comments.  See Friedl's
	// "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
	var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

	text = text.replace(regex, function(wholeMatch) {
		var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");
		tag = escapeCharacters(tag,"\\`*_");
		return tag;
	});

	return text;
}

var _doAnchors = function(text) {
//
// Turn Markdown link shortcuts into XHTML <a> tags.
//
	//
	// First, handle reference-style links: [link text] [id]
	//

	/*
		text = text.replace(/
		(              // wrap whole match in $1
			\[
			(
				(?:
					\[[^\]]*\]    // allow brackets nested one level
					|
					[^\[]      // or anything else
				)*
			)
			\]

			[ ]?          // one optional space
			(?:\n[ ]*)?        // one optional newline followed by spaces

			\[
			(.*?)          // id = $3
			\]
		)()()()()          // pad remaining backreferences
		/g,_doAnchors_callback);
	*/
	text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeAnchorTag);

	//
	// Next, inline-style links: [link text](url "optional title")
	//

	/*
		text = text.replace(/
			(            // wrap whole match in $1
				\[
				(
					(?:
						\[[^\]]*\]  // allow brackets nested one level
					|
					[^\[\]]      // or anything else
				)
			)
			\]
			\(            // literal paren
			[ \t]*
			()            // no id, so leave $3 empty
			<?(.*?)>?        // href = $4
			[ \t]*
			(            // $5
				(['"])        // quote char = $6
				(.*?)        // Title = $7
				\6          // matching quote
				[ \t]*        // ignore any spaces/tabs between closing quote and )
			)?            // title is optional
			\)
		)
		/g,writeAnchorTag);
	*/
	text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag);

	//
	// Last, handle reference-style shortcuts: [link text]
	// These must come last in case you've also got [link test][1]
	// or [link test](/foo)
	//

	/*
		text = text.replace(/
		(               // wrap whole match in $1
			\[
			([^\[\]]+)        // link text = $2; can't contain '[' or ']'
			\]
		)()()()()()          // pad rest of backreferences
		/g, writeAnchorTag);
	*/
	text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);

	return text;
}

var writeAnchorTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
	if (m7 == undefined) m7 = "";
	var whole_match = m1;
	var link_text   = m2;
	var link_id	 = m3.toLowerCase();
	var url		= m4;
	var title	= m7;

	if (url == "") {
		if (link_id == "") {
			// lower-case and turn embedded newlines into spaces
			link_id = link_text.toLowerCase().replace(/ ?\n/g," ");
		}
		url = "#"+link_id;

		if (g_urls[link_id] != undefined) {
			url = g_urls[link_id];
			if (g_titles[link_id] != undefined) {
				title = g_titles[link_id];
			}
		}
		else {
			if (whole_match.search(/\(\s*\)$/m)>-1) {
				// Special case for explicit empty url
				url = "";
			} else {
				return whole_match;
			}
		}
	}

	url = escapeCharacters(url,"*_");
	var result = "<a href=\"" + url + "\"";

	if (title != "") {
		title = title.replace(/"/g,"&quot;");
		title = escapeCharacters(title,"*_");
		result +=  " title=\"" + title + "\"";
	}

	result += ">" + link_text + "</a>";

	return result;
}


var _doImages = function(text) {
//
// Turn Markdown image shortcuts into <img> tags.
//

	//
	// First, handle reference-style labeled images: ![alt text][id]
	//

	/*
		text = text.replace(/
		(            // wrap whole match in $1
			!\[
			(.*?)        // alt text = $2
			\]

			[ ]?        // one optional space
			(?:\n[ ]*)?      // one optional newline followed by spaces

			\[
			(.*?)        // id = $3
			\]
		)()()()()        // pad rest of backreferences
		/g,writeImageTag);
	*/
	text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeImageTag);

	//
	// Next, handle inline images:  ![alt text](url "optional title")
	// Don't forget: encode * and _

	/*
		text = text.replace(/
		(            // wrap whole match in $1
			!\[
			(.*?)        // alt text = $2
			\]
			\s?          // One optional whitespace character
			\(          // literal paren
			[ \t]*
			()          // no id, so leave $3 empty
			<?(\S+?)>?      // src url = $4
			[ \t]*
			(          // $5
				(['"])      // quote char = $6
				(.*?)      // title = $7
				\6        // matching quote
				[ \t]*
			)?          // title is optional
		\)
		)
		/g,writeImageTag);
	*/
	text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeImageTag);

	return text;
}

var writeImageTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
	var whole_match = m1;
	var alt_text   = m2;
	var link_id	 = m3.toLowerCase();
	var url		= m4;
	var title	= m7;

	if (!title) title = "";

	if (url == "") {
		if (link_id == "") {
			// lower-case and turn embedded newlines into spaces
			link_id = alt_text.toLowerCase().replace(/ ?\n/g," ");
		}
		url = "#"+link_id;

		if (g_urls[link_id] != undefined) {
			url = g_urls[link_id];
			if (g_titles[link_id] != undefined) {
				title = g_titles[link_id];
			}
		}
		else {
			return whole_match;
		}
	}

	alt_text = alt_text.replace(/"/g,"&quot;");
	url = escapeCharacters(url,"*_");
	var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";

	// attacklab: Markdown.pl adds empty title attributes to images.
	// Replicate this bug.

	//if (title != "") {
		title = title.replace(/"/g,"&quot;");
		title = escapeCharacters(title,"*_");
		result +=  " title=\"" + title + "\"";
	//}

	result += " />";

	return result;
}


var _doHeaders = function(text) {

	// Setext-style headers:
	//  Header 1
	//  ========
	//
	//  Header 2
	//  --------
	//
	text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,
		function(wholeMatch,m1){return hashBlock("<h1>" + _RunSpanGamut(m1) + "</h1>");});

	text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,
		function(matchFound,m1){return hashBlock("<h2>" + _RunSpanGamut(m1) + "</h2>");});

	// atx-style headers:
	//  # Header 1
	//  ## Header 2
	//  ## Header 2 with closing hashes ##
	//  ...
	//  ###### Header 6
	//

	/*
		text = text.replace(/
			^(\#{1,6})        // $1 = string of #'s
			[ \t]*
			(.+?)          // $2 = Header text
			[ \t]*
			\#*            // optional closing #'s (not counted)
			\n+
		/gm, function() {...});
	*/

	text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
		function(wholeMatch,m1,m2) {
			var h_level = m1.length;
			return hashBlock("<h" + h_level + ">" + _RunSpanGamut(m2) + "</h" + h_level + ">");
		});

	return text;
}

// This declaration keeps Dojo compressor from outputting garbage:
var _processListItems;

var _doLists = function(text) {
//
// Form HTML ordered (numbered) and unordered (bulleted) lists.
//

	// attacklab: add sentinel to hack around khtml/safari bug:
	// http://bugs.webkit.org/show_bug.cgi?id=11231
	text += "~0";

	// Re-usable pattern to match any entirel ul or ol list:

	/*
		var whole_list = /
		(                  // $1 = whole list
			(                // $2
				[ ]{0,3}          // attacklab: g_tab_width - 1
				([*+-]|\d+[.])        // $3 = first list item marker
				[ \t]+
			)
			[^\r]+?
			(                // $4
				~0              // sentinel for workaround; should be $
			|
				\n{2,}
				(?=\S)
				(?!              // Negative lookahead for another list item marker
					[ \t]*
					(?:[*+-]|\d+[.])[ \t]+
				)
			)
		)/g
	*/
	var whole_list = /^(([ ]{0,3}([\*\+\-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[\*\+\-]|\d+[.])[ \t]+)))/gm;

	if (g_list_level) {
		text = text.replace(whole_list,function(wholeMatch,m1,m2) {
			var list = m1;
			var list_type = (m2.search(/[*+-]/g)>-1) ? "ul" : "ol";

			// Turn double returns into triple returns, so that we can make a
			// paragraph for the last item in a list, if necessary:
			list = list.replace(/\n{2,}/g,"\n\n\n");;
			var result = _processListItems(list);

			// Trim any trailing whitespace, to put the closing `</$list_type>`
			// up on the preceding line, to get it past the current stupid
			// HTML block parser. This is a hack to work around the terrible
			// hack that is the HTML block parser.
			result = result.replace(/\s+$/,"");
			result = "<"+list_type+">" + result + "</"+list_type+">\n";
			return result;
		});
	} else {
		whole_list = /(\n\n|^\n?)(([ ]{0,3}([\*\+\-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[\*\+\-]|\d+[.])[ \t]+)))/g;
		text = text.replace(whole_list,function(wholeMatch,m1,m2,m3) {
			var runup = m1;
			var list = m2;

			var list_type = (m3.search(/[*+-]/g)>-1) ? "ul" : "ol";
			// Turn double returns into triple returns, so that we can make a
			// paragraph for the last item in a list, if necessary:
			var list = list.replace(/\n{2,}/g,"\n\n\n");;
			var result = _processListItems(list);
			result = runup + "<"+list_type+">\n" + result + "</"+list_type+">\n";
			return result;
		});
	}

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}

_processListItems = function(list_str) {
//
//  Process the contents of a single ordered or unordered list, splitting it
//  into individual list items.
//
	// The $g_list_level global keeps track of when we're inside a list.
	// Each time we enter a list, we increment it; when we leave a list,
	// we decrement. If it's zero, we're not in a list anymore.
	//
	// We do this because when we're not inside a list, we want to treat
	// something like this:
	//
	//    I recommend upgrading to version
	//    8. Oops, now this line is treated
	//    as a sub-list.
	//
	// As a single paragraph, despite the fact that the second line starts
	// with a digit-period-space sequence.
	//
	// Whereas when we're inside a list (or sub-list), that line will be
	// treated as the start of a sub-list. What a kludge, huh? This is
	// an aspect of Markdown's syntax that's hard to parse perfectly
	// without resorting to mind-reading. Perhaps the solution is to
	// change the syntax rules such that sub-lists must start with a
	// starting cardinal number; e.g. "1." or "a.".

	g_list_level++;

	// trim trailing blank lines:
	list_str = list_str.replace(/\n{2,}$/,"\n");

	// attacklab: add sentinel to emulate \z
	list_str += "~0";

	/*
	list_str = list_str.replace(/
		(\n)?              // leading line = $1
		(^[ \t]*)            // leading whitespace = $2
		([*+-]|\d+[.]) [ \t]+      // list marker = $3
		([^\r]+?            // list item text   = $4
		(\n{1,2}))
		(?= \n* (~0 | \2 ([*+-]|\d+[.]) [ \t]+))
	/gm, function(){...});
	*/
	list_str = list_str.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
		function(wholeMatch,m1,m2,m3,m4){
			var item = m4;
			var leading_line = m1;
			var leading_space = m2;

			if (leading_line || (item.search(/\n{2,}/)>-1)) {
				item = _runBlockGamut(_Outdent(item));
			}
			else {
				// Recursion for sub-lists:
				item = _doLists(_Outdent(item));
				item = item.replace(/\n$/,""); // chomp(item)
				item = _RunSpanGamut(item);
			}

			return  "<li>" + item + "</li>\n";
		}
	);

	// attacklab: strip sentinel
	list_str = list_str.replace(/~0/g,"");

	g_list_level--;
	return list_str;
}


var _doCodeBlocks = function(text) {
//
//  Process Markdown `<pre><code>` blocks.
//

	/*
		text = text.replace(text,
			/(?:\n\n|^)
			(                // $1 = the code block -- one or more lines, starting with a space/tab
				(?:
					(?:[ ]{4}|\t)      // Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
					.*\n+
				)+
			)
			(\n*[ ]{0,3}[^ \t\n]|(?=~0))  // attacklab: g_tab_width
		/g,function(){...});
	*/

	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,
		function(wholeMatch,m1,m2) {
			var codeblock = m1;
			var nextChar = m2;

			codeblock = _encodeCode( _Outdent(codeblock));
			codeblock = _deTab(codeblock);
			codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

			codeblock = "<pre><code>" + codeblock + "\n</code></pre>";

			return hashBlock(codeblock) + nextChar;
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}

var hashBlock = function(text) {
	text = text.replace(/(^\n+|\n+$)/g,"");
	return "\n\n~K" + (g_html_blocks.push(text)-1) + "K\n\n";
}


var _doCodeSpans = function(text) {
//
//   *  Backtick quotes are used for <code></code> spans.
//
//   *  You can use multiple backticks as the delimiters if you want to
//   include literal backticks in the code span. So, this input:
//
//     Just type ``foo `bar` baz`` at the prompt.
//
//     Will translate to:
//
//     <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
//
//  There's no arbitrary limit to the number of backticks you
//  can use as delimters. If you need three consecutive backticks
//  in your code, use four for delimiters, etc.
//
//  *  You can use spaces to get literal backticks at the edges:
//
//     ... type `` `bar` `` ...
//
//     Turns to:
//
//     ... type <code>`bar`</code> ...
//

	/*
		text = text.replace(/
			(^|[^\\])          // Character before opening ` can't be a backslash
			(`+)            // $2 = Opening run of `
			(              // $3 = The code block
				[^\r]*?
				[^`]          // attacklab: work around lack of lookbehind
			)
			\2              // Matching closer
			(?!`)
		/gm, function(){...});
	*/

	text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
		function(wholeMatch,m1,m2,m3,m4) {
			var c = m3;
			c = c.replace(/^([ \t]*)/g,"");	// leading whitespace
			c = c.replace(/[ \t]*$/g,"");	// trailing whitespace
			c = _encodeCode(c);
			return m1+"<code>"+c+"</code>";
		});

	return text;
}


var _encodeCode = function(text) {
//
// Encode/escape certain characters inside Markdown code runs.
// The point is that in code, these characters are literals,
// and lose their special Markdown meanings.
//
	// Encode all ampersands; HTML entities are not
	// entities within a Markdown code span.
	text = text.replace(/&/g,"&amp;");

	// Do the angle bracket song and dance:
	text = text.replace(/</g,"&lt;");
	text = text.replace(/>/g,"&gt;");

	// Now, escape characters that are magic in Markdown:
	text = escapeCharacters(text,"\*_{}[]\\",false);

// jj the line above breaks this:
//---

//* Item

//   1. Subitem

//            special char: *
//---

	return text;
}


var _doItalicsAndBold = function(text) {

	// <strong> must go first:
	text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[\*_]*)\1/g,
		"<strong>$2</strong>");

	text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,
		"<em>$2</em>");

	return text;
}


var _doBlockQuotes = function(text) {

	/*
		text = text.replace(/
		(                // Wrap whole match in $1
			(
				^[ \t]*>[ \t]?      // '>' at the start of a line
				.+\n          // rest of the first line
				(.+\n)*          // subsequent consecutive lines
				\n*            // blanks
			)+
		)
		/gm, function(){...});
	*/

	text = text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,
		function(wholeMatch,m1) {
			var bq = m1;

			// attacklab: hack around Konqueror 3.5.4 bug:
			// "----------bug".replace(/^-/g,"") == "bug"

			bq = bq.replace(/^[ \t]*>[ \t]?/gm,"~0");	// trim one level of quoting

			// attacklab: clean up hack
			bq = bq.replace(/~0/g,"");

			bq = bq.replace(/^[ \t]+$/gm,"");		// trim whitespace-only lines
			bq = _runBlockGamut(bq);				// recurse

			bq = bq.replace(/(^|\n)/g,"$1  ");
			// These leading spaces screw with <pre> content, so we need to fix that:
			bq = bq.replace(
					/(\s*<pre>[^\r]+?<\/pre>)/gm,
				function(wholeMatch,m1) {
					var pre = m1;
					// attacklab: hack around Konqueror 3.5.4 bug:
					pre = pre.replace(/^  /mg,"~0");
					pre = pre.replace(/~0/g,"");
					return pre;
				});

			return hashBlock("<blockquote>\n" + bq + "\n</blockquote>");
		});
	return text;
}


var _FormParagraphs = function(text) {
//
//  Params:
//    $text - string to process with html <p> tags
//

	// Strip leading and trailing lines:
	text = text.replace(/^\n+/g,"");
	text = text.replace(/\n+$/g,"");

	var grafs = text.split(/\n{2,}/g);
	var grafsOut = new Array();

	//
	// Wrap <p> tags.
	//
	var end = grafs.length;
	for (var i=0; i<end; i++) {
		var str = grafs[i];

		// if this is an HTML marker, copy it
		if (str.search(/~K(\d+)K/g) >= 0) {
			grafsOut.push(str);
		}
		else if (str.search(/\S/) >= 0) {
			str = _RunSpanGamut(str);
			str = str.replace(/^([ \t]*)/g,"<p>");
			str += "</p>"
			grafsOut.push(str);
		}

	}

	//
	// Unhashify HTML blocks
	//
	end = grafsOut.length;
	for (var i=0; i<end; i++) {
		// if this is a marker for an html block...
		while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
			var blockText = g_html_blocks[RegExp.$1];
			blockText = blockText.replace(/\$/g,"$$$$"); // Escape any dollar signs
			grafsOut[i] = grafsOut[i].replace(/~K\d+K/,blockText);
		}
	}

	return grafsOut.join("\n\n");
}


var _encodeAmpsAndAngles = function(text) {
// Smart processing for ampersands and angle brackets that need to be encoded.

	// Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
	//   http://bumppo.net/projects/amputator/
	text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");

	// Encode naked <'s
	text = text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");

	return text;
}


var _encodeBackslashEscapes = function(text) {
//
//   Parameter:  String.
//   Returns:  The string, with after processing the following backslash
//         escape sequences.
//

	// attacklab: The polite way to do this is with the new
	// escapeCharacters() function:
	//
	//   text = escapeCharacters(text,"\\",true);
	//   text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
	//
	// ...but we're sidestepping its use of the (slow) RegExp constructor
	// as an optimization for Firefox.  This function gets called a LOT.

	text = text.replace(/\\(\\)/g,escapeCharacters_callback);
	text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback);
	return text;
}


var _doAutoLinks = function(text) {

	text = text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a href=\"$1\">$1</a>");

	// Email addresses: <address@domain.foo>

	/*
		text = text.replace(/
			<
			(?:mailto:)?
			(
				[-.\w]+
				\@
				[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+
			)
			>
		/gi, _doAutoLinks_callback());
	*/
	text = text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
		function(wholeMatch,m1) {
			return _EncodeEmailAddress( _unescapeSpecialChars(m1) );
		}
	);

	return text;
}


var _EncodeEmailAddress = function(addr) {
//
//  Input: an email address, e.g. "foo@example.com"
//
//  Output: the email address as a mailto link, with each character
//  of the address encoded as either a decimal or hex entity, in
//  the hopes of foiling most address harvesting spam bots. E.g.:
//
//  <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
//     x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
//     &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
//
//  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
//  mailing list: <http://tinyurl.com/yu7ue>
//

	// attacklab: why can't javascript speak hex?
	function char2hex(ch) {
		var hexDigits = '0123456789ABCDEF';
		var dec = ch.charCodeAt(0);
		return(hexDigits.charAt(dec>>4) + hexDigits.charAt(dec&15));
	}

	var encode = [
		function(ch){return "&#"+ch.charCodeAt(0)+";";},
		function(ch){return "&#x"+char2hex(ch)+";";},
		function(ch){return ch;}
	];

	addr = "mailto:" + addr;

	addr = addr.replace(/./g, function(ch) {
		if (ch == "@") {
				// this *must* be encoded. I insist.
			ch = encode[Math.floor(Math.random()*2)](ch);
		} else if (ch !=":") {
			// leave ':' alone (to spot mailto: later)
			var r = Math.random();
			// roughly 10% raw, 45% hex, 45% dec
			ch =  (
					r > .9  ?	encode[2](ch)   :
					r > .45 ?	encode[1](ch)   :
								encode[0](ch)
				);
		}
		return ch;
	});

	addr = "<a href=\"" + addr + "\">" + addr + "</a>";
	addr = addr.replace(/">.+:/g,"\">"); // strip the mailto: from the visible part

	return addr;
}


var _unescapeSpecialChars = function(text) {
//
// Swap back in all the special characters we've hidden.
//
	text = text.replace(/~E(\d+)E/g,
		function(wholeMatch,m1) {
			var charCodeToReplace = parseInt(m1);
			return String.fromCharCode(charCodeToReplace);
		}
	);
	return text;
}


var _Outdent = function(text) {
//
// Remove one level of line-leading tabs or spaces
//

	// attacklab: hack around Konqueror 3.5.4 bug:
	// "----------bug".replace(/^-/g,"") == "bug"

	text = text.replace(/^(\t|[ ]{1,4})/gm,"~0"); // attacklab: g_tab_width

	// attacklab: clean up hack
	text = text.replace(/~0/g,"")

	return text;
}

var _deTab = function(text) {
// attacklab: Detab's completely rewritten for speed.
// In perl we could fix it by anchoring the regexp with \G.
// In javascript we're less fortunate.

	// expand first n-1 tabs
	text = text.replace(/\t(?=\t)/g,"    "); // attacklab: g_tab_width

	// replace the nth with two sentinels
	text = text.replace(/\t/g,"~A~B");

	// use the sentinel to anchor our regex so it doesn't explode
	text = text.replace(/~B(.+?)~A/g,
		function(wholeMatch,m1,m2) {
			var leadingText = m1;
			var numSpaces = 4 - leadingText.length % 4;  // attacklab: g_tab_width

			// there *must* be a better way to do this:
			for (var i=0; i<numSpaces; i++) leadingText+=" ";

			return leadingText;
		}
	);

	// clean up sentinels
	text = text.replace(/~A/g,"    ");  // attacklab: g_tab_width
	text = text.replace(/~B/g,"");

	return text;
}


//
//  attacklab: Utility functions
//


var escapeCharacters = function(text, charsToEscape, afterBackslash) {
	// First we have to escape the escape characters so that
	// we can build a character class out of them
	var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

	if (afterBackslash) {
		regexString = "\\\\" + regexString;
	}

	var regex = new RegExp(regexString,"g");
	text = text.replace(regex,escapeCharacters_callback);

	return text;
}


var escapeCharacters_callback = function(wholeMatch,m1) {
	var charCodeToEscape = m1.charCodeAt(0);
	return "~E"+charCodeToEscape+"E";
}

} // end of .converter
