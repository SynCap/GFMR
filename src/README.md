#![][icon] GFM style markdown rendering Extension for Chrome
©2013, Constantin Loskutov, [www.syncap.ru ![][logo]](http://www.syncap.ru/)

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

**GPL**

[icon]:img/icon.png
[logo]:img/logo.png
