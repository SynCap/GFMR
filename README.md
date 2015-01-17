# ![][icon] GFM style markdown rendering Extension for Chrome
©2013, Constantin Loskutov, [www.syncap.ru ![][logo]](http://www.syncap.ru/)

## Description

Automatically parses [markdown](http://daringfireball.net/projects/markdown/) files (_.md_, _.markdown_, _.text_) into HTML.
Supports some GFM ([Github Flavored Markdown](http://github.github.com/github-flavored-markdown/) ) features.

Based on Showdown, a port of Pyton Markdown renderer and
[highlighter.js](http://softwaremaniacs.org/soft/highlight/) by Ivan Sagalayev.

> #### NOTE
To use Chrome as default viewer of markdown files
check `Allow access to file URLs` in [extension tab](chrome://extensions) for this extension!

> This lets you view local files.

## Distinctions of initial specifications

- Supports paragraphs in list items
- Renders Github style code blocks
- Renders tables
- Auto convert the hyper links in plain text, ie: www.example.com, http://example.com

[More info](src/README.md)

## [License](src/LICENSE.TXT)

[icon]:src/img/icon.png
[logo]:src/img/logo.png