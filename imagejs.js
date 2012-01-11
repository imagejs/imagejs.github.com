console.log('imagejs loaded');
// prepare canvas
//jmat.gId('cvBase').style.border='solid 1px';
//<script src="http://localhost:8888/jmat/jmat.js"></script>
//<script src="http://jmat.googlecode.com/git/jmat.js"></script>

// Load imagejs
imagejs={

readImage:function(f){ // read image file
	f=f.item(0); // assuming there is only one file
	jmat.gId('msg').textContent='loading '+f.name+' ... ';
	reader = new FileReader();
	reader.onload=function(x){ // loading image 
		//canvas tutorial at http://www.html5canvastutorials.com/tutorials/html5-canvas-element/	
		var im = new Image();
		im.onload=function(){
			var cvBase=document.createElement('canvas');
			cvBase.id='cvBase';
			var div = jmat.gId('work');div.innerHTML=''; // workspace div
			div.appendChild(cvBase);
			cvBase.width=this.width;cvBase.height=this.height; //size canvas to the image
			var ctx=cvBase.getContext('2d');
			ctx.drawImage(this,0,0);
			imagejs.data.dt0=jmat.imread(cvBase);
			//imagejs.data.dt0=JSON.stringify(jmat.imread(cv)); //.slice(); // remeber that .slice() clones
			jmat.gId('msg').textContent+='done';
			imagejs.loadModule('mainMenu.js');
			// create overlay canvas
			var cvTop=document.createElement('canvas');
			cvTop.id='cvTop';
			cvTop.width=cvBase.width;
			cvTop.height=cvBase.height;
			cvTop.style.position='absolute';
			cvTop.style.cursor='crosshair';
			cvBase.style.cursor='crosshair';
			cvTop.style.left=cvBase.offsetLeft;
			//cvTop.style.top=cvBase.offsetTop;
			jmat.gId('work').appendChild(cvTop);		
		} // to make sure drawing only happens after loading
		im.src=x.target.result; // the stringified image
	};
	reader.readAsDataURL(f);
},

keepTop:function(){//size and move cvTop to be on top of cvBase
	var cvBase=jmat.gId('cvBase');
	var cvTop=jmat.gId('cvTop');
	cvTop.width=cvBase.width;
	cvTop.height=cvBase.height;
	cvTop.style.left=cvBase.offsetLeft;
	cvTop.style.top=cvBase.offsetTop;
},

msg:function(x){ // passing a message to the message div, also copied to the console
	jmat.gId('msg').innerHTML=x;
	console.log(x);
},

loadModule:function(url){
	if(!this.modules[url]){ // load only in not there already
		this.modules[url]={}; // register loading from this url
		jmat.load(url);
		this.msg('loading '+url);
	}
	else{this.msg('module @ '+url+' already loaded')}
	
},

menu:function(x,id){
	// process a menu structure
	var f = jmat.fieldnames(x);
	if(!jmat.gId('menu '+id)){var sel = jmat.cEl('select','menu '+id)} // create if it doesn't exist
	else{jmat.gId('menu '+id)=jmat.gId('menu '+id).splice(0,0)} // else clear SELECT options
	//jmat.gId('menu').appendChild(sel);
	var opt = jmat.cEl('option','option '+id);opt.textContent=id; // menu name at the top
	sel.appendChild(opt);
	var ff=jmat.fieldnames(x);
	for(var i=0;i<ff.length;i++){
		var opt = jmat.cEl('option','option '+ff[i]);opt.textContent=ff[i];
		opt.value=i+1;
		opt.onclick=x[ff[i]];
		sel.appendChild(opt);
	}
	sel.onchange=function(evt){
		//jmat.gId('menu Main Menu')[jmat.gId('menu Main Menu').value].onclick.call(evt);
		this[this.value].onclick.call(evt); // do it
		this.selectedIndex=0; // go back to top of the list
		}
	return sel;
},

modules:{
	// This is a good place to store module functions.
	// Note in loadModule that loading a module automatically creates an attribute named with its URL
	// You don't have to, but you could use this object, imagejs.modules[url]={}, if you wanted to.
},

data:{
	// a good place to keep data that multiple modules may need
	// for example, loading an image will automatically create imagejs.data.dt0 with the output of jmat.imread('work')
},

start:function(){ // things that should happen when the page loads
	// load module provided as a search term, if at all
	var url = document.location.search;
	if (url.length>1){imagejs.loadModule(url.slice(1))}
}

};

