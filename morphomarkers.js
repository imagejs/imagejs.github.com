// Main Menu functions
// This is also a good template for writing imagejs modules.
// The main thing is to keep your code within a function call and not generate global variables.
// use instead imagejs.modules[yourModule] to store parameters and functions.

(function(){
	imagejs.msg('morphomarkers v0.1 loaded.'); // to notify via console and div#msg
	// code module
	// production url 'http://morphomarkers.imagejs.googlecode.com/git/morphomarkers.js';
	// development url 'http://localhost:8888/imagejs/morphomarkers/morphomarkers.js'
	var url='morphomarkers.js';
	imagejs.modules[url]={
		dist:function(dt,px){ //distance between image data and a pixel
			if(px.length==2){px=dt[px[0]][px[1]]} // in case the pixel coordinates rather than the pixel is being submitted as px
			//console.log(px);
			return jmat.imMap(dt,function(xy){
				// Euclidean distance 
				// notice how elegantly the px pixel value is passed to the function through a closure :-)
				return Math.pow(jmat.sum(xy.slice(0,3).map(function(xyi,i){return Math.pow((xyi-px[i]),2)})),1/2);
			})
			
		},
		start:function(){
			jmat.gId('cvTop').onclick=function(evt){ // click on top for things hapenning in cvBase
				//imagejs.msg('Morphomarker acquisition ...');
				var x = evt.clientX-evt.target.offsetLeft;
				var y = evt.clientY-evt.target.offsetTop;
				//console.log(x,y);
				imagejs.msg('('+x+','+y+')');
				var dt = jmat.cloneArray(imagejs.data.dt0);
				//var yx=dt[y][x];
				if (jmat.max(dt[y][x].slice(0,3))>150){dt[y][x]=[0,0,0,dt[y][x][3]]}
				else{dt[y][x]=[255,255,255,dt[y][x][3]]}
				jmat.imwrite(this,dt);
				//imagejs.msg('acquiring ('+x+','+y+') done ');
			}
		},
		end:function(){jmat.gId('cvBase').onclick=null}
	}
	
	// create menu to operate module
	var menu={
		Start:function(){
			imagejs.msg('Morphomarker acquisition active');
			imagejs.modules[url].start();
		},
		End:function(){
			imagejs.msg('Morphomarker acquisition ended');
			imagejs.modules[url].end();
		}
	}
	var name= 'Morphomarkers v0.1';
	jmat.gId('menu').appendChild(imagejs.menu(menu,name)); 
	
	
})()