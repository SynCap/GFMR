/**!
 * Copyright (c) 2013, 2015 Constantin Loskutov,
 * https://github.com/SynCap/GFMR
 */
!function(e){function n(e,n,i,t){var l=document.createElement(e);if(i=i||document.head,"undefined"!==n&&null!=n)for(var o in n)l[o]=n[o];return"undefined"!==t&&null!=t&&(l.innerHTML=t),i.appendChild(l),l}function i(e){n("link",{href:l("css/"+e+".css"),rel:"stylesheet"}),console.log("CSS injected: %s",e)}var t=e.document,l=chrome.extension.getURL;n("link",{rel:"shortcut icon",type:"image/x-icon",href:l("img/gfmr.ico")});i("gfmr"),n("script",{type:"text/plain",id:"mdText"},t.head,t.body.innerText),console.info("Initial text saved as script with id = `mdText`");var o=window.markdownit({html:!0,xhtmlOut:!0,breaks:!1,linkify:!0,typographer:!0,quotes:"«»‘’"}).use(window.markdownitDeflist).use(window.markdownitEmoji);t.body.innerHTML='<div id="page">'+o.render(t.body.innerText)+"</div>",console.log("Renderer `markdownit.js` fired."),hljs.initHighlighting(),console.log("HL initialized."),[].forEach.call(document.querySelectorAll("code.hljs"),function(e){hljs.lineNumbersBlock(e)}),console.log("HL line numbers initialized.");var r=document.querySelector("#page h1");r&&n("title",null,null,r.innerText.trim()),[].forEach.call(document.querySelectorAll('a[href^="http:"],a[href^="https:"]'),function(e){e.target="_blank",e.classList.add("external")}),[].forEach.call(document.querySelectorAll("h1,h2,h3,h4,h5,h6"),function(e){e.id=e.innerText.trim().toLowerCase().replace(/\W+/g,"-"),e.classList.add("anchored")})}(window);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsidyIsIm1rRWxlbWVudCIsInRhZyIsInBhcmFtcyIsInBhcmVudCIsImNvbnRlbnQiLCJlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaGVhZCIsInByb3AiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImluamVjdENTUyIsImZOYW1lIiwiaHJlZiIsImNoVXJsIiwicmVsIiwiY29uc29sZSIsImxvZyIsImQiLCJjaHJvbWUiLCJleHRlbnNpb24iLCJnZXRVUkwiLCJ0eXBlIiwiaWQiLCJib2R5IiwiaW5uZXJUZXh0IiwiaW5mbyIsIm1kIiwid2luZG93IiwibWFya2Rvd25pdCIsImh0bWwiLCJ4aHRtbE91dCIsImJyZWFrcyIsImxpbmtpZnkiLCJ0eXBvZ3JhcGhlciIsInF1b3RlcyIsInVzZSIsIm1hcmtkb3duaXREZWZsaXN0IiwibWFya2Rvd25pdEVtb2ppIiwicmVuZGVyIiwiaGxqcyIsImluaXRIaWdobGlnaHRpbmciLCJmb3JFYWNoIiwiY2FsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJibG9jayIsImxpbmVOdW1iZXJzQmxvY2siLCJ0IiwicXVlcnlTZWxlY3RvciIsInRyaW0iLCJhIiwidGFyZ2V0IiwiY2xhc3NMaXN0IiwiYWRkIiwiaCIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6Ijs7OztDQUtDLFNBQVNBLEdBZ0JULFFBQVNDLEdBQVdDLEVBQUtDLEVBQVFDLEVBQVFDLEdBQ3hDLEdBQUlDLEdBQUlDLFNBQVNDLGNBQWNOLEVBRy9CLElBRkFFLEVBQVNBLEdBQVVHLFNBQVNFLEtBRWIsY0FBWE4sR0FBb0MsTUFBVkEsRUFDN0IsSUFBSyxHQUFJTyxLQUFRUCxHQUNoQkcsRUFBRUksR0FBUVAsRUFBT08sRUFTbkIsT0FMZ0IsY0FBWkwsR0FBc0MsTUFBWEEsSUFDOUJDLEVBQUVLLFVBQVlOLEdBR2ZELEVBQU9RLFlBQVlOLEdBQ1pBLEVBU1IsUUFBU08sR0FBV0MsR0FDbkJiLEVBQVUsUUFBUWMsS0FBS0MsRUFBTyxPQUFTRixFQUFRLFFBQVNHLElBQUksZUFDNURDLFFBQVFDLElBQUksbUJBQW9CTCxHQXhDakMsR0FBSU0sR0FBSXBCLEVBQUVPLFNBQ05TLEVBQVFLLE9BQU9DLFVBQVVDLE1BMkNmdEIsR0FBVSxRQUN2QmdCLElBQUssZ0JBQ0xPLEtBQU0sZUFDTlQsS0FBTUMsRUFBTSxpQkFJYkgsR0FBVSxRQUdWWixFQUFVLFVBQVd1QixLQUFLLGFBQWFDLEdBQUcsVUFBV0wsRUFBRVgsS0FBTVcsRUFBRU0sS0FBS0MsV0FDcEVULFFBQVFVLEtBQUssa0RBR2IsSUFBSUMsR0FBS0MsT0FBT0MsWUFDYkMsTUFBYyxFQUNkQyxVQUFjLEVBQ2RDLFFBQWMsRUFDZEMsU0FBYyxFQUNkQyxhQUFjLEVBQ2RDLE9BQVEsU0FFVEMsSUFBSVIsT0FBT1MsbUJBQ1hELElBQUlSLE9BQU9VLGdCQUNicEIsR0FBRU0sS0FBS2YsVUFBWSxrQkFBc0JrQixFQUFHWSxPQUFPckIsRUFBRU0sS0FBS0MsV0FBYSxTQUN2RVQsUUFBUUMsSUFBSSxtQ0FJWnVCLEtBQUtDLG1CQUNMekIsUUFBUUMsSUFBSSxzQkFDVHlCLFFBQVFDLEtBQUt0QyxTQUFTdUMsaUJBQWlCLGFBQWMsU0FBVUMsR0FDakVMLEtBQUtNLGlCQUFpQkQsS0FFdkI3QixRQUFRQyxJQUFJLCtCQUVaLElBQUk4QixHQUFJMUMsU0FBUzJDLGNBQWMsV0FDM0JELElBQ0hoRCxFQUFVLFFBQVMsS0FBTSxLQUFNZ0QsRUFBRXRCLFVBQVV3QixXQUl6Q1AsUUFBUUMsS0FDVnRDLFNBQVN1QyxpQkFBaUIsc0NBQzFCLFNBQVNNLEdBQUdBLEVBQUVDLE9BQVMsU0FBU0QsRUFBRUUsVUFBVUMsSUFBSSxpQkFJOUNYLFFBQVFDLEtBQ1Z0QyxTQUFTdUMsaUJBQWlCLHFCQUMxQixTQUFTVSxHQUFHQSxFQUFFL0IsR0FBRytCLEVBQUU3QixVQUFVd0IsT0FBT00sY0FBY0MsUUFBUSxPQUFPLEtBQUtGLEVBQUVGLFVBQVVDLElBQUksZUFHdEZ6QiIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIVxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMsIDIwMTUgQ29uc3RhbnRpbiBMb3NrdXRvdixcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1N5bkNhcC9HRk1SXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKHcpIHtcclxuXHJcblx0dmFyIGQgPSB3LmRvY3VtZW50O1xyXG5cdHZhciBjaFVybCA9IGNocm9tZS5leHRlbnNpb24uZ2V0VVJMO1xyXG5cdC8vIHZhciBjaFVybCA9IGZ1bmN0aW9uIChwYXRoKSB7cmV0dXJuIHBhdGh9IC8vIGZvciBub24gQ2hyb21lIGVudmlyb25tZW50IGRlYnVnaW5nIHB1cnBvc2VzIG9ubHkhXHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBIVE1MIGVsZW1lbnRzIHNob3J0Y3V0LiBEZWZhdWx0IHBhcmVudCBvZiBuZXdseSBjcmVhdGVkIGVsZW1lbnRzXHJcblx0ICogaXMgYSBgZG9jdW1lbnQuaGVhZGAuXHJcblx0ICogQHBhcmFtICB7c3RyaW5nfSB0YWcgICAgVGFnIG5hbWUsIGFzIHVzZWQgaW4gYGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRgXHJcblx0ICogQHBhcmFtICB7b2JqZWN0fSBwYXJhbXMgQXR0cmlidXRlcyB0byBiZSBzZXQgdG8gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGFyZW50IFBhcmVudCBlbGVtZW50IGZvciBuZXcgZWxlbWVudC4gPEhFQUQ+IGlzIGRlZmF1bHRcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvbWl0dGVkXHJcblx0ICogQHBhcmFtICB7b2JqZWN0fSBjb250ZW50IElubmVyIEhUTUwgY29udGVudCBvZiB0aGUgZWxlbWVudFxyXG5cdCAqIEByZXR1cm4ge25vZGV9ICAgICAgICAgIE5ld2x5IGNyZWF0ZWQgZWxlbWVudFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIG1rRWxlbWVudCAodGFnLCBwYXJhbXMsIHBhcmVudCwgY29udGVudCkge1xyXG5cdFx0dmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcblx0XHRwYXJlbnQgPSBwYXJlbnQgfHwgZG9jdW1lbnQuaGVhZDtcclxuXHRcdFxyXG5cdFx0aWYgKHBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zICE9IG51bGwpIHtcclxuXHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBwYXJhbXMpIHtcclxuXHRcdFx0XHRlW3Byb3BdID0gcGFyYW1zW3Byb3BdO1xyXG5cdFx0XHR9XHRcdFx0XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbnRlbnQgIT09ICd1bmRlZmluZWQnICYmIGNvbnRlbnQgIT0gbnVsbCkge1xyXG5cdFx0XHRlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0cGFyZW50LmFwcGVuZENoaWxkKGUpO1xyXG5cdFx0cmV0dXJuIGU7XHJcblx0fVxyXG5cclxuXHRcclxuXHQvKipcclxuXHQgKiBsaW5rIHRoZSBDU1MgZmlsZSBhcyBgbGlua2AgdGFnXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gICAgICB7c3RyaW5nfSAgZk5hbWUgICBwYXRoIHRvIGNzc1xyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGluamVjdENTUyAoZk5hbWUpIHtcclxuXHRcdG1rRWxlbWVudCgnbGluaycse2hyZWY6Y2hVcmwoICdjc3MvJyArIGZOYW1lICsgJy5jc3MnICkscmVsOlwic3R5bGVzaGVldFwifSlcclxuXHRcdGNvbnNvbGUubG9nKFwiQ1NTIGluamVjdGVkOiAlc1wiLCBmTmFtZSk7XHJcblx0fVxyXG5cclxuXHQvLyBUYWIgaWNvblxyXG5cdHZhciBsbmtJY29uID0gbWtFbGVtZW50KCdsaW5rJyx7XHJcblx0XHRyZWw6IFwic2hvcnRjdXQgaWNvblwiLFxyXG5cdFx0dHlwZTogXCJpbWFnZS94LWljb25cIixcclxuXHRcdGhyZWY6IGNoVXJsKCdpbWcvZ2Ztci5pY28nKVxyXG5cdH0pO1xyXG5cclxuXHQvLyBJbmplY3QgYSByZWZlcmVuY2VzIHRvIHRoZSBzdHlsZXNoZWV0cy5cclxuXHRpbmplY3RDU1MoXCJnZm1yXCIpO1xyXG5cclxuXHQvLyBzYXZlIGluaXRhbCB0ZXh0XHJcblx0bWtFbGVtZW50KCdzY3JpcHQnLCB7dHlwZTondGV4dC9wbGFpbicsaWQ6J21kVGV4dCd9LCBkLmhlYWQsIGQuYm9keS5pbm5lclRleHQpO1xyXG5cdGNvbnNvbGUuaW5mbygnSW5pdGlhbCB0ZXh0IHNhdmVkIGFzIHNjcmlwdCB3aXRoIGlkID0gYG1kVGV4dGAnKTtcclxuXHJcblx0Ly8gYWRkU2NyaXB0KFwibWFya2Rvd25cIik7XHJcblx0dmFyIG1kID0gd2luZG93Lm1hcmtkb3duaXQoe1xyXG5cdFx0ICBodG1sOiAgICAgICAgIHRydWUsICAgICAgIFxyXG5cdFx0ICB4aHRtbE91dDogICAgIHRydWUsICAgICAgIFxyXG5cdFx0ICBicmVha3M6ICAgICAgIGZhbHNlLCAgICAgIFxyXG5cdFx0ICBsaW5raWZ5OiAgICAgIHRydWUsICAgICAgIFxyXG5cdFx0ICB0eXBvZ3JhcGhlcjogIHRydWUsXHJcblx0XHQgIHF1b3RlczogJ8KrwrvigJjigJknXHJcblx0fSlcclxuXHRcdC51c2Uod2luZG93Lm1hcmtkb3duaXREZWZsaXN0KVxyXG5cdFx0LnVzZSh3aW5kb3cubWFya2Rvd25pdEVtb2ppKTtcclxuXHRkLmJvZHkuaW5uZXJIVE1MID0gXCI8ZGl2IGlkPVxcXCJwYWdlXFxcIj5cIiArIG1kLnJlbmRlcihkLmJvZHkuaW5uZXJUZXh0KSArIFwiPC9kaXY+XCI7XHJcblx0Y29uc29sZS5sb2coXCJSZW5kZXJlciBgbWFya2Rvd25pdC5qc2AgZmlyZWQuXCIpO1xyXG5cclxuXHQvLyBSdW4gc3ludGF4IGhmaWdobGlnaHRlciBmb3IgY29kZS4gXHJcblx0Ly8gV2V0aGVyIHdlIHRvb2sgdGhpcyBub3QgZm9yIGAqLm1kYCBmaWxlcyBmcm9tIGBHaXRodWJgP1xyXG5cdGhsanMuaW5pdEhpZ2hsaWdodGluZygpO1xyXG5cdGNvbnNvbGUubG9nKFwiSEwgaW5pdGlhbGl6ZWQuXCIpO1xyXG5cdFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdjb2RlLmhsanMnKSwgZnVuY3Rpb24gKGJsb2NrKSB7XHJcblx0XHRobGpzLmxpbmVOdW1iZXJzQmxvY2soYmxvY2spO1xyXG5cdH0pO1xyXG5cdGNvbnNvbGUubG9nKFwiSEwgbGluZSBudW1iZXJzIGluaXRpYWxpemVkLlwiKTtcclxuXHQvLyBcclxuXHR2YXIgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlIGgxJyk7XHJcblx0aWYgKHQpIHtcclxuXHRcdG1rRWxlbWVudCgndGl0bGUnLCBudWxsLCBudWxsLCB0LmlubmVyVGV4dC50cmltKCkgKTtcclxuXHR9XHJcblxyXG5cdC8vIHRhcmdldCBmb3IgZXh0ZXJuYWwgbGlua3NcclxuXHRbXS5mb3JFYWNoLmNhbGwoXHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZePVwiaHR0cDpcIl0sYVtocmVmXj1cImh0dHBzOlwiXScpLCBcclxuXHRcdGZ1bmN0aW9uKGEpe2EudGFyZ2V0ID0gJ19ibGFuayc7YS5jbGFzc0xpc3QuYWRkKCdleHRlcm5hbCcpfVxyXG5cdCk7XHJcblx0Ly8gaWQgdmFsdWVzIGZvciBoZWFkaW5ncywgdG8gYmUgYW5jaG9ycyBmb3IgaW50ZXJuYWwgbGlua3MsIFxyXG5cdC8vIGZvciBleGFtcGxlOiBbZ28gdG9dKCNlbGVtZW50X3NfY29udGVudCkgXHJcblx0W10uZm9yRWFjaC5jYWxsKFxyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaDEsaDIsaDMsaDQsaDUsaDYnKSxcclxuXHRcdGZ1bmN0aW9uKGgpe2guaWQ9aC5pbm5lclRleHQudHJpbSgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxXKy9nLCctJyk7aC5jbGFzc0xpc3QuYWRkKCdhbmNob3JlZCcpfVxyXG5cdCk7XHJcblx0XHJcbn0od2luZG93KSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
