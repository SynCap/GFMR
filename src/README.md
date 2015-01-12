#![][icon] GFM style markdown rendering Extension for Chrome
(c)2013, Constantin Loskutov, [www.syncap.ru ![][logo]](http://www.syncap.ru/)

##Description

Automatically parses [markdown](http://daringfireball.net/projects/markdown/) files (_.md_, _.markdown_, _.text_) into HTML.
Supports some GFM ([Github Flavored Markdown](http://github.github.com/github-flavored-markdown/) ) features.

Based on Showdown, a port of Pyton Markdown renderer and
[highlighter.js](http://softwaremaniacs.org/soft/highlight/) by Ivan Sagalayev.

> **NOTE**
To use Chrome as default viewer of markdown files
check `Allow access to file URLs` in [extension tab](chrome://extensions) for this extension!

> This lets you view local files.

## Distinctions of initial specifications

- Supports paragraphs in list items
- Renders Github style code blocks
- Renders tables

###Lists

**SD2** engine lets use multistring list items in following manner:

#### markdown
```markdown
- ul
  - li ***p1***

		li p2

  - li `code`  ![][logo]
```

#### HTML
```html
<ul>
<li><p>ul</p>

<ul><li><p>li <strong><em>p1</em></strong></p>

<p>li p2</p></li>
<li><p>li <code>code</code> <img src="data:image/png;base64, … … … ==" alt="" title=""></p></li></ul></li>
</ul>
```

####Actual view
- ul
  - li ***p1***

		li p2

  - li `code` ![][logo]



###Named codeblocks
####markdown
```markdown
  ```javascript
    (function (d) {
    	console.log('Hello, world!');
    }(document));
  ```

  ~~~~~~~~~~~~~~~ PHP
    $a = 'Hello, world!';
    echo $a."\n";
  ~~~~~~~~~~~~~~~
```

####HTML
```HTML
  <pre><code class="javascript">     (function (d) {
    	console.log('Hello, world!');
    }(document));</code></pre>

  <pre><code class="PHP">  $a = 'Hello, world!';
  echo $a."\n";</code></pre>
```

####Actual view
```javascript
  (function (d) {
  	console.log('Hello, world!');
  }(document));
```

~~~~~~~~~~~~~~~ PHP
  $a = 'Hello, world!';
  echo $a."\n";
~~~~~~~~~~~~~~~

###Tables

Simple table can be rendered using pipe sign "|" and special meaning dividing line, that separate
the column heads. Dividing line can consist of minus `-` sign, pipe `|` and colon `:`.

> **Note**, that just first line recognized as headers, the second one must contatain dividing line.


You can cpecify cell align by using the colons. To set left aligned cells in column set `:`
at begining of cell in dividing line. To set right aligned column - set `:` just before pipe `|` or
last symbol in dividing line. To center cells in column use `:` on both sides of corresponding
divider.

####markdown
```markdown
___Test 1___
&#124; Header 1 &#124; Header 2 ![][logo]
&#124; -------- &#124; --------
&#124; Cell 1   &#124; *Cell 2*
&#124; `Cell 3` &#124; Cell 4
_AfterTable 1_

***Test 2***
Header `A` &#124; Header *B*
:---------:&#124;-------------------:
Cell c     &#124; Cell d
*Cell e*     &#124; **Cell f**
**Cell g**     &#124; Cell h ![][logo]
___Cell i___     &#124; Cell j
_AfterTable 2_
```

####HTML
```HTML
```

#### Actual view
___Test 1___
| Header 1 | Header 2 ![][logo]
| -------- | --------
| Cell 1   | *Cell 2*
| `Cell 3` | Cell 4
_AfterTable 1_

***Test 2***
Header `A`| Header *B*
:-------:|--------:
Cell c   | Cell d
*Cell e*   | **Cell f**
**Cell g**   | Cell h ![][logo]
___Cell i___   | Cell j
_AfterTable 2_

##License

![][logo]


[logo]:data:image/png;base64,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

[icon]:data:image/png;base64,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