/*
Copyright (C) 2012 kyle.shay

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var hook = {
	on: function(evnt, elem, func) {
		if(typeof elem == 'string')
			elem = document.getElementById(elem);
		if(elem == null)
			return;
		if (elem.addEventListener) {
			if(evnt == 'mousewheel')
				elem.addEventListener('DOMMouseScroll',func,false);
			elem.addEventListener(evnt,func,false);
		} else if (elem.attachEvent) {
			return elem.attachEvent('on'+evnt, func);
		}
		else window.alert('something failed when you did that. good job!');
	},
	off: function(evnt, elem, func) {
		if(typeof elem == 'string')
			elem = document.getElementById(elem);
		if(elem == null)
			return;
		if (elem.removeEventListener) {
			if(evnt == 'mousewheel')
				elem.removeEventListener('DOMMouseScroll',func,false);
			elem.removeEventListener(evnt,func,false);
		} else if (elem.detachEvent) {
			return elem.detachEvent('on'+evnt, func);
		}
		else window.alert('something failed when you did that. good job!');
	},
	fire: function(evnt, elem) {
		if(typeof elem == 'string')
			elem = document.getElementById(elem);
		if(elem == null)
			return;
		var evt = document.createEvent('MouseEvents');
		evt.initEvent(evnt, true, true);
		if (document.createEvent) {
			elem.dispatchEvent(evt);
		} else {
			elem.fireEvent(evt.eventType, evt);
		}
	}
}
