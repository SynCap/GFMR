# ![][icon] **GF** **_Markdown_** **R**endering ![][chrome] extension

©2013,2015,2016 Constantin Loskutov, [www.syncap.ru ![][logo]](http://www.syncap.ru/)

## Description

Automatically parse [markdown](http://daringfireball.net/projects/markdown/) files (_.md_, _.markdown_, _.text_) into HTML.
Supports some GFM ([Github Flavored Markdown](http://github.github.com/github-flavored-markdown/) ) features.

Based on [markdown-it](https://markdown-it.github.io/) and
[highlighter.js](http://softwaremaniacs.org/soft/highlight/) by Ivan Sagalayev.

> **NOTE**
To use Chrome as default viewer of markdown files
check `Allow access to file URLs` in [extension tab](chrome://extensions) for this extension!

> This lets you view local files.

## Advantages

- Autosubstitute on some combinations, i.e. ( c ) => &copy; etc
- Really render the [tables](https://help.github.com/articles/organizing-information-with-tables/)

## Weaks

- Becouse of nature of rendering (Javascript regexps) not recommended to view large `.md` files and/or files with complex rules
- Some differenses in manner of rendering some blocks, such as tables


## Distinctions of initial specifications


- Supports paragraphs in list items
- Renders Github style code blocks
- Renders tables
- Auto convert the hyper links in plain text, ie: www.example.com, http://example.com

### Lists

Engine lets use multistring list items in following manner:

#### markdown

```markdown
- ul
  - li ***p1***

    li p2

  - li `code` ![][logo]

    li p4 ![][chrome]
```

#### HTML

```html
<ul>
  <li>ul
    <ul>
      <li>
        <p>li <strong><em>p1</em></strong></p>
        <p>li p2</p>
      </li>
      <li>
        <p>li <code>code</code> <img src="img/logo.png" alt=""></p>
        <p>li p4 <img src="img/chrome-logo.png" alt=""></p>
      </li>
    </ul>
  </li>
</ul>
```

#### Actual view

- ul
  - li ***p1***

    li p2

  - li `code` ![][logo]

    li p4 ![][chrome]



### Named codeblocks
#### markdown

~~~markdown
  ```javascript
    (function (d) {
    	console.log('Hello, world!');
    }(document));
  ```
~~~

```markdown
  ~~~~~~~~~~~~~~~PHP
    $a = 'Hello, world!';
    echo $a."\n";
  ~~~~~~~~~~~~~~~
```

#### HTML

```HTML
  <pre><code class="javascript">     (function (d) {
    	console.log('Hello, world!');
    }(document));</code></pre>

  <pre><code class="PHP">  $a = 'Hello, world!';
  echo $a."\n";</code></pre>
```

#### Actual view

```javascript
  (function (d) {
  	console.log('Hello, world!');
  }(document));
```

~~~~~~~~~~~~~~~PHP
  $a = 'Hello, world!';
  echo $a."\n";
~~~~~~~~~~~~~~~

### Tables

Simple table can be rendered using pipe sign "|" and special meaning dividing line, that separate
the column heads. Dividing line can consist of minus `-` sign, pipe `|` and colon `:`.

> **Note**, that just first line recognized as headers, the second one must contain dividing line.


You can cpecify cell align by using the colons. To set left aligned cells in column set `:`
at begining of cell in dividing line. To set right aligned column - set `:` just before pipe `|` or
last symbol in dividing line. To center cells in column use `:` on both sides of corresponding
divider.

#### markdown

```markdown
___Test 1___

| Header 1 | Header 2 ![][logo]
|----------|----------------------
| Cell 1   | *Cell 2*
| `Cell 3` | Cell 4

_Text After Table 1_

***Test 2***

Header `A`   | Header *B*
:-----------:| -------------------:
Cell c       | Cell d
*Cell e*     | **Cell f**
**Cell g**   | Cell h ![][logo]
___Cell i___ | Cell j

_Text After Table 2_

```

#### Actual view

___Test 1___

| Header 1 | Header 2 ![][logo]
|----------|----------------------
| Cell 1   | *Cell 2*
| `Cell 3` | Cell 4

_Text After Table 1_

***Test 2***

Header `A`   | Header *B*
:-----------:| -------------------:
Cell c       | Cell d
*Cell e*     | **Cell f**
**Cell g**   | Cell h ![][logo]
___Cell i___ | Cell j

_Text After Table 2_


## [License](LICENSE.TXT)


## Original Attributions

**Markdown-It** Copyright (c)2014 by:

- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)

Original Markdown Copyright (c) 2004-2005 John Gruber http://daringfireball.net/projects/markdown/

Redistributable under a BSD-style open source license. See [license.txt](LICENSE.TXT) for more information.

[icon]:img/icon.png
[logo]:img/logo.png
[chrome]:img/chrome-logo.png
