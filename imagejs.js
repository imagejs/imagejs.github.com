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
			var cv=document.createElement('canvas');
			cv.id='cvBase';
			var div = jmat.gId('wkspace');div.innerHTML=''; // workspace div
			div.appendChild(cv);
			cv.width=this.width;cv.height=this.height; //size canvas to the image
			var ctx=cv.getContext('2d');
			ctx.drawImage(this,0,0);
			imagejs.dt0=jmat.imread(cv);
			jmat.gId('msg').textContent+='done';
			imagejs.loadModule('mainMenu.js');
		} // to make sure drawing only happens after loading
		im.src=x.target.result; // the stringified image
	};
	reader.readAsDataURL(f);
},

msg:function(x){ // passing a message to the message div, also copied to the console
	$('#msg').html(x);
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

floatDiv:{
	create:function(){
		var div = document.createElement('div');
		div.id='mainMenu';
		$(div).addClass("floatingDiv")
		div.style.width=150;
		//div.style.height=100;
		div.style.border='1px solid red';
		div.style.backgroundColor='white';
		div.style.opacity=0.5;
		div.style.position='absolute';
		//div.style.dragable='true';
		//div.style.top=50;
		//div.style.left=20;
		div.innerHTML='<table id="floatyTable"><tr ><td style="background-color:red">[o]</td><td>Main menu</td></tr><tr><td></td><td>4</td></tr></table>';
		document.body.appendChild(div);
		this.div=div; // anchor div here while it is moving
		this.move();
		//onmousemove=this.startMove;
		//onclick=this.endMove;
		return div;
	},
	move:function(ev){
		onmousemove=function(ev){
			//console.log(ev.offsetX,ev.offsetY);
			imagejs.floatDiv.div.style.top=parseInt(ev.offsetY)+5;
			imagejs.floatDiv.div.style.left=parseInt(ev.offsetX)-5;
		}
		onclick=function(ev){
			console.log('end move');
			onmousemove=null;
			onclick=null;
		}	
	}
	
}


}