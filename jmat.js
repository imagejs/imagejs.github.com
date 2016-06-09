console.log('jmat :-)');

jmat = {
	
abs:function(x){ // absolute value
	if (Array.isArray(x)){return x.map(function(xi){return jmat.abs(xi)})}
	else{return Math.abs(x)}
},

array2mat:function(x){ // to handle indexed arrays by converting them into two separate numerically indexed arrays
	var j = 0, y1=[], y2=[];
	for(var i in x){
		y1[j]=i;
		y2[j]=x[i];
		j=j+1;
	}	
	return [y1,y2]	
},

array2str:function(x,sp){ // convert array into a sp separated
	if (!sp){sp='\n'}
	y=x[0];
	for (var i=1;i<x.length;i++){
		y=y+sp+x[i];
	}
	return y
},

array2obj:function(A){
	var y = {};
	A.map(function(x){y[x[0]]=x[1]});
	return y;
},

arrayfun:function(x,fun,i){ // apply function to each element of an array
	if (Array.isArray(x)){return x.map(function(xi,i){return jmat.arrayfun(xi,fun,i)})}
	else{return fun(x,i)}
},

array2table:function(a){ // determines unique entries and builds a table with counts
	var t = {columns:jmat.unique(a)};
	t.rows = [];
	t.rows[0] = t.columns.map(function(u){var c = 0; a.map(function(ai){if(ai==u){c++}});return c});
	return t;
},

bin2dec:function(x){
	var n=x.length;
	return x.split('').map(function(xi,i){return xi*Math.pow(2,n-i-1)}).reduce(function(a,b){return a+b});
},

cat:function(x,y){ // cat will work for matrices and objects
	x=this.stringify(x);
	y=this.stringify(y);
	return this.parse(x.slice(0,x.length-1)+','+y.slice(1,y.length));		
},

callback:function(url,fun,success){ // jmat.callback('https://api.github.com/users/jonasalmeida',function(x){console.log(x)})
	if(!fun){fun=function(x){console.log(x)}} // default is to dump it on teh console
	if(typeof(fun)=='function'){
		var funId = this.uid('fun');
		this.callback[funId]=function(x){delete jmat.callback[funId];return fun(x)};
		this.load(url+'?callback=jmat.callback.'+funId,success);
	}
	else{this.load(url+'?callback='+fun,success)} // if fun is just the function name	
},

catArray:function(A){ // optimized for conCATenation of an array of numerically indexed arrays
	// this function was developed to adress memory issues of dealing with large arrays, not performance
	var Astr='[',Ai='';
	for(var i=0;i<A.length;i++){
		Ai=JSON.stringify(A[i]);
		Astr+=Ai.slice(1,Ai.length-1)+',';
	}
	return JSON.parse(Astr.slice(0,Astr.length-1)+']');
},

cEl:function(x,id){
	x = document.createElement(x);
	if(id){x.id=id}
	return x
},

class:function(x){
	if(!x.constructor){return null}
	else{return x.constructor.name}
},

clone:function(x){ // clone object without functional elements
	return JSON.parse(JSON.stringify(x))
},

clone2:function(x){ // clone object that may have functional elements
	return jmat.parse(jmat.stringify(x))
},

cloneArray:function(A){
	if(Array.isArray(A)){return A.map(function(x){return jmat.cloneArray(x)})}
	else{return A}
},

cloneVector:function(V){// fastar than cloneArray if your array only has one dimension
	return V.map(function(v){return v})
},

console:function(id){
	if(!id){id = 'jmatConsole'};
	if(!jmat.gId(id)){
		var div = document.createElement('div');
		div.id = id;
		document.body.appendChild(div);
	}
	// Now that we have a place to go lets populate it
	div.innerHTML="..."; // start with a blank slate
	return div;
},

colon:function(x){// equivalent to x(:)
	var y=[]; // to have it in the scope
	jmat.arrayfun(x,function(x){y[y.length]=x});
	return y;
},

compress: function (uncompressed) { // Source: http://rosettacode.org/wiki/LZW_compression#JavaScript
        uncompressed = this.stringify(uncompressed); // this is new - such that we are sompressing JS objects, not strings
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            if (dictionary[wc]) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },

decompress: function (compressed) {
	        "use strict";
	        // Build the dictionary.
	        var i,
	            dictionary = [],
	            w,
	            result,
	            k,
	            entry = "",
	            dictSize = 256;
	        for (i = 0; i < 256; i += 1) {
	            dictionary[i] = String.fromCharCode(i);
	        }

	        w = String.fromCharCode(compressed[0]);
	        result = w;
	        for (i = 1; i < compressed.length; i += 1) {
	            k = compressed[i];
	            if (dictionary[k]) {
	                entry = dictionary[k];
	            } else {
	                if (k === dictSize) {
	                    entry = w + w.charAt(0);
	                } else {
	                    return null;
	                }
	            }

	            result += entry;

	            // Add w+entry[0] to the dictionary.
	            dictionary[dictSize++] = w + entry.charAt(0);

	            w = entry;
	        }
	        return this.parse(result);
	    },

colormap:function(c){
	if(!c){c='default'}
	switch(c){
		case 'default':
		c=[[0,0,0.5625],[0,0,0.625],[0,0,0.6875],[0,0,0.75],[0,0,0.8125],[0,0,0.875],[0,0,0.9375],[0,0,1],[0,0.0625,1],[0,0.125,1],[0,0.1875,1],[0,0.25,1],[0,0.3125,1],[0,0.375,1],[0,0.4375,1],[0,0.5,1],[0,0.5625,1],[0,0.625,1],[0,0.6875,1],[0,0.75,1],[0,0.8125,1],[0,0.875,1],[0,0.9375,1],[0,1,1],[0.0625,1,0.9375],[0.125,1,0.875],[0.1875,1,0.8125],[0.25,1,0.75],[0.3125,1,0.6875],[0.375,1,0.625],[0.4375,1,0.5625],[0.5,1,0.5],[0.5625,1,0.4375],[0.625,1,0.375],[0.6875,1,0.3125],[0.75,1,0.25],[0.8125,1,0.1875],[0.875,1,0.125],[0.9375,1,0.0625],[1,1,0],[1,0.9375,0],[1,0.875,0],[1,0.8125,0],[1,0.75,0],[1,0.6875,0],[1,0.625,0],[1,0.5625,0],[1,0.5,0],[1,0.4375,0],[1,0.375,0],[1,0.3125,0],[1,0.25,0],[1,0.1875,0],[1,0.125,0],[1,0.0625,0],[1,0,0],[0.9375,0,0],[0.875,0,0],[0.8125,0,0],[0.75,0,0],[0.6875,0,0],[0.625,0,0],[0.5625,0,0],[0.5,0,0]];
	  	break;
	default:
	  c = 'not found';
	}
	return c
},

d3:{
	figure:function(id,type){ // create figure by appending d3's svg element to DOM element with specified id
		if (typeof(id)==='undefined'){
			var fig = d3.select("body").append("div");
			fig.id = jmat.uid('fig');
		}
		else{
			if(jmat.gId(id)!=null){var fig = d3.select('#'+id);} // if it exists
			else {var fig = this.figure();fig[0][0].id = id} // otherwise create it
		}	
		
		if (typeof(type)==='string'){
			fig.attr('class',type); // possibilities: "chart", 
		}
		this.gcf=fig;
		return fig;		
	},
	
},

data:{
	wappUI:function(id){ // UI for the wApps ecosystem
		if(!id){id = jmat.uid()}; // if build target element doesn't exist, then create it
		if(!document.getElementById('lala')){$('<div id="'+id+'">').appendTo(document.body);}
		// now the target exists for sure
		var div = $('#'+id);
		var divDataInput = $('<div id="divDataInput">').appendTo(div);
		var idTextArea = jmat.uid('inputTextArea');
		var inputTextArea = $('<textarea id = "'+idTextArea+'" rows="10"></textarea><button id="inputTextAreaParse">Parse</button><br>').appendTo(divDataInput)
		var inputDataFile = $('<input type="file" id="inputDataFile" multiple>').appendTo(divDataInput);
		//inputDataFile.idTextArea=idTextArea;
		inputDataFile.change(function(){
			jmat.loadFiles(this.files,"readAsText",function(x){document.getElementById(idTextArea).value=x.result});});
		$('#inputTextAreaParse').click(function(){jmat.data.parse(idTextArea)});
	},

	wksp:[], // workspace

	parse:function(id){ // parsing text tab delimited data into a table (compatible with google fusion tables table template)
		jmat.data.wksp.push(jmat.text2table(document.getElementById(id).value));
	}
},

data2imData:function(data){ // the reverse of im2data, data is a matlabish set of 4 2d matrices, with the r, g, b and alpha values
	var n=data.length, m=data[0].length;
	//var imData = {width:m, height:n, data:[]};
	var imData = document.createElement('canvas').getContext('2d').createImageData(m,n);
	for (var i=0;i<n;i++){ //row
		//data.r[i]=[];data.g[i]=[];data.b[i]=[];data.a[i]=[];
		for (var j=0;j<m;j++){ // column
			ij=(i*m+j)*4;
			imData.data[ij]=data[i][j][0];
			imData.data[ij+1]=data[i][j][1];
			imData.data[ij+2]=data[i][j][2];
			imData.data[ij+3]=data[i][j][3];
		}
	}
	return imData;
},

deblank:function(s){ // remove tailing blanks from string
	return s.replace(/^\s+/,'').replace(/\s+$/,'');
},

dec2bin:function(x,n){
	if(!n){n=Math.ceil(this.log(x,2))+1};
	var b='';
	for(i=n-1;i>=0;i=i-1){
		m=Math.pow(2,i);
		if(x>=m){b=b+'1';x=x-m}
		else{b=b+'0'}
	};
	return b
},

disp:function(x){ // by default displays both in the console and in document.body
	console.log(x);
	document.body.innerHTML+='<br><span style="color:blue">'+x+'</span>';
},

div:function(id,html){
	if(!this.gId(id)){
		div = this.cEl('div');
		div.id=id;
		document.body.appendChild(div);
	}else{div=this.gId(id)}
	if(!!html){div.innerHTML=html};
	return div
},

dotFun:function(A,B,fun){ // dot matrix function
	4;
},

dimfun:function(){ // first argument is the function, subsequent arguments specify dimensions
	if(arguments.length==0){arguments=[function(){return 0}]}
	var fun=arguments[0];
	if(arguments.length>1){
		if(typeof(arguments[1])!='number'){var x = [];for(var i=0;i<arguments[1].length;i++){x[i]=arguments[1][i]}}
		else{var x=[];for(var i=1;i<arguments.length;i++){x[i-1]=arguments[i]}} // note first argument is always fun
		var z=[];
		if(x.length<2){
			for(var i=0;i<x[0];i++){
				z[i]=fun(i); // fun has access to array index
			}
		}
		else {
			var x0=x[0];
			x=x.slice(1);
			for(var i=0;i<x0;i++){
				z[i]=jmat.dimfun(fun,x);
			}
		}
	}
    else {z=fun()}
	return z
},

edge:function(M){//find edge in bidimensional binary matrix such as what is produced by im2bw
	var n = M.length, m = M[0].length;
	var E=M.map(function(x,i){return x.map(function(y,j){
		if((i>0)&&(i<n-1)&&(j>0)&&(j<m-1)&&(y==1)){
			var s = M[i-1][j]+M[i-1][j+1]+M[i][j+1]+M[i+1][j+1]+M[i+1][j]+M[i+1][j-1]+M[i][j-1]+M[i-1][j-1];
			if(s<8){return 1} // this is an edge
			else{return 0}
		}
		else {return 0}
	})});
	return E
},

exist:function(x){ // does it exist? note x is the variable name, not the variable itself
	if(eval('typeof('+x+')')=='undefined'){return false}
	else{return true}
},

extractSegs:function(bw){ // extracts segmented features from a [0,1] matrix and retruns them as an Array
	if(typeof(segFeatures)=='undefined'){var segFeatures=[]} // collect extracted features here
	var m = jmat.max2(bw);
	var n = jmat.size(bw);
	while(m[0]>0){ // extract this feature
		var C=[1,0,0]; // always use yellow
		//jmat.plot(cvTop,m[1][1],m[1][0],'s',{Color:[1,1,0],MarkerSize:30});
		var extractSeg = function(x,y,S){ // bw is passed in the scope of extractSegs
			if(typeof(S)=='undefined'){var S=[]} // collect feature's positions
			S[S.length]=[x,y];bw[x][y]=0;
			// check which neighbors are >0 and take them out too
			var xi,yi;
			if(x>0){xi=x-1;yi=y;if(bw[xi][yi]>0){S=extractSeg(xi,yi,S)}}
			if(x<n[0]-1){xi=x+1;yi=y;if(bw[xi][yi]>0){S=extractSeg(xi,yi,S)}}
			if(y>0){xi=x;yi=y-1;if(bw[xi][yi]>0){S=extractSeg(xi,yi,S)}}
			if(y<n[1]-1){xi=x;yi=y+1;if(bw[xi][yi]>0){S=extractSeg(xi,yi,S)}}
			return S;
		}
		segFeatures[segFeatures.length]=extractSeg(m[1][0],m[1][1]);//extraction starts with coordiantes ofmaximum value
		m = jmat.max2(bw);
	}
	return segFeatures.map(function(si){return jmat.transpose(si)})
},

fieldnames:function(x){
	y=[];i=0;
	for(var f in x){
		y[i]=f;
		i++;
	}
	return y;
},

find:function(x,patt,modifier){ // find wich elements of an array match a pattern
	if(!modifier){modifier='i'}// default is case insensitive
	var y = [];
	if(Array.isArray(patt)){patt='('+patt.join(')|(')+')'} // allows multiple patterns
	patt = new RegExp(patt,modifier);
	var M
	for(var i in x){
		M=x[i].match(patt);
		if(!!M){y.push(i)}
	}
	return y
},

findExact:function(x,patt,modifier){ // find wich elements of an array match a pattern
	if(!modifier){modifier='i'}// default is case insensitive
	var y = [];
	if(Array.isArray(patt)){patt='^('+patt.join(')|(')+')$'} // allows multiple patterns
	else{patt='^'+patt+'$'}
	patt = new RegExp(patt,modifier);
	var M;
	for(var i in x){
		M=x[i].match(patt);
		if(!!M){y.push(i)}
	}
	return y;
},


fminsearch:function(fun,Parm0,x,y,Opt){// fun = function(x,Parm)
	// example
	//
	// x = [32,37,42,47,52,57,62,67,72,77,82,87,92]
	// y=[749,1525,1947,2201,2380,2537,2671,2758,2803,2943,3007,2979,2992]
	// fun = function(x,P){return x.map(function(xi){return (P[0]+P[1]*(1-Math.exp(-P[2]*(xi-P[3]))))})}
	// Parms=jmat.fminsearch(fun,[100,3000,1,30],x,y)
	//
	// Opt is an object will all other parameters, from the objective function (cost function), to the 
	// number of iterations, initial step vector and the display switch, for example
	// Parms=jmat.fminsearch(fun,[100,3000,1,30],x,y,{maxIter:5000,display:false})
	
	if(!Opt){Opt={}};
	if(!Opt.maxIter){Opt.maxIter=1000};
	if(!Opt.step){// initial step is 1/100 of initial value (remember not to use zero in Parm0)
		Opt.step=Parm0.map(function(p){return p/100});
		Opt.step=Opt.step.map(function(si){if(si==0){return 1}else{ return si}}); // convert null steps into 1's
	};
	if(typeof(Opt.display)=='undefined'){Opt.display=true};
	if(!Opt.objFun){Opt.objFun=function(y,yp){return jmat.sum(y.map(function(yi,i){return Math.pow((yi-yp[i]),2)}))}}
	
	var ya,y0,yb,fP0,fP1;
	var P0=jmat.cloneVector(Parm0),P1=jmat.cloneVector(Parm0);
	var n = P0.length;
	var step=Opt.step;
	var funParm=function(P){return Opt.objFun(y,fun(x,P))}//function (of Parameters) to minimize
	// silly multi-univariate screening
	for(var i=0;i<Opt.maxIter;i++){
		for(var j=0;j<n;j++){ // take a step for each parameter
			P1=jmat.cloneVector(P0);
			P1[j]+=step[j];
			if(funParm(P1)<funParm(P0)){ // parm value going in the righ direction
				step[j]=1.2*step[j]; // go a little faster
				P0=jmat.cloneVector(P1);
			}
			else{
				step[j]=-(0.5*step[j]); // reverse and go slower
			}	
		}
		if(Opt.display){if(i>(Opt.maxIter-10)){console.log(i+1,funParm(P0),P0)}}
	}
	return P0
},


get:function(key,callback,url){ // get content at url or key
	if (!callback){callback=function(x){console.log(x)}}
	if (!url){url=this.webrwUrl};
	var uid = this.uid();
	if(!this.get.jobs){this.get.jobs=[]}
	this.get.jobs[uid]={'fun':callback};
	var url=url+'?get='+key+'&callback=jmat.get.jobs.'+uid+'.fun';
	var s=document.createElement('script');
	s.id = uid;s.src=url;
	document.body.appendChild(s);
	setTimeout('document.body.removeChild(document.getElementById("'+uid+'"));delete jmat.get.jobs.'+uid+';',10000); // is the waiting still need ? script onload would be another possibility to delete it
	return uid;
},

gId:function(x){ // x is the id of an existing DOM element
	return document.getElementById(x)
},

html:function(x){ // convertes stuff (JSON mostly) to html
	var y = '';
	switch (typeof(x)){
		case 'object':
			if(Array.isArray(x)){ // x is an array
				/*if(typeof(x[0])=='object'){
					y = x.map(function(xi){return '<td>'+jmat.html(xi)+'</td>'})
				}
				else{
					y = '<table><tr><td>'+x.join('</td><td>')+'</td></tr></table>';
				}
				*/
				y = '<tr>'+x.map(function(xi){return '<td>'+jmat.html(xi).replace(/^<table>/,'').replace(/<\/table>$/,'')+'</td>'}).join('')+'</tr>';
				y = '<table>'+y+'</table>';
			}
			else{// x is an Object
				for(var xi in x){
					y+='<li><b>'+xi+'</b>: '+x[xi]+'</li>';
				}
			}
			break;
		default:
			//throw('jmat.html input type not recognized:',x);
			y = ''+x;
	}
	return y;
	// 
},

im1to255:function(x){// converts {0-1} matrix into an im data matrix
	4
},

imread:function(cv){ // reads image from context into matrix
	// find out what type of input
	if(typeof(cv)=='string'){ // cv is the id of a canvas element
		cv=jmat.gId(cv)
	}
	var ct=cv.getContext('2d'), n=cv.width, m=cv.height;
	var imData=ct.getImageData(0,0,n,m); // pixel values will be stored in imData.data
	return this.imData2data(imData)
},

imhalve:function(dt0,PSmax){ // poor man's version of imresize, it halves an image size by averaging two rows/columns
	var s = jmat.size(dt0);
	if(!PSmax){PSmax = jmat.prod(s.slice(0,2))-1} // if maximum size not defined then just have it once
	if(jmat.prod(s.slice(0,2))>PSmax){
		if(jmat.length(s)!==3){throw('this should be an image value matrix, size n x m x 4')}
		if(s[2]!==4){throw('this should be an image value matrix, size n x m x 4')}
		s = jmat.arrayfun(s,function(x){return Math.floor(x/2)}); // half size, with floored integers
		s[2]=4; // rgba
		var dt = jmat.zeros(s[0],s[1],s[2]);
		dt=dt.map(function(x,i){
			return x.map(function(y,j){
				return y.map(function(z,k){
					return (dt0[i*2][j*2][k]+dt0[i*2+1][j*2+1][k]+dt0[i*2][j*2+1][k])/3;
				})
			})
		});
	}
	else{var dt = dt0};
	// if maximum pixel size was set and was exceeded keep halving
	if(jmat.prod(jmat.size(dt).slice(0,2))>PSmax){dt = jmat.imhalve(dt,PSmax)} 
	return dt	
},

imwrite:function(cv,im,dx,dy){
	if(!dy){dx=0;dy=0} // default location
	if(typeof(cv)=='string'){cv=jmat.gId(cv)} //cv can also be the id of a canvas element
	if(!im.data){im=jmat.data2imData(im)} // such that im can also be the matrix created by imread
	var ct = cv.getContext('2d');
	ct.putImageData(im,dx,dy);
	return ct;
},

image:function(cv,im,dx,dy){ // for consistency
	return this.imwrite(cv,im,dx,dy);
}, 

imagesc:function(cv,dt,cm,fun,M){ // scales values to use full range of values. cv is the canvas, dt the data, and cm the colormap
	if(!cm){cm=jmat.colormap()}
	if(!fun){fun=function(){return 1}}; // opaque function
	cm = jmat.transpose(cm); // to get one vector per channel
	var n = cm[0].length-1; // should be 64-1=63
	var I = jmat.dimfun(function(i){return i/(n)},n+1); // 64 numbers evenly spaced between 0 and 1
	if(!M){M = jmat.max(jmat.max(dt))};
	if(typeof(fun)=='string'){eval('fun='+fun)} // allow eval fun with transparencies
	dt = jmat.arrayfun(dt,function(x){return [jmat.interp1(I,cm[0],[x/M])[0],jmat.interp1(I,cm[1],[x/M])[0],jmat.interp1(I,cm[2],[x/M])[0],fun(x)]});
	dt = jmat.arrayfun(dt,function(x){return Math.round(255*x)});
	if(!!cv){jmat.imwrite(cv,dt)};
	return dt
},

imagebw:function(cv,dt,C0,C1){ // imagesc for binary matrices
	if(!C0){C0=[0,0,0,0]}
	if(!C1){C1=[255,255,255,255]}
	var dt01 = jmat.arrayfun(dt,function(x){if(x==1){return C1}else{return C0}})
	if(!!cv){jmat.imwrite(cv,dt01)};
	return dt01;
},

imData2data:function(imData){ // imData is the data structure returned by canvas.getContext('2d').getImageData(0,0,n,m)
	var m=imData.width, n=imData.height, data=[];
	for (var i=0;i<n;i++){ //row
		data[i]=[];
		for (var j=0;j<m;j++){ // column
			ij=(i*m+j)*4;
			data[i][j]=[imData.data[ij],imData.data[ij+1],imData.data[ij+2],imData.data[ij+3]]
		}
	}
	return data;	
},

imMap:function(im,fun){ // applies function to all pixels of an image and returns the 2D map of fun values
	if(!fun){fun=function(xy){return 0}} // in no fun return a 2D zero matrix
	return im.map(function(x){
		return x.map(function(xy){
			return fun(xy)
		})
	})
},

im2bw:function(im,thr){ // segments 2d matrix into 0's and 1's for values below or above a threshold
	return jmat.imMap(im,function(xy){
		if(xy>=thr){return 1}
		else{return 0}
		}
	)
},

interp1:function(X,Y,XI){ // linear interpolation, remember X is supposed to be sorted
	var n = X.length;
	var YI = XI.map(function(XIi){
		var i=jmat.sum(X.map(function(Xi){if (Xi<XIi){return 1}else{return 0}}));
		if (i==0){return Y[0]} // lower bound
		else if (i==n){return Y[n-1]} // upper bound
		else{return (Y[i-1]+(XIi-X[i-1])*(Y[i]-Y[i-1])/(X[i]-X[i-1]))}
	});
	return YI
},

ind:function(X,I){ // return vector of values reordered by vector of indexes
	return I.map(function(i){return X[i]});
},

innerfun:function(x,y,fun){ // inner operations between two arrays
	if(Array.isArray(x)){
		return x.map(function(xi,i){return jmat.innerfun(xi,y[i],fun)});
	}
	else{
		return fun(x,y)
	}
},

length:function(x){ // js Array.length returns highest index, not always the numerical length
	var n=0
	for(var i in x){n++};
	return n
},

load:function(url,cb,er){ // load script / JSON
	var s = document.createElement('script');
	s.src=url.replace("module.imagejs.googlecode.com/git","imagejs.org");
	s.id = this.uid();
	if(!!cb){s.onload=cb}
	if(!!er){s.onerror=er}
	document.body.appendChild(s);
	setTimeout('document.body.removeChild(document.getElementById("'+s.id+'"));',30000); // is the waiting still needed ?
	return s.id
},

loadSync:function(url,cb,er){ // Synchronous version of jmat.load
	var s = document.createElement('script');
	s.async=false; // <-- this is the only difference !
	s.src=url;
	s.id = this.uid();
	if(!!cb){s.onload=cb}
	if(!!er){s.onerror=er}
	document.body.appendChild(s);
	setTimeout('document.body.removeChild(document.getElementById("'+s.id+'"));',3000); // is the waiting still needed ?
	return s.id
},

loadScripts:function(urls,cb,er){ // loading multiple scripts sequentially, runn callback after the last one is loaded
	console.log('loading script '+urls[0]+' ...');
	if (urls.length>1){jmat.load(urls[0],function(){jmat.loadScripts(urls.slice(1))})} // recursion
	else {jmat.load(urls[0],cb,er)}
},

loadFiles:function(files,readAs,callback){
	//<input type="file" id="files" multiple onchange="jmat.loadFiles(this.files,'readAsText')"></input> //<-- example of button for reading text files
	if(!readAs){readAs='readAsDataURL'} // default is to read as dataURL
	for(var i=0;i<files.length;i++){
		this.readFile(files[i],readAs,callback)
	}
	return i
},

loadGoogleCoreChart:function(cb){ // load Google corechart visualization
	if(!cb){cb=function(){}};
	jmat.loadVar('google',function(){google.load('visualization', '1', {'callback':cb, 'packages':['corechart']})});
},

readFile:function(f,readAs,callback){
	var that = this;
	if(!callback){callback=function(x){ // DEAFAULT CALLBACK - you may want to write your own
		console.log('---'+x.file.fileName+'---');console.log(x.result); // comment out if you don't want to track reading in the console
		if(!that.work){that.work={}};if(!that.work.files){that.work.files=[]} // results stored in .work.files
		that.work.files[x.file.fileName]={file:x.file,result:x.result}; // array indexed to file name
		}
	}
	var reader = new FileReader();
	reader.onload=(function(theFile){
		return function(ev){
			callback({file:theFile,result:ev.target.result})
		}
	})(f)
	reader[readAs](f);
},

require:function(lib,fun){ // jmat's version of requirejs
	// if a url then just load it
	// if a variable name that doesn't exist then load it with loadVar
	// if the variable is found to exist then move on
	if(!fun){fun=function(){console.log('no fun required')}} // which is silly as it defaults to loadVar
	if(typeof(lib)=='string'){lib=[lib]}
	// check if this is a variable
	var libfun=function(lib){
		jmat.loadVar(lib[0],function(){
			if(lib.length>1){
				jmat.require(lib.slice(1),fun)
			}
			else{fun()} // have fun
		})
	}
	if(!lib[0].match(/http[s]{0,1}:/)){ // it is a variable
		if(typeof(window[lib[0]])=='undefined'){libfun(lib)} // load it only if it doesn't exist
	}
	else{libfun(lib)}
},

loadD3:function(callback){ // loads d3.js library
	//jmat.load('http://mbostock.github.com/d3/d3.v2.js',callback);
	jmat.load('d3.v2.min.js',callback);
},

log:function(x,n){
	if (!n){return Math.log(x)}
	else{return Math.log(x)/Math.log(n)}
},

loadVarCallBack:{},

loadVar:function(V,cb,er,cbId){ // check that an external library is loaded, V is the name of the variable, for example, "Q"

	if(Array.isArray(V)){ // are there more than one?
		if(!cbId){cbId=jmat.uid();jmat.loadVarCallBack[cbId]=cb}
		//if(V.length==1){jmat.load(V[0],cb,er)}
		//else if(V.length>1){jmat.load}	
		if(V.length>0){
			if(V.length>1){jmat.loadVar(V[0],function(){jmat.loadVar(V.slice(1),cb,er,cbId)},er,cbId)}
			else{ // V.length=1
				jmat.loadVar(V[0],jmat.loadVarCallBack[cbId],er);
			}
		}
	}
	else{
		var url;
		switch(V){
			case 'QM':
				url = 'https://qmachine.org/q.js';break;
			case 'CoffeeScript':
				url = 'https://raw.github.com/jashkenas/coffee-script/master/extras/coffee-script.js';break;
			case 'jQuery':
				url='https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';break;
			case 'jQuery.ui':
				if(typeof(jQuery)=="undefined"){ // check for jQuery dependency
					url="";
					jmat.loadVar('jQuery',function(){jmat.loadVar(V,cb,er,cbId)});
				}
				else{
					url='https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js';
					// add css to head
					lk = document.createElement('link');
					lk.rel='stylesheet';
					lk.href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/themes/smoothness/jquery-ui.css';
					document.head.appendChild(lk);
				}
				break;
			case 'd3':
				url='https://cdnjs.cloudflare.com/ajax/libs/d3/3.0.1/d3.v3.min.js';break;
			case 'google':
				url='https://www.google.com/jsapi';break;
			case 'minerva':
				url='http://minervajs.org/api';break;
			case 'usm':
				url='https://raw.github.com/usm/usm.github.com/master/usm.js';break;
			case 'crossfilter':
				jmat.loadVar('d3'); // dependency
				url='http://square.github.com/crossfilter/crossfilter.v1.min.js';break;
			case 'S3QLtranslator':
				url='http://js.s3db.googlecode.com/hg/translate/s3ql_translator.js';break;
			case 'PUBNUB':
					url='http://cdn.pubnub.com/pubnub-3.3.min.js';break;
			case 'cBio':
					url='https://dl.dropbox.com/s/x7yvewsh7xs1xtu/cBio.js?dl=1';break; // dev link
			default :
				if(!!V.match(/http[s]{0,1}:/)){url=V} // if it is a url
				else{throw('No library was found to assemble "'+V+'"')};
		}
		if(url.length>0){
			jmat.loadSync(url,cb,er);
			console.log('variable "'+V+'"'+' loaded from '+url);
		}
	}
	return V;
},

lookup:function(tbl,col_in,val_in,col_out){// lookup in table tbl, 
	// for value in column col_out where the column col_in has the value val_in
	var val_out={};// return results as a table
	// Find Columns
	var col_in_i=this.findExact(tbl.columns,col_in);
	if(col_in_i.length==0){throw('input column not found')}
	// if output columns not specified then get all
	if(!col_out){col_out=tbl.columns;var col_out_i=jmat.range(col_out.length-1)}
	else{var col_out_i=this.find(tbl.columns,col_out)}
	var rows = this.transpose(tbl.rows) , r=[] , Ind=[];
	for(var c in col_in_i){
		r=this.find(rows[col_in_i[c]],val_in);
		if(r.length>0){for (var i in r){Ind.push(r[i])}}
	}
	Ind = this.unique(Ind);
	val_out.columns=col_out_i.map(function(i){return tbl.columns[i]});
	val_out.rows=this.zeros(Ind.length,col_out_i.length);
	for(var i=0;i<val_out.columns.length;i++){
		for(var j=0;j<Ind.length;j++){
			val_out.rows[j][i]=rows[col_out_i[i]][Ind[j]]
		}
	}
	return val_out;
},

lookupExact:function(tbl,col_in,val_in,col_out){// lookup in table tbl, 
	// for value in column col_out where the column col_in has the value val_in
	var val_out={};// return results as a table
	// Find Columns
	var col_in_i=this.findExact(tbl.columns,col_in);
	if(col_in_i.length==0){throw('input column not found')}
	// if output columns not specified then get all
	if(!col_out){col_out=tbl.columns;var col_out_i=jmat.range(col_out.length-1)}
	else{var col_out_i=this.findExact(tbl.columns,col_out)}
	var rows = this.transpose(tbl.rows) , r=[] , Ind=[];
	for(var c in col_in_i){
		r=this.findExact(rows[col_in_i[c]],val_in);
		if(r.length>0){for (var i in r){Ind.push(r[i])}}
	}
	Ind = this.unique(Ind);
	val_out.columns=col_out_i.map(function(i){return tbl.columns[i]});
	val_out.rows=this.zeros(Ind.length,col_out_i.length);
	for(var i=0;i<val_out.columns.length;i++){
		for(var j=0;j<Ind.length;j++){
			val_out.rows[j][i]=rows[col_out_i[i]][Ind[j]]
		}
	}
	return val_out;
},

max:function(x){ //return maximum value of array
	if(Array.isArray(x[0])){return x.map(function(xi){return jmat.max(xi)})}
	else{return x.reduce(function(a,b){if(a>b){return a}else{return b}})};
	//return x.reduce(function(a,b){if(a>b){return a}else{return b}})
},

max2:function(x){ // returns maximum value of array and its index, i.e.  [max,i]
	if(Array.isArray(x[0])){ // coded only up to 2 dimensions
		var xx = jmat.transpose(x.map(function(xi){return jmat.max2(xi)}))
		var y = jmat.max2(xx[0]);
		return [y[0],[y[1],xx[1][y[1]]]];
	}
	else{return x.map(function(xi,i){return [xi,i]}).reduce(function(a,b){if(a[0]>b[0]){return a}else{return b}})};
	//return x.map(function(xi,i){return [xi,i]}).reduce(function(a,b){if(a[0]>b[0]){return a}else{return b}})
},

min:function(x){ //return maximum value of array
	return x.reduce(function(a,b){if(a<b){return a}else{return b}})
},

min2:function(x){ // returns maximum value of array and its index, i.e.  [max,i]
	return x.map(function(xi,i){return [xi,i]}).reduce(function(a,b){if(a[0]<b[0]){return a}else{return b}})
},

memb:function(x,dst){ // builds membership function
	var n = x.length-1;
	if(!dst){
		dst = this.sort(x);
		Ind=dst[1];
		dst[1]=dst[1].map(function(z,i){return i/(n)});
		var y = x.map(function(z,i){return dst[1][Ind[i]]});
		return dst;
	}
	else{ // interpolate y from distributions, dst
		var y = this.interp1(dst[0],dst[1],x);
		return y;
	}
	
},

not:function(x){ // negates Boolean value, or an array thereof
	if(Array.isArray(x)){return x.map(function(xi){return jmat.not(xi)})}
	else{return !x}
},

ones:function(){
	return jmat.dimfun(function(){return 1},arguments)
},

parse:function(x){ // x is a stringified Object
	eval('var res='+x);
	return res;
},

parseUrl:function(url){ // parsing url and its arguments out
	var u = {};u.url=url.match(/[htf]+tp[s]*:\/\/[^?]+/);
	if (u.url.length!==1){throw ('something is wrong with the syntax this url: '+url)}
	else{
		u.url=u.url[0];u.parms={};url.slice(u.url.length+1).split('&').map(function(x){y=x.split('=');u.parms[y[0]]=y[1];return x});
	}
	return u
},


plot:function(ctx,x,y,s,opt){ // plot
if(this.class(ctx)!="CanvasRenderingContext2D"){ // get context then
		switch (this.class(ctx)){
			case "String":
			ctx=jmat.gId(ctx).getContext('2d');
			break;
			case "HTMLCanvasElement":
			// assume it is a canvas element
			ctx=ctx.getContext('2d');
			break;
		}
		
	}
	//default opt
	var opt0={
		MarkerSize:12,
		Color:[0,0,1],
		MarkerEdgeColor:'auto',
		MarkerFaceColor:'none',
		x:x,
		y:y
	}
	if(!opt){opt=opt0};
	opt = jmat.cat(opt0,opt);
	// inherit colors
	if (typeof(opt.MarkerEdgeColor)=='string'){
		if(opt.MarkerEdgeColor=='auto'){opt.MarkerEdgeColor=opt.Color}
		else{opt.MarkerEdgeColor=[0,0,0,0]}
	}
	if (typeof(opt.MarkerFaceColor)=='string'){
		if(opt.MarkerFaceColor=='auto'){opt.MarkerFaceColor=opt.Color}
		else{opt.MarkerFaceColor=[0,0,0,0]} // string is 'none'
	}
	if(opt.Color.length==3){opt.Color}
	var L=opt.MarkerSize;
	switch(s){
		case 'o': // draw a circle
		ctx.beginPath();
		ctx.strokeStyle=jmat.rgba(opt.MarkerEdgeColor);
		ctx.arc(x,y,L/2,0,2*Math.PI,true);
		ctx.closePath();
		ctx.stroke();
		break;
		case 's': // draw a square
		ctx.beginPath();
		ctx.strokeStyle=jmat.rgba(opt.MarkerEdgeColor);
		ctx.strokeRect(x-L/2,y-L/2,L,L);
		ctx.closePath();
		ctx.stroke();
		break;
		case '+': // draw a +
		ctx.beginPath();
		ctx.strokeStyle=jmat.rgba(opt.MarkerEdgeColor);
		ctx.moveTo(x-L/2,y);ctx.lineTo(x+L/2,y);
		ctx.moveTo(x,y-L/2);ctx.lineTo(x,y+L/2);
		ctx.closePath();
		ctx.stroke();
		break;
		case 'x': // draw a x
		ctx.beginPath();
		ctx.strokeStyle=jmat.rgba(opt.MarkerEdgeColor);
		ctx.moveTo(x-L/2,y-L/2);ctx.lineTo(x+L/2,y+L/2);
		ctx.moveTo(x-L/2,y+L/2);ctx.lineTo(x+L/2,y-L/2);
		ctx.closePath();
		ctx.stroke();
		break;
		case '*': // draw a *
		this.plot(ctx,x,y,'+',opt);
		opt.MarkerSize=L*Math.cos(Math.PI/4);
		this.plot(ctx,x,y,'x',opt);
		break;
	}
	// return handle structure
	opt.x=x;
	opt.y=y;
	opt.radius=opt.MarkerSize;
	return opt
},

/*
plot:function(id,x,y,opt){
	if(typeof(google)=="undefined"){
		jmat.loadGoogleCoreChart(function(){jmat.plot(id,x,y,opt)});
	}
	else if(typeof(!google.visualization)=="undefined"){
		google.load('visualization', '1', {'callback':function(){jmat.plot(id,x,y,opt)}, 'packages':['corechart']})
	}
	else{
		//console.log('plot');
		var dt = jmat.transpose([x,y]);
		dt.unshift(['x','y']);
		var data = google.visualization.arrayToDataTable(dt);
		var chart = new google.visualization.ScatterChart(jmat.div(id));
		chart.draw(data);
	}
},
*/

post:function(x,id){ // post x onto DOM element
	if(typeof(jQuery)=='undefined'){jmat.loadVar('jQuery',function(){jmat.post(x,id)})}
	else{
		if(typeof(x)=='string'){x = jQuery(x);x=x[0]};
		if(!id){id = jmat.uid('UID')}
		if(!jmat.gId(id)){var div = jmat.cEl('div');div.id=id;document.body.appendChild(div)}
		jmat.gId(id).appendChild(x);
	}
},

prod:function(x){return x.reduce(function(a,b){return a*b})},

qmachine:{ // this whole section will most likely not work any more, it was written to play with a draft version of Sean's Qmachine
	step:1000, // miliseconds between calls
	load:function(cb,er){ // load qmachine js library
		jmat.loadVar(['QM','CoffeeScript'],function(){
			QM.submit=function(val,fun,box,more,jobId){return jmat.qmachine.submit(val,fun,box,more,jobId)};
			//QM.map=function(val,fun,box,rvStep){return jmat.qmachine.map(val,fun,box,rvStep)};
			//QM.reduce=function(val,fun,box,rvStep){return jmat.qmachine.reduce(val,fun,box,rvStep)};
			QM.mapReduce=function(val,funMap,funReduce,box,step){return jmat.qmachine.mapReduce(val,funMap,funReduce,box,step)};
		});
	},
	jobs:{},
	reval:function(val,fun,box,more,jobId){
		if(typeof(Q)=='undefined'){
			throw('Q not loaded')
		}
		return jmat.qmachine.jobs[jmat.qmachine.revalJob(val,fun,box,more,jobId)];
	},

	submit:function(val,fun,box,more,jobId){
		if(!jobId){jobId=jmat.uid('job')};
		if(!more){more=[]};
		jmat.qmachine.jobs[jobId] = {done:false,jobId:jobId,more:more};
		/*if((typeof(Q)=='undefined')||(typeof(CoffeeScript)=='undefined')){
			jmat.loadVar(['CoffeeScript','QM'],function(){
				fun=jmat.qmachine.fun(fun);
				jmat.qmachine.revalJob(val,fun,box,more,jobId);
			})
		}
		else {*/
		fun=jmat.qmachine.fun(fun);
		jmat.qmachine.revalJob(val,fun,box,more,jobId);
		//}
		return jmat.qmachine.jobs[jobId];
	},

	revalJob:function(val,fun,box,more,jobId){ // version of reval that directs output to a jobs object
		if(!more){more=[]};
		if(!jobId){jobId=jmat.uid('job')};
		//this.jobs[jobId].done=false;
		//this.jobs[jobId]=this.reval(val,fun,box);
		this.jobs[jobId]=function(){ // this is where the job is done !!
			var qi = Q.avar();
			qi.val = {f: fun, x: val};
			qi.box = box;
			qi.done = false;
			qi.more=more; // to pass additional arguments
			//qi.onready = function (evt) { this.val = fun(this.val); return evt.exit(); };
			//qi.onready=fun;
			qi.onready = function (evt) {
				this.val = this.val.f(this.val.x);
				//this.done=true;
				return evt.exit();
			};
			qi.onready = function (evt) {
				qi.done = true;
				qi.error = false;
				//qi.error = false;
				return evt.exit();
			};
			qi.onerror = function (evt) {
				qi.error = true;
			}
			return qi;
		}(val,fun,box);
		this.jobs[jobId].jobId=jobId;
		return jobId;
	},
	fun:function(f){ // converts CoffeeScript to JavaScript if f is a string + other fun house cleaning
		if(typeof(f)=='string'){
			if(typeof(CoffeeScript)=='undefined'){jmat.loadVar('CoffeeScript');throw('CoffeeScript was missing, try again')};
			return CoffeeScript.eval(f);
		}
		else{ // assuming it is a function, kiss ass of JSLint zealots and add a ; before closing }
			return jmat.parse(f.toString().replace(/([ ]*)}$/,'$1;}'));
		}
	},
	map:function(x,fun,box,step){ // jmat.qmachine.map(valArray,funMap)
		//if (typeof(fun)==='string'){fun = jmat.parse(jmat.coffee.compile2js(fun))};
		if(!step){step=jmat.qmachine.step}; // control default step at jmat.qmachine.step
		fun = jmat.qmachine.fun(fun);
		var n = x.length;
		y = x.map(function(xi){return jmat.qmachine.submit(xi,fun,box,xi)}); // note original value being kept as more, the 4th input argument
		// revive
		var trv=setInterval;
		// monitor mapping
		var done, doneStr='', i = 0;t = setInterval(function(){
			i+=1;
			done = y.slice(0,n).map(function(yi,j){return y[j].done});
			doneStr='';
			for(var j=0;j<n;j++){
				if(y[j].done){doneStr+='<'+y[j].val+'>'}
				else{if(y[j].error){ // if error
						y[j].error=false;
						//y[j]=jmat.qmachine.submit(y[j].more,fun,box,step);
						console.log('Mapping error at #'+i+':',y[i]);
						doneStr+='*'; // "*" indicates error
					}
					else{doneStr+='-'} // not done yet	
				}
			}
			//console.log('countMap:',jmat.sum(done));
			console.log('M'+i+'('+doneStr+')');
			if(jmat.sum(done)==n){clearInterval(t)};			
		},step);
		return y;

	},
	reduce:function(x,fun,box,step){
		if(!step){step=jmat.qmachine.step}; // control default step at jmat.qmachine.step
		// check that the array is of Avar elements
		if(x[0].constructor.name!=="AVar"){
			x=x.map(function(xi){return Q.avar({val:xi,box:box,done:true})})
		}
		var n = x.length , doneStr = '';
		//x.map(function(xi){xi.reduceStarted=false;return false}); // prepare reduce parm
		//var y = QM.avar({val:x , box:box , done:false}); // results wil be placed here
		var r = x.map(function(xi){return {}}); // keep flags for reduction process here
		var i = 0, toReduce=[], t = setInterval(function(){ // timer
			i+=1;
			toReduce=[]; // reset each time
			for(var j=0;j<x.length;j++){
				if(x[j].done&(!r[j].started)&(!x[j].error)){ // if ready to be reduced and not started yet
					toReduce.push(j);
				}
				if (toReduce.length==2){ // if there are two ready to go
					r[toReduce[0]].started=r[toReduce[1]].started=true; // flag both as being reduced
					//toReduce.map(function(ri){r[ri].started=true}); // flag both as being reduced
					x.push(jmat.qmachine.submit([x[toReduce[0]].val,x[toReduce[1]].val],fun,box,toReduce)); // notice indexes of values being reduced send as the "more" argument
					r.push({});
					break;
				}
			}
			doneStr='';
			for(var j=0;j<x.length;j++){
				//if((j==)&(!x[j].reduceStarted)){doneStr+='.'};
				if((r[j].started)&(x[j].error)){ // if error
					console.log('Reduce error found at #'+j+':',x[j]);
					doneStr+='*';
					// do something about it here !
				};
				if((!x[j].done)&(!r[j].started)){doneStr+='.'}; // if neither done nor started
				if((x[j].done)&(!r[j].started)){doneStr+='-'}; // if done but not started
				//if((x[j].done)&(!!r[j].started)){doneStr+='+'}; // being reduced as we speak
				if((x[j].done)&(!!r[j].started)){doneStr+='<'+x[j].val+'>'}; // being reduced as we speak
				if(j==n-1){doneStr+=':'};
				
			}
			for(var j=r.length;j<(2*n-1);j++){doneStr+=' '};
			
			var countReduce=jmat.sum(x.map(function(xi,j){return (xi.done)}))+jmat.sum(x.map(function(xi,j){return (!!r[j].started)}));
			//console.log('countReduce:',countReduce);
			if(countReduce==(4*n-3)){
				clearInterval(t);
				//console.log('R'+i+'['+doneStr.slice(0,doneStr.length-1)+'+]');
				console.log('R'+i+'['+doneStr.slice(0,doneStr.length-1)+'<'+x[x.length-1].val+'>]');
				console.log(x[x.length-1].val);			
			}
			else{console.log('R'+i+'['+doneStr+']');}
	
		},step);

		return x;
	},
	mapReduce:function(x,funMap,funReduce,box,step){ // mapReduce(x,funMap(xi){},funReduce(x1,x2){},box)
	return jmat.qmachine.reduce(jmat.qmachine.map(x,funMap,box,step),funReduce,box,step);
	}
},

rand:function(){
	return jmat.dimfun(function(){return Math.random()},arguments)
},

range:function(a,b,c){ // creates a monotonic series
	switch(arguments.length){
		case 1:
			c=a;b=1;a=0;
			break;
		case 2:
			c=b;
			b=1;
	}
	var y = [];
	for(var i=a;i<=c;i=i+b){y.push(i)}
	return y;
},

ranksum:function(x,y){ // this is just a first approximation while something saner emerges for stats
	var s=x.map(function(xi){return y.map(function(yi){return [yi>xi,yi<xi]}).reduce(function(a,b){return [a[0]+b[0],a[1]+b[1]]})}).reduce(function(a,b){return [a[0]+b[0],a[1]+b[1]]});
	return Math.abs(s[0]-s[1])/(x.length*y.length);
},


//reval:function(val,fun,box,more,jobId){
//	// jmat.load('https://raw.github.com/jashkenas/coffee-script/master/extras/coffee-script.js')
//	//if (typeof(fun)==='string'){fun = jmat.parse(CoffeeScript.compile(fun))};
//	return this.qmachine.submit(val,fun,box,more,jobId);
//},

rEl:function(id,t){ // remove element
	if(typeof(id)=='string'){var el = jmat.gId(id)}
	else{ var el = id}
	if(!t){el.parentNode.removeChild(el)}
	else{setTimeout(function(){el.parentNode.removeChild(el)},t)}	
},

reval_old:function(x,fun,callback,url){ 
	if (!Array.isArray(x)){x=[x]} // make sure x is an array
	if (!Array.isArray(fun)){fun=[fun]} // make sure it is an array of functions
	if (!callback){callback=function(x){console.log(x)}}
	if (!url){url=this.webrwUrl};
	//if (!Array.isArray(fun)){fun=[fun]} // make sure it is an array of functions
	// create webrw jobList
	if (!this.reval.jobs){this.reval.jobs=[]}
	var uid = this.uid();
	this.reval.jobs[uid]={fun:fun,x:x,callback:callback,url:url}
	//match x and fun dimensions
	var n = Math.max(jmat.reval.jobs[uid].x.length,jmat.reval.jobs[uid].fun.length);
	for (var i=jmat.reval.jobs[uid].x.length;i<n;i++){jmat.reval.jobs[uid].x[i]=jmat.reval.jobs[uid].x[i-1]}
	for (var i=jmat.reval.jobs[uid].fun.length;i<n;i++){jmat.reval.jobs[uid].fun[i]=jmat.reval.jobs[uid].fun[i-1]}
	this.set('if(!window.jmatReval){jmatReval=[]};jmatReval["'+uid+'"]={ jobs:'+jmat.stringify(jmat.reval.jobs[uid])+'};',this.parse('function(key){jmat.reval.jobs.'+uid+'.key=key;jmat.revalSet("'+uid+'");}'),undefined,url);
	return uid
},

revalSet:function(uid){ // set job for remote evaluation, task is the key of the webrw document aggregating individual jobs
	console.log('remote eval of '+uid+' at '+jmat.reval.jobs[uid].url+'/doc/'+jmat.reval.jobs[uid].key);
	console.log(uid);
},

revalGet:function(task){ //
	4;
},

rgba:function(x){ // genertes rgba string HTML Color can understand for a 0 to 1 vector of 3 or 4 elements
	if (x.length==3){x=jmat.cat(x,[1])} // if rgb make rgba by adding opaque alpha
	x=x.map(function(xi){return Math.round(xi*255)});
	return ('rgba('+x.toString()+')');
},

rgb:function(x){ // genertes rgba string HTML Color can understand for a 0 to 1 vector of 3 or 4 elements
	x=x.map(function(xi){return Math.round(xi*255)});
	return ('rgb('+x.slice(0,3).toString()+')');
},

s3db:{ // S3DB connectivity
	info:{uid:{},login:{}},
	searchParms:function(){ // return object with parameters concatenated with the page's URL
		return jmat.array2obj(document.location.search.slice(1).split('&').map(function(x){return x.split('=')}));
	},
	call:function(p,cb,er){ // p can be a parameter object or a string with the URL
		if(typeof(p)=="string"){p={url:p}}
		if(!cb){cb = function(x){console.log('Success: ',x)}}
		var callId = jmat.uid('UID');
		jmat.s3db.call[callId]=cb;
		//jmat.load(p.url+'?format=json&callback=jmat.s3db.call.'+callId,function(){setTimeout('delete jmat.s3db.call.'+callId,5000)},function(x){er(x);setTimeout('delete jmat.s3db.call.'+callId,5000)});
		var url=!p.url.match(/\?/)?p.url+'?':p.url+'&';
		jmat.load(url+'format=json&callback=jmat.s3db.call.'+callId,function(){setTimeout('delete jmat.s3db.call.'+callId,5000)},er); // err call kept on reccord
	},
	s3ql:function(q,cb,er){ // S3QL queries
		var p = jmat.clone(jmat.s3db.info.login);
		var u = p.url+'/S3QL.php?query='+q+'&key='+p.key;
		
		// account for the possibility that q is in a compact format
		jmat.s3db.decompact(q,function(q){
			
			console.log(u);
		})
		//var u = p.url+'/S3QL.php?query='+q+'&key='+p.key;
		
	},
	decompact:function(c,cb){ // converts compact S3QL into XML S3QL. See s3ql.org for details. Note both assynchronous and synchronos execs are supported
		// borrowing Lena's translator
		if(c[0]!='<'){
			if(typeof(S3QLtranslator)=='undefined'){
				if(typeof(cb)!='function'){cb = function(x){
					console.log(x)
					}
				}
				jmat.loadVar(['jQuery','S3QLtranslator'],function(){cb(S3QLtranslator(c))});
				console.log('S3QLtranslator was not loaded, it is now');
				return "assynchronous execution ..."
			}
			else{
				var y = S3QLtranslator(c);
				if(typeof(cb)=='function'){return cb(y)}
				else{return y} 
			}
		}
		else{
			if(typeof(cb)=='function'){return cb(c)}
			else{return c}
		}
	},
	
	login:function(info,cb,id){ // builds on jmat.s3db.UI.login, if you want to do it quietly use id of hidden id
		if(!cb){cb=function(){console.log("jmat.s3db.info.uid:",jmat.s3db.info.uid)}}
		if(!info){ // this info argument is very flexible, see comments at jmat.s3db.UI.login 
			this.UI.login(cb); // ask for them or pick them up from the URL
		}
		else{ // assume they are correct and move on
			  // remember login is a structure of the type: {login:{url:"...",key:"..."},uid:{...}}
			
			//check that info is not being passed as the contents of info.login
			if(!info.login){
				jmat.s3db.info.login=info;
				// now get uid information
				jmat.s3db.call(jmat.s3db.info.login.url+"/URI.php?key="+jmat.s3db.info.login.key,function(x){jmat.s3db.info.uid=x[0];cb()});
			}
			else{
				this.info=info;
				cb();
			}
		}
		
	},
	
	UI:{
		input:function(id,val,ok){
			var ip; // input element
			if(typeof(id)=='string'){ip = jmat.gId(id)}
			else{ip=id}
			ip.size=50;
			if(ok){ip.style.color='green'}
			else{ip.style.color='red'}
			ip.value=val;
			ip.onclick=function(){ip.value='';ip.onclick=null}; // first click clears content
			return ip;
		},
		login:function(url,cb,id){  // it can also be used just with a callback function as teh single argument, 
									// or with a {url:"...",key:"..."} object
									// note the credetials of teh active connection are kept at jmat.s3db.info
			if(typeof(jQuery)=="undefined"){jmat.loadVar('jQuery',function(){jmat.s3db.UI.login(url,cb,id)})}
			else{
				var login ={}, ip = jmat.s3db.UI.input; // note ip =  jmat.s3db.UI.input !!!
				if(!id){id = 's3dbLogin'}
				if(typeof(url)=='function'){ // single callbcak argument
					cb=url;
					url=undefined;
					var u = document.location.search.match(/url=([^&]+)/);
					if(!!u){login.url=u[1]}
					//console.log(url,cb);
					}
				else if(typeof(url)=='object'){login=url} // login info provided as an object
				else if(typeof(url)=='string'){login.url=url} // url provided as a string
				else{ // might it exist in the URL
					var u = document.location.search.match(/url=([^&]+)/);
					if(!!u){login.url=u[1]}
				}
				var div = jmat.div(id);div.className=id;
				var id_url = id+'_url', id_key = id+'_key';
				div.innerHTML='S3DB Login:<br>URL: <input id="'+id_url+'">';
				ip_url=ip(id_url,'type or paste deployment URL, then press Enter');
				// Key Check
				var key_try = function(){ // assumes login.key
					jmat.s3db.call(login.url+'/URI.php?key='+login.key,
						function(x){
							var ip_key = jmat.gId(id_key);
							if(!!x[0].error_code){ // invalid key
								ip_key.style.color='red';
								ip_key.value+=' (invalid key, try again)';
								ip_key.onclick=function(){ip_key.value=login.key;ip_key.onclick=null};
								ip_key.onkeyup=function(ev){if(ev.keyCode==13){login.key=ip_key.value;key_try(login.key)}};
								//
							}
							else{ // Credentials accepted, store them
								jmat.s3db.info.login=login;
								jmat.s3db.info.uid=x[0];
								ip_key.style.color='green';
								jmat.rEl(id,3000); // remove login div in 10 secs
								var durl=document.location.href.replace(/url=[^&]+/,'').replace(/key=[^&]+/,'').replace(/[&]+/,'&').replace(/\?&/,'?');
								if(!durl.match(/\?/)){durl+='?'};
								if(!durl.match(/&/)){durl+='&'};
								durl+='url='+login.url+'&key='+login.key;
								jQuery('<br> Direct Link: <a href="'+durl+'">'+durl+'</a>').appendTo(div);
								if(!!cb){cb()}; // CALLBACK IS HERE ! //
								//console.log(x)
								}
						},
						function(x){throw(x)} // this shouldn't happen :-O
					)
				}
				// getKey button
				var getKey = function(){ // use uname and pwd to generate a 24hr key from apilogin.php
					var bt= this;
					jQuery('<span> User name: <input type=text id="'+id+'_uname"> Password: <input type=password id="'+id+'_password"></span>').appendTo(this.parentNode);
					
					this.onclick=function(){ // call api key engine
						jmat.s3db.call(login.url+'/apilogin.php?username='+jmat.gId(id+'_uname').value+'&password='+jmat.gId(id+'_password').value,
						function(x){
							var k = x[0].key_id;login.key=k;
							jmat.gId(id+'_key').value=k;
							key_try(k);
						},
						function(x){console.log(x)})
					}
					//jmat.gId(id+'_password').onclick=this.onclick;
					jmat.gId(id+'_uname').onkeyup=function(ev){
						if(ev.keyCode==13){jmat.gId(id+'_password').focus()};
					}
					jmat.gId(id+'_password').onkeyup=function(ev){
						if(ev.keyCode==13){bt.click()};
					}
				};
				// URL check
				var url_try = function(url){
					ip_url.value=login.url;
					ip_url.onclick=null;
					jmat.s3db.call(login.url+'/S3QL.php',
					function(x){ // URL is good, move on to check key
						ip_url.style.color='green';
						// but only if it's not there already
						if(!jmat.gId(id_key)){
							var id_getKey=id+'_getKey';
							jQuery('<br><a href="'+login.url+'/access_keys.php" target=_blank><b>Key</b></a>: <input id="'+id_key+'"><br><input id="'+id_getKey+'" type="button" value=">">').appendTo(div);
							var ip_key=ip(id_key,'type or paste session key, then press Enter');
							var ip_getKey=jmat.gId(id_getKey);
							ip_getKey.onclick=getKey;
							var u = document.location.search.match(/key=([^&]+)/);
							if(!!login.key){ip_key.value=login.key;key_try(login.key)}
							else if(!!u){login.key=u[1];ip_key.value=login.key;key_try(login.key)}
							else{ip_key.onkeyup=function(ev){if(ev.keyCode==13){login.key=ip_key.value;key_try(login.key)}}}
						}	
					},
					function(x){
						ip_url.value+=' (not found, try again)';
						ip_url.style.color='red';
						ip_url.onclick=function(){ip_url.value=login.url;ip.onclick=null};
						//ip_url.onclick=function(){jmat.s3db.UI.login(url,cb,id)};
						ip_url.size=60;
					}
					)
				}
				ip_url.onkeyup=function(ev){if(ev.keyCode==13){login.url=ip_url.value;url_try(login.url)}};
				// Start with URL
				if(!!login.url){url_try(ip_url.value)}
				//console.log(url,cb);
				return jmat.gId(id_url)
			}
		},
		
		tab:function(id,info){ // S3DB's tabulator
			// check that jquery and jquery.ui are loaded
			if(typeof(jQuery)=='undefined'){
				jmat.loadVar('jQueryUI',function(){jmat.s3db.UI.couch(id,info)});
			}
			else{
				if(typeof(jQuery.ui)=='undefined'){
					jmat.loadVar('jQueryUI',function(){jmat.s3db.UI.couch(id,info)});
				}
				else{ // jQuery UI is garanteede to be available so this is where the UI happens
					// check that the div id exists
					console.log(4);
					
					
				}				
			}
			
			
			if(!info){info=jmat.s3db.info} // current connection as default
			// create div id 
			
			//
		},

		wApp:function(id,url){
			$('<div id="'+id+'_s3dbLogin">').appendTo($('#'+id));// create login div
            var url = 'https://uab.s3db.org/s3db'
            jmat.s3db.UI.login(
                url,
                function(){
                    wApps.s3db=jmat.s3db.info;
                    console.log('s3db login successful :-)');
                    var html = '<h2>'+jmat.s3db.info.uid.uid+'</h2><p>'+jmat.s3db.info.uid.fullname+' ('+jmat.s3db.info.uid.email+'),<br> you successfully logged in with UID "'+jmat.s3db.info.uid.uid+'".';
                    $('<div>Logged in at '+url+': <p><smal><em>'+html+'</em></small></p>').appendTo($('#'+id));
                },
                id+'_s3dbLogin'
            )
		}
	}
},

save:function(varValue,varName){//save variable in the localHost, for example, save('NC_007019',seq)
	if(!varName){varName=this.uid()}
	localStorage.setItem(varName,varValue)
	return varName;
},

set:function(val,callback,key,url){ // set key-val pairs in the webrw endpoint, calback will have the key as its argument
	if (!callback){callback=function(x){console.log(x)}};
	if (typeof(val)!='string'){this.stringify(val)};
	if (!url){url=this.webrwUrl}
	if(!this.set.jobs){this.set.jobs=[]}
	var uid = this.uid();
	this.set.jobs[uid]={'fun':callback};
	var s=document.createElement('script');s.id=uid;
	if (!key){s.src=url+'?set='+val+'&callback=jmat.set.jobs.'+uid+'.fun'}
	else{s.src=url+'?set='+val+'&key='+key+'&callback=jmat.set.jobs.'+uid+'.fun'}
	document.body.appendChild(s);
	setTimeout('document.body.removeChild(document.getElementById("'+uid+'"));delete jmat.set.jobs.'+uid+';',10000);
	return uid;
},

shorten:function(x,n){ // shortens numbers or strings
	if (Array.isArray(x)){return x.map(function(xi){return jmat.shorten(xi,n)})}
	else {
		if(typeof(x)=='number'){x +=''}
		return x.slice(0,n);
	}
},

size:function(x){
	var L=function(y){
		s[s.length]=y.length;
		if(Array.isArray(y[0])){L(y[0])}
	}
	var s=[];L(x);
	return s;
},

sort:function(x){ // [y,I]=sort(x), where y is the sorted array and I contains the indexes
	x=x.map(function(xi,i){return [xi,i]});
	x.sort(function(a,b){return a[0]-b[0]});	
	return this.transpose(x)
},

sum:function(x){
	if(Array.isArray(x[0])){return x.map(function(xi){return jmat.sum(xi)})}
	else{return x.reduce(function(a,b){return a+b})};
},

str2num:function(x){
	return JSON.parse(x);
},

stringify:function(x){ // extends JSON.stringify to work with both values and functions
var y=typeof(x);
switch (y){
	case 'function':
	y=x.toString();
	break;		
	case 'object':
	if (Array.isArray(x)){
		var y='[';
		for(var i=0;i<x.length;i=i+1){
			y=y+this.stringify(x[i])+','
		}
		y=y.slice(0,y.length-1)+']';
	}
	else{
		y='{';
		for(var v in x){
			y=y+v+':'+this.stringify(x[v])+',';
		}
		y=y.slice(0,y.length-1)+'}';
	}
	break;
	case 'string':
	y=JSON.stringify(x);
	break;
	case 'number':
	y=JSON.stringify(x);
	default:
	}
return y;
},

text2table:function(txt){ // parse \n + \t text with col and row ids to a table structure
	txt = txt.split('\n'); // parse the rows 
	if(txt[txt.length-1].length==0){txt = txt.slice(0,txt.length-1)};
	txt = txt.map(function(txti){return txti.split('\t')}); //and then the columns
	var tb = {
		columns:txt[0],
		rows:txt.slice(1)
	};
	// check that all rows are filled
	var n = tb.columns.length;
	
	tb.rows = tb.rows.map(function(r){
		if(r.length<n){
			for(var i=r.length;i<n;i++){r.push(null)}
		}
		return r;
	});
	return tb
},

tableLookup:function(tbl,col_in,val_in,col_out){ // jmat.tableLookup is the same as jmat.lookup + making sure all columns are represented
	if(!col_in){col_in=tbl.columns[0]}; // if no column is specified use the first
	if(typeof(val_in)=="undefined"){val_in=".*"}; // get all 
	if(col_out==""){col_out=tbl.columns}; // in col_out is empty use all columns
	if(typeof(col_out)=="undefined"){col_out=col_in}; // if col_out is not provided use col_in
	var y = this.lookupExact(tbl,col_in,val_in,col_out); // <-- This is where it all happens !
	if(!Array.isArray(col_out)){col_out=[col_out]}; // make sure col_out is an array
	// match list of columns with col_out
	var n = tbl.rows.length, m = col_out.length, rt = this.transpose(tbl.rows);
	var cc = col_out.map(function(c,i){ // assemble values as columns
		var j = jmat.findExact(tbl.columns,c);
		if(j.length==1){
			var ci = rt[j[0]];
		}
		else if(j.length==0){
			var ci = jmat.arrayfun(jmat.ones(n),function(){return null}); // null values for a column not found
		}
		else {throw('there should have been not more than one match, instead '+j.length+' were found')}
		return ci
	})
	y.columns = col_out;
	y.rows = this.transpose(cc);
	return y;
},

tableUnion:function(tb1,tb2){ // union of two tables
	//
},

table2html:function(t){  // table, table id, target element id
	var h = '<table>';
	// header
	h += '<tr>';
	for(var j=0;j<t.columns.length;j++){h+='<th>'+t.columns[j]+'</th>'}
	h += '<tr>';
	// body
	for(var i=0;i<t.rows.length;i++){
		h+='<tr>';
		for(var j=0;j<t.columns.length;j++){h+='<td>'+t.rows[i][j]+'</td>'}
		h+='</tr>';
	}
	h +='</table>';
	return h
},

textread:function(url,cb){
	console.log('reading '+url+' ...');
	if(!cb){cb=function(x){console.log(x)}}
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onload = function () {
	    if (xhr.status === 200) {
			console.log('... done.');
	        cb(xhr.responseText);
	    } else {
	        console.error(xhr.status);
	    }
	};
	xhr.send(null);
	return xhr;
},

transpose:function (x){ // transposes 2D array
	if(!Array.isArray(x[0])){y=[x]}  // in case x is a 1D Array
	else{
		var y=[],n=x.length,m=x[0].length;
		for(var j=0;j<m;j++){
			y[j]=[];
			for(var i=0;i<n;i++){
				y[j][i]=x[i][j];
			}
		}
	}
	return y
},

threshold:function(im,thr){ // image segmentation by thresholding, returns binary image matrix
	if(!im.width){var dt=im}
	else{dt=this.imData2data(im)} // in case im is an imageData object 
	if(!thr){thr = jmat.max(jmat.catArray(dt))/2} // default threshold is 1/10 of maximum, write something better later
	return jmat.imMap(dt,function(xy){return (xy>thr)}); // threshold value, thr, is passed to the function through a closure
},

twitter:{
	calls:{},
	loadUser:function(uname,cb){ // load @uname, default callback is console.log
		var callId=jmat.uid();
		if(!cb){cb=function(x){console.log(x)}};
		this.calls[callId]=cb;
		//https://api.twitter.com/1/statuses/user_timeline.json?screen_name=divInformatics&include_entities=true&include_rts=true&callback=lala
		jmat.load('https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+uname+'&include_entities=true&include_rts=true&callback=jmat.twitter.calls.'+callId);
		return 'jmat.twitter.loadUser("'+uname+'",jmat.twitter.calls.'+callId+')';
	},
},

uid:function(prefix){
	if(!prefix){prefix='UID'}
	var uid=prefix+Math.random().toString().slice(2);
	return uid
},

unique:function(x){ // x is an Array
	var u = []; // store unique here
	u[0]=x[0];
	for (var i=1; i<x.length; i++){
		// check if x[i] is new
		if (u.map(function(ui){return ui===x[i]}).reduce(function(a,b){return a+b})==0){
			u[u.length]=x[i];
		}
	}
	return u
},

wait:function (t,V){ // horrible way to send time (in milliseconds) burning through CPU :-(
	if(!V){V=jmat.uid()}

	
	var startDate = new Date();
	var currDate = new Date();
	while (((currDate-startDate)<t)){
		currDate = new Date();
	}

	/*
	var startDate = new Date();
	var currDate = new Date();
	//var i = 0;
	while (((currDate-startDate)<t)){
		//i+=1;
		currDate = new Date();
		if()
	}


	/*
	var x = false;
	var f = function () {
		x = true;
	};
	setTimeout(f, t);
	while (x === false) {};
	*/

	return true;
},

zeros:function(){
	return jmat.dimfun(function(){return 0},arguments)
},

webrwUrl:'https://webrw.herokuapp.com',//http://165.225.128.64',

}