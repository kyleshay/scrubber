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
var scroll = {
	_offsetY: 0,
	_startY: 0,
	_scrollY: 0,
	area:null,
	content:null,
	bar:null,
	scrub:null,
	contentH:0,
	barH:0,
	scrubH:0,	
	initPosition:0,
	moveVal:0,	
	initialize: function(o) {	
		scroll.scrub=document.getElementById(o.scrub);
		scroll.bar=document.getElementById(o.bar);
		scroll.content=document.getElementById(o.content);
		scroll.area=document.getElementById(o.area);					
		
		scroll.resize(o);
		hooker.on('resize', window, scroll.resize(o));
		hooker.on('mousedown', scroll.scrub, scroll.activate);
		hooker.on('mousewheel', scroll.area, scroll.slide);
	},
	resize: function(o) {	
		scroll.area.style.height = (o.height || 500) +"px";
		scroll.area.style.width = (o.width || 400)+"px";
		scroll.bar.style.height = (o.height || 500)+"px";
		
		scroll.barH = scroll.bar.offsetHeight;
		scroll.contentH = scroll.content.offsetHeight;
		
		scroll.setScrub();
		scroll.setContent();
	},
	activate: function(e) {
		hooker.on('mousemove', document, scroll.slide);
		hooker.on('mouseup', document, scroll.deactivate);
		
		scroll.scrub.style.backgroundColor	='#797979';
		scroll.scrub.style.borderLeft		='1px solid #6C6C6C';
		scroll.scrub.style.borderTop		='1px solid #5E5E5E';
		scroll.scrub.style.borderBottom		='1px solid #ADADAD';
		scroll.scrub.style.borderRight		='1px solid #ADADAD';
		
		scroll._offsetY = scroll.getTop(scroll.scrub);
		scroll._startY = (e.pageY===undefined?e.clientY +  (document.compatMode=="CSS1Compat"?document.documentElement: document.body).scrollTop:e.pageY) + scroll.initPosition;
		document.body.onselectstart = document.body.onmousedown = function() { return false; };
	},
	slide: function(e) {
		if(scroll.bar.style.visibility == 'hidden') return;		
		
		var position = scroll._offsetY+(e.pageY===undefined?e.clientY +  (document.compatMode=="CSS1Compat"?document.documentElement: document.body).scrollTop:e.pageY)-scroll._startY;
		if(e.type == 'mousewheel' || e.type == 'DOMMouseScroll') {
			var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
		
			scroll._scrollY = scroll._scrollY <= 0?0:scroll._scrollY;
			scroll._scrollY = scroll._scrollY >= scroll.barH-scroll.scrubH?scroll.barH-scroll.scrubH:scroll._scrollY;			
			
			position = scroll._scrollY -= wheelData*5;
			scroll.cancelEvent(e);
		}
		position = position <= 0?0:position;
		position = position >= scroll.barH-scroll.scrubH?scroll.barH-scroll.scrubH:position;
		
		scroll.scrub.style.top = (position) + 'px';
		scroll.content.style.marginTop = ((scroll.initPosition-scroll.getTop(scroll.scrub))*scroll.moveVal) + 'px';
	},
	deactivate: function(e) {
		hooker.off('mousemove', document, scroll.slide);

		scroll._scrollY = scroll.scrub.style.top.replace('px','');
		scroll.scrub.style.backgroundColor	='#CBCBCB';
		scroll.scrub.style.borderLeft		='1px solid #B7B7B7';
		scroll.scrub.style.borderTop		='1px solid #B7B7B7';
		scroll.scrub.style.borderBottom		='1px solid #CBCBCB';
		scroll.scrub.style.borderRight		='1px solid #BDBDBD';
		
		document.body.onselectstart = document.body.onmousedown = function() { return true; };
	},
	setScrub: function() {		
		if(scroll.contentH > scroll.barH) {
			var t=scroll.barH/(scroll.contentH/scroll.barH);			
			scroll.scrub.style.height=(t<20?20:t)+'px';
			scroll.scrubH = scroll.scrub.offsetHeight;
			scroll.scrub.style.top='0px';
			scroll.bar.style.visibility = '';
			scroll.scrub.style.visibility = '';
		} else {
			scroll.bar.style.visibility = 'hidden';
			scroll.scrub.style.visibility = 'hidden';
		}
		scroll.computeDimensions();
	},
	setContent: function() {		
		scroll.content.style.marginTop='0px';
	},
	/*Helper functions*/
	computeDimensions: function() {		
		scroll.initPosition = scroll.getTop(scroll.area);
		scroll.moveVal = (scroll.contentH-scroll.barH)/
							(scroll.barH-scroll.scrubH);		
	},
	getTop: function(el) {
		for (var y=0;
			el != null;
			y += el.offsetTop, el = el.offsetParent);
		return y;
	},
	cancelEvent: function(e) {
		e = e ? e : window.event;
		if(e.stopPropagation)
			e.stopPropagation();
		if(e.preventDefault)
			e.preventDefault();
		e.cancelBubble = true;
		e.cancel = true;
		e.returnValue = false;
		return false;
	}
};