console.log('imagejs loaded');
// prepare canvas
//jmat.gId('cvBase').style.border='solid 1px';


// Load imagejs
imagejs={

	readImage:function(f){ // read image file
		f=f.item(0); // assuming there is only one file
		reader = new FileReader();
		reader.onload=function(x){ // loading image into canvasx
			//canvas toturial at http://www.html5canvastutorials.com/tutorials/html5-canvas-element/	
			var cv=jmat.gId('cvBase');
			var ctx=cv.getContext('2d');
			var im = new Image();
			im.onload=function(){ctx.drawImage(this,0,0)} // to make sure drawing only happens after loading
			im.src=x.target.result; // the stringified image
		};
		reader.readAsDataURL(f);
	}

}