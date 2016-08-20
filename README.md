# ![][icon] **GF** **_Markdown_** **R**endering ![][chrome] extension

©2013,2015,2016 Constantin Loskutov, [www.syncap.ru ![][logo]](http://www.syncap.ru/)

## Description

Automatically parse [markdown](http://daringfireball.net/projects/markdown/) files (_.md_, _.markdown_, _.text_) into HTML.
Supports some GFM ([Github Flavored Markdown](http://github.github.com/github-flavored-markdown/) ) features.

Based on [markdown-it](https://markdown-it.github.io/) and
[highlighter.js](http://softwaremaniacs.org/soft/highlight/) by Ivan Sagalayev.

> By default, extension permissions lets you view `.md` and `.markdown` files with any URL, including `file://` (ie - local files), but not GitHub!

The look of full README [rendered with this extension][screenshot-8].

## Advantages

- Autosubstitute on some combinations, i.e. ( c ) => &copy; etc
- Really render the [tables](https://help.github.com/articles/organizing-information-with-tables/)

## Weaks

- Because of nature of rendering (Javascript regexps) not recommended to view large `.md` files and/or files with complex rules
- Some differenses in manner of rendering some blocks, such as tables


## Distinctions of initial specifications


- Supports paragraphs in list items
- Renders Github style code blocks
- Renders tables
- Auto convert the hyper links in plain text, ie: www.example.com, http://example.com

[More info](src/README.md)


## [License](src/LICENSE.TXT)


## Original Attributions

**Markdown-It** Copyright (c)2014 by:

- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)

Original Markdown Copyright (c) 2004-2005 John Gruber http://daringfireball.net/projects/markdown/

Redistributable under a BSD-style open source license. See [license.txt](LICENSE.TXT) for more information.

[icon]:src/img/icon.png
[logo]:src/img/logo.png
[chrome]:src/img/chrome-logo.png
[screenshot-8]:src/img/screenshot-8.png