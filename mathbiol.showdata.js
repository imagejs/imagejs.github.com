// example of a module that does something and leaes no trace behind
// in this example we'll display graphically the contents of imagejs.data

(function(){
	if(jQuery('#cvTop').length==0){
		cvTop=document.createElement('canvas');
		cvTop.style.position='absolute';
		cvTop.id='cvTop';
		jmat.gId('work').appendChild(cvTop);
	}
	// fix size
	var sz=jmat.size(imagejs.data.img);
	cvBase.width=sz[1];
	cvBase.height=sz[0];
	cvTop.width=cvBase.width;
	cvTop.height=cvBase.height;
	cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop;
	jmat.imwrite(cvBase,imagejs.data.img); // write image
	jmat.imagebw(cvTop,jmat.edge(imagejs.data.seg),[0,0,0,0],[255,255,0,255]); // display edge
})()
