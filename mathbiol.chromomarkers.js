// Main Menu functions
// This is also a good template for writing imagejs modules.
// The main thing is to keep your code within a function call and not generate global variables.
// use instead imagejs.modules[yourModule] to store parameters and functions.

(function(){
	imagejs.msg('chromomarkers v0.1 loaded.'); // to notify via console and div#msg
	// code module
	// production url 'http://morphomarkers.imagejs.googlecode.com/git/morphomarkers.js';
	// development url 'http://localhost:8888/imagejs/morphomarkers/morphomarkers.js'
	var id='chromomarkers';
	imagejs.modules[id]={
		dist:function(dt,px){ //distance between image data and a pixel
			if(px.length==2){px=dt[px[0]][px[1]]} // in case the pixel coordinates rather than the pixel is being submitted as px
			//console.log(px);
			var Wrgba=[imagejs.modules[id].red/100,imagejs.modules[id].green/100,imagejs.modules[id].blue/100,1]; // color weight
			return jmat.imMap(dt,function(xy){
				// Euclidean distance 
				// notice px pixel value is passed to the function through the closure's scope
				return Math.pow(jmat.sum(xy.slice(0,3).map(function(xyi,i){return Math.pow((xyi-px[i])*Wrgba[i],2)})),1/2);
			})	
		},
		backSeg:function(){ // go back to previous segmentation
			var segOld = imagejs.modules[id].segOld;
			imagejs.modules[id].segOld=imagejs.data.seg;
			imagejs.data.seg=segOld;
			jmat.imagebw(cvTop,jmat.edge(segOld),[0,0,0,0],[255,255,0,255]); // display edge
		},
		segCheckOnChange:function(that){imagejs.modules[id].segNewChecked=that.checked},
		segNewChecked:true,
		start:function(){
			cvTop.style.cursor='crosshair';
			cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop; // make sure they're aligned
			var cvTopOnClick=function(evt){
				//imagejs.msg('Morphomarker acquisition ...');
				//var x = evt.clientX-evt.target.offsetLeft+window.pageXOffset;
				var x = imagejs.modules[id].x;
				//var y = evt.clientY-evt.target.offsetTop+window.pageYOffset;
				var y = imagejs.modules[id].y;
				//console.log(x,y);
				imagejs.msg('('+x+','+y+')');
				//if (jmat.max(imagejs.data.img[y][x].slice(0,3))>150){var C=[0,0,1]};else{var C=[1,1,0]} // use background
				var ctx=cvTop.getContext('2d');
				ctx.clearRect(0,0,this.width,this.height);
				if(!imagejs.modules[id].red){imagejs.modules[id].red=100};
				if(!imagejs.modules[id].green){imagejs.modules[id].green=100};
				if(!imagejs.modules[id].blue){imagejs.modules[id].blue=100};
				if(!imagejs.modules[id].d){imagejs.modules[id].d=imagejs.modules[id].dist(imagejs.data.img,[y,x])}
				//if(!imagejs.modules[id].d){var d = imagejs.modules[id].dist(imagejs.data.img,[y,x]);imagejs.modules[id].d=d;}
				//else {var d = imagejs.modules[id].d}
				if(!imagejs.modules[id].thr){var thr = jmat.max(jmat.max(imagejs.modules[id].d))/5;imagejs.modules[id].thr=thr;}
				else {var thr = imagejs.modules[id].thr}
				var bw = jmat.im2bw(imagejs.modules[id].d,thr); // threshold should be recoded to allow for a function
				var bw = jmat.arrayfun(bw,function(x){return 1-x}); // get the reciprocal
				if(!imagejs.modules[id].segOld){imagejs.modules[id].segOld=bw}
				if(!imagejs.data.seg){imagejs.data.seg=bw}
				//if(!imagejs.modules[id].segNewChecked){imagejs.modules[id].segNewChecked=true} // default value
				if(!imagejs.modules[id].segNewChecked){
					bw=jmat.innerfun(bw,imagejs.data.seg,function(a,b){if(a==1){return a}else{return b}});
					imagejs.modules[id].segNewChecked=false;
				}; // add to previous segmentation
				//else{imagejs.modules[id].segNewChecked=true}; // default value
				imagejs.modules[id].segOld=imagejs.data.seg;imagejs.data.seg=bw;
				//jmat.imagesc(cvTop,bw); // display it
				//jmat.imagebw(cvTop,bw,[0,0,0,0],[255,255,0,255]); // display segmentation
				var edg = jmat.edge(bw);
				jmat.imagebw(cvTop,edg,[0,0,0,0],[255,255,0,255]); // display edge
				//var C=[1,1,0]; // always use yellow
				//jmat.plot(cvTop,x,y,'+',{Color:C,MarkerSize:30});
				//jmat.plot(cvTop,x,y,'o',{Color:C,MarkerSize:30});
				msg.innerHTML='<input id="segNew" type="checkbox" onchange="imagejs.modules[\''+id+'\'].segCheckOnChange(this)">New <button id="backSeg" onclick="imagejs.modules[\''+id+'\'].backSeg()"><</button> Threshold: <span id="slider">___|___|___|___|___|___|___|___|___|___</span> . <span id="sliderRed" style="color:red">__|__|__|__|__</span> . <span id="sliderGreen" style="color:green">__|__|__|__|__</span> . <span id="sliderBlue" style="color:blue">__|__|__|__|__</span>';
				$('#segNew').attr('checked',imagejs.modules[id].segNewChecked);
				$(function(){$('#slider').slider({
					max:jmat.max(jmat.max(imagejs.modules[id].d)),
					min:0,
					value:thr,
					change:function(){imagejs.modules[id].thr=$('#slider').slider('value');jmat.gId('cvTop').onclick(evt,x,y)}
					})});
				$(function(){$('#sliderRed').slider({
					max:100,
					min:0,
					value:imagejs.modules[id].red,
					change:function(){imagejs.modules[id].red=$('#sliderRed').slider('value');delete imagejs.modules[id].d;jmat.gId('cvTop').onclick(evt,x,y)}
				})});
				$(function(){$('#sliderGreen').slider({
					max:100,
					min:0,
					value:imagejs.modules[id].green,
					change:function(){imagejs.modules[id].green=$('#sliderGreen').slider('value');delete imagejs.modules[id].d;jmat.gId('cvTop').onclick(evt,x,y)}
				})});
				$(function(){$('#sliderBlue').slider({
					max:100,
					min:0,
					value:imagejs.modules[id].blue,
					change:function(){imagejs.modules[id].blue=$('#sliderBlue').slider('value');delete imagejs.modules[id].d;jmat.gId('cvTop').onclick(evt,x,y)}
				})});
				cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop; // make sure the two canvas are aligned
			}
			jmat.gId('cvTop').onclick=function(evt,x,y){ // click on top for things hapenning in cvBase
				msg.innerHTML='<span style="color:red">processing, please wait ...</span>';
				if(!x){var x = evt.clientX-evt.target.offsetLeft+window.pageXOffset;imagejs.modules[id].x=x};
				if(!y){var y = evt.clientY-evt.target.offsetTop+window.pageYOffset;imagejs.modules[id].y=y};
				var C=[1,1,0]; // always use yellow
				jmat.plot(cvTop,x,y,'+',{Color:C,MarkerSize:30});
				jmat.plot(cvTop,x,y,'o',{Color:C,MarkerSize:30});
				cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop; // make sure the two canvas are aligned
				//cvTopOnClick(evt);
				setTimeout(cvTopOnClick, 40, evt);
				if(!!imagejs.modules[id].d){delete imagejs.modules[id].d}
				//imagejs.modules[id].d=imagejs.modules[id].dist(imagejs.data.img,[y,x]);				
			}
		},
		end:function(){
			//jmat.gId('cvBase').onclick=null;
			cvTop.style.cursor='default';
			var ctx=cvTop.getContext('2d');
			ctx.clearRect(0,0,this.width,this.height);
			cvTop.onclick=null
			}
	}
	
	// create menu to operate module
	var menu={
		Start:function(){
			imagejs.msg('Morphomarker acquisition active');
			imagejs.modules[id].start();
		},
		End:function(){
			imagejs.msg('Morphomarker acquisition ended');
			imagejs.modules[id].end();
		}
	}
	var name= 'Chromomarkers v0.1';
	jmat.gId('menu').appendChild(imagejs.menu(menu,name)); 
	
	
})()