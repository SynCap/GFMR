# ![][icon] **GF** **_Markdown_** **R**endering ![][chrome] extension

Copyright ©2013,2015,2016 Constantin Loskutov, [www.syncap.ru ![][logo]](http://www.syncap.ru/)

@version: 2.1.3

## Description

Automatically parse [markdown](http://daringfireball.net/projects/markdown/) files (_.md_, _.markdown_, _.text_) into HTML.
Supports some GFM ([Github Flavored Markdown](http://github.github.com/github-flavored-markdown/) ) features.

Based on [markdown-it](https://markdown-it.github.io/) and
[highlighter.js](http://softwaremaniacs.org/soft/highlight/).

> By default, extension permissions lets you view `.md` and `.markdown` files with any URL, including `file://` (ie - local files), but not GitHub!

The look of full README [rendered with this extension][screenshot-8].

## Advantages

- Autosubstitute on some combinations, i.e. ( c ) => &copy; etc
- Really render the [tables](https://help.github.com/articles/organizing-information-with-tables/)

## Weaks

- Because of nature of rendering (Javascript regexps) not recommended to view large `.md` files and/or files with complex rules
- Some differenses in manner of rendering some blocks, such as tables

### [Sample](src/README.MD)

## Distinctions of initial specifications


- Supports paragraphs in list items
- Renders Github style code blocks
- Renders tables
- Auto convert the hyper links in plain text, ie: www.example.com, http://example.com
- Converts `[ ]`, `[-]`, `[x]`, `[v]` and `[?]` in list items to checkmark list (see TODO section below), where `x`,`X`, `v`, `V` and `?` treated as checked marks, else as unchecked

[More info](src/README.md)

## Legend

| ver     | What's up?                                                                                                            |
| :-----: | --------------------------------------------------------------------------------------------------------------------- |
| 1.xx    | Past realease was based on ShowDown.js                                                                                |
| 1.4.x.. | Based on SD2.js                                                                                                       |
| 1.7.x.. | Code starts using syntax highlighter highlight.JS                                                                     |
| 2.0     | Render Engine changed to Markdown - it.js, new makeup, `fresh look`, unique color scheme for code syntax highlighting |
| 2.1     | Current release; [+] line numbers in multiline code, [+] striped background for muliline code                         |

## TODO for v2

- [x] Code line numbers
- [x] Striped background for code (Zebra style)
- [-] Hot swap for makeup
- [-] Hot swap for code highlighting color schemes
- [-] Turn On/Off TOC (on fly)
- [-] Automatic rearrange big images
- [?] Simple tab tables: find blocks of text arranged by columns and convert them to simple tables, as it was with SD2
- [-] RST style tables, with compact multiline cells
- [-] Render sciantific formulas (mathematics, chemistry, etc)

## [License](src/LICENSE.TXT)

[MIT](src/LICENSE.TXT)


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