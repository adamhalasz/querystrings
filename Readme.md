![Query String Logo](http://i.imgur.com/lmTGlXl.png)

### An advanced Query String parser that converts values into their correct Data Types and supports Nested Query Parameters. 

## **Features**
 - Supports nested multi dimensional arrays and objects 
 - Converts values into their correct data types. 
 - Supports all data types: `strings`, `integers`, `booleans`, `arrays` & `objects`.
 
## **Install**
```bash
npm install querystrings
```

## **API**
There are only two functions that you need to use `qs.parse` and `qs.stringify`.

### **qs.parse(** *value* **)**
Convert a Query String into a JSON Object.
```js
// require the module
var qs = require('querystrings')

// parse a query string into a query object
var result = qs.parse('string=value&yes=true&no=false&array[0]=1&array[1]=2&object[a]=hello&object[b]=world&object[c][a]=3&object[c][a]=4')

// the result is:
{
	string: 'value',
	yes: true,
	no: false,
	array: [1,2],
	object: {
		a: 'hello',
		b: 'world',
		c: {
			a: [3,4]
		}
	}
}

```

### **qs.stringify(** *value* **)**
Convert a JSON Object into a Query String.
```js
// require the module
var qs = require('querystrings')

// stringify a query object into a query string
var result = qs.stringify({
	string: 'value',
	yes: true,
	no: false,
	array: [1,2],
	object: {
		a: 'hello',
		b: 'world',
		c: {
			a: [3,4]
		}
	}
})

// the result is:
string=value&yes=true&no=false&array[0]=1&array[1]=2&object[a]=hello&object[b]=world&object[c][a]=3&object[c][a]=4

```

# **License**
(The MIT License)

Copyright (c) 2014 Halász Ádám <mail@adamhalasz.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
