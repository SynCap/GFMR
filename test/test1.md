####HTML ![][logo]
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
####markdown

```markdown
___Test 1___

	| Header 1 | +Header 2
	| -------- | --------
	| Cell 1   | Cell 2
	| Cell 3   | Cell 4
	_AfterTable 1_

***Test 2***

	Header A | Header B
	-:------:|---------:
	Cell c   | Cell d
	Cell e   | Cell f
	Cell g   | Cell h
	Cell i   | Cell j
	_AfterTable 2_
```

####Actual view ![][logo]

___Test 1___

| Header 1 ![][logo] | +Header 2
| -------- | --------
| Cell 1 ![][logo]   | Cell 2
| Cell 3   | Cell 4 ![][logo]
_AfterTable 1_

***Test 2***

Header `A` | Header B ![][logo]
-:-------:|---------:
Cell c   | Cell d ![][logo]
Cell e   | *Cell* f
Cell g   | **Cell** h
Cell i   | Cell j
_AfterTable 2_

 ![][logo]
[logo]:data:image/png;base64,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
