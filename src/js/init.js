/**!
 * Copyright (c) 2013, 2015 Constantin Loskutov,
 * https://github.com/SynCap/GFMR
 * 
 * TODO: 
 * [ ] the code has grown, refactoring is needed
 */
!function(e){"use strict";function n(e,n,i,t){var o=document.createElement(e);if(i=i||document.head,"undefined"!==n&&null!=n)for(var r in n)o[r]=n[r];return"undefined"!==t&&null!=t&&(o.innerHTML=t),i.appendChild(o),o}function i(e){n("link",{href:r("css/"+e+".css"),rel:"stylesheet"}),console.log("CSS injected: %s",e)}function t(e,n){[].forEach.call(document.querySelectorAll(e),n)}var o=e.document,r=chrome.extension.getURL;n("link",{rel:"shortcut icon",type:"image/x-icon",href:r("img/gfmr.ico")}),i("gfmr"),n("script",{type:"text/plain",id:"mdText"},o.head,o.body.innerText),console.info("Initial text saved as script with id = `mdText`");var l=window.markdownit({html:!0,xhtmlOut:!0,breaks:!1,linkify:!0,typographer:!0,quotes:"«»‘’"}).use(window.markdownitDeflist).use(window.markdownitEmoji);o.body.innerHTML='<div id="page">'+l.render(o.body.innerText)+"</div>",console.log("Renderer `markdownit.js` fired."),hljs.initHighlighting(),console.log("HL initialized."),[].forEach.call(document.querySelectorAll("code.hljs"),function(e){hljs.lineNumbersBlock(e)}),console.log("HL line numbers initialized.");var d=document.querySelector("#page h1");d&&n("title",null,null,d.innerText.trim()),t('a[href^="http:"],a[href^="https:"]',function(e){e.target="_blank",e.classList.add("external")}),t("h1,h2,h3,h4,h5,h6",function(e){e.id=e.innerText.trim().toLowerCase().replace(/\W+/g,"-"),e.classList.add("anchored")}),t("li",function(e){e.innerHTML=e.innerHTML.replace(/^\[([ \-?vx])\]/i,function(n,i){return e.classList.add("chkm-"+("xXvV".indexOf(i)+1?"yes":"no")),""})})}(window);
//# sourceMappingURL=init.js.map
