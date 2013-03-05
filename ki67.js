console.log('KI67 module');

(function(){
	imagejs.msg('Ki67 module loaded.'); // to notify via console and div#msg
	var id = 'ki67';
	imagejs.modules[id]={ // register module
		alignImage:function(){
			//var sz=jmat.size(imagejs.data.img);
			//cvBase.width=sz[1];
			//cvBase.height=sz[0];
			//cvTop.width=cvBase.width;
			//cvTop.height=cvBase.height;
			cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop;
		},
		showImage:function(){
			if(!imagejs.modules.chromomarkers){ // checking for segmentation using chromomarkers
				jmat.imwrite(cvBase,imagejs.data.img)
			}else{
				if(!imagejs.modules.chromomarkers.red){jmat.imwrite(cvBase,imagejs.data.img)}
				else{
					var R = imagejs.modules.chromomarkers.red/100;
					var G = imagejs.modules.chromomarkers.green/100;
					var B = imagejs.modules.chromomarkers.blue/100;
					jmat.imwrite(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return [y[0]*R,y[1]*G,y[2]*B,255]})}))
				}
			}
			imagejs.msg('<span style="color:navy">Imgage weighted by chromomarkers channel modulation (if any).</span>');
		},
		showRed:function(){jmat.imwrite(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return [y[0],0,0,255]})}))},
		showGreen:function(){jmat.imwrite(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return [0,y[1],0,255]})}))},
		showBlue:function(){jmat.imwrite(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return [0,0,y[2],255]})}))},
		mapRed:function(){jmat.imagesc(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return y[0]})}));imagejs.msg('<span style="color:navy">Red channel heatmap</span>');},
		mapGreen:function(){jmat.imagesc(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return y[1]})}));imagejs.msg('<span style="color:navy">Green channel heatmap</span>');},
		mapBlue:function(){jmat.imagesc(cvBase,imagejs.data.img.map(function(x){return x.map(function(y){return y[2]})}));imagejs.msg('<span style="color:navy">Blue channel heatmap</span>');},
		density:function(){ // calculate density
			//imagejs.msg('buiding density distributions');
			imagejs.data.RG = jmat.zeros(256,256);
			imagejs.data.img.map(function(x){x.map(function(y){imagejs.data.RG[y[0]][y[1]]++})});
			imagejs.data.RB = jmat.zeros(256,256);
			imagejs.data.img.map(function(x){x.map(function(y){imagejs.data.RB[y[0]][y[2]]++})});
			imagejs.data.GB = jmat.zeros(256,256);
			imagejs.data.img.map(function(x){x.map(function(y){imagejs.data.GB[y[1]][y[2]]++})});
		},
		showDensity:function(){ // display density
			if(!imagejs.data.RG){imagejs.modules[id].density()};
			if($('#densityTable').length==0){ // create table
				$('<table id=densityTable><tr><td id="densityRG">RG</td><td id="densityRB">RB</td><td id="densityGB">GB</td></tr></table>').appendTo('#menu');
				$('#densityRG').append(imagejs.modules[id].cvDensity(imagejs.data.RG));
				$('#densityRB').append(imagejs.modules[id].cvDensity(imagejs.data.RB));
				$('#densityGB').append(imagejs.modules[id].cvDensity(imagejs.data.GB));
				imagejs.modules[id].showTable=true;
			}
			else{
				if(imagejs.modules[id].showTable){
					imagejs.modules[id].showTable=false;
				}
			}
			imagejs.msg('<span style="color:navy">pixel density distributions.</span>');
		},
		cvDensity:function(M){// create density plot for square matrix M
			var sz = jmat.size(M);
			M = jmat.arrayfun(M,function(x){return Math.log(x+1)});
			var cv = $('<canvas with='+sz[0]+' height='+sz[1]+'></canvas>');
			jmat.imagesc(cv[0],M);
			return cv[0];
		},
		trueRecolor:function(){//replace each channel by the difference with the other two
			if(!imagejs.modules[id].trueImg){
				imagejs.modules[id].resetImg();
				imagejs.modules[id].trueImg=imagejs.data.img; // move original image to a safe place
				imagejs.data.img=imagejs.data.img.map(function(x){return x.map(function(y){return [y[0]*2-y[1]-y[2],y[1]*2-y[0]-y[2],y[3]*2-y[0]-y[1],255]})})
				imagejs.data.img=imagejs.data.img.map(function(x){return x.map(function(y){
					if(y[0]<0){y[0]=0};if(y[1]<0){y[1]=0};if(y[2]<0){y[2]=0};
					if(y[0]>255){y[0]=255};if(y[1]>255){y[1]=255};if(y[2]>255){y[2]=255};
					return y
				})})
			}
			else{
				imagejs.data.img=imagejs.modules[id].trueImg;
				delete imagejs.modules[id].trueImg;
			}
			jmat.imwrite(cvBase,imagejs.data.img);
			imagejs.msg('<span style="color:navy">Recoloring done.</span>');
		},
		invertColor:function(){//replace each channel by the difference with the other two
			if(!imagejs.modules[id].invImg){
				imagejs.modules[id].resetImg();
				imagejs.modules[id].invImg=imagejs.data.img; // move original image to a safe place
				imagejs.data.img=imagejs.data.img.map(function(x){return x.map(function(y){return [255-y[0],255-y[1],255-y[2],255]})})
			}
			else{
				imagejs.data.img=imagejs.modules[id].invImg;
				delete imagejs.modules[id].invImg;
			}
			jmat.imwrite(cvBase,imagejs.data.img);
			imagejs.msg('<span style="color:navy">Inverting colors done.</span>');
		},
		nucleiColor:function(){//replace each channel by the difference with the other two
			if(!imagejs.modules[id].trueImg){
				imagejs.modules[id].resetImg();
				imagejs.modules[id].trueImg=imagejs.data.img; // move original image to a safe place
				imagejs.data.img=imagejs.data.img.map(function(x){return x.map(function(y){return [y[0],y[0]+y[2],y[3],255]})}); // under development
				imagejs.data.img=imagejs.data.img.map(function(x){return x.map(function(y){
					if(y[0]<0){y[0]=0};if(y[1]<0){y[1]=0};if(y[2]<0){y[2]=0};
					if(y[0]>255){y[0]=255};if(y[1]>255){y[1]=255};if(y[2]>255){y[2]=255};
					return y
				})})
			}
			else{
				imagejs.data.img=imagejs.modules[id].trueImg;
				delete imagejs.modules[id].trueImg;
			}
			imagejs.modules[id].invertColor(); // under development
			imagejs.modules[id].trueRecolor(); // under development
			imagejs.msg('<span style="color:navy">Recoloring done.</span>');
			//jmat.imwrite(cvBase,imagejs.data.img);
		},
		originalImage:function(){ // reset to original image
			imagejs.modules[id].resetImg();
			imagejs.data.img=imagejs.modules[id].origImg;
			jmat.imwrite(cvBase,imagejs.data.img);
			imagejs.msg('<span style="color:navy">Original image.</span>');
		},
		resetImg:function(){
			if(!imagejs.modules[id].origImg){imagejs.modules[id].origImg=imagejs.data.img}; // to preserve original
			if(!!imagejs.modules[id].trueImg){delete imagejs.modules[id].trueImg};
			if(!!imagejs.modules[id].invImg){delete imagejs.modules[id].invImg};
			if(!!imagejs.modules[id].ki67Img){delete imagejs.modules[id].ki67Img};
		},
		capturePositive:function(){ // capture segmentation as ki67 labeled nuclei
			imagejs.data.segKI67positive=imagejs.data.seg;
			imagejs.msg('Segmentation captured as KI67 positive')
		},
		captureNuclei:function(){ // capture segmentation as ki67 labeled nuclei
			imagejs.data.segNuclei=imagejs.data.seg.map(function(x){return x.map(function(y){if(y==0){return 1}else{return 0}})}); // inverted segmentation
			imagejs.msg('Segmentation captured as all nuclei, KI67 positive or not')
		},
		showKI67:function(){ // display both segmentations and calculate proliferation index
			imagejs.modules[id].originalImage(); // display cvBase with original image
			imagejs.msg('> ');
			if(!imagejs.data.segKI67positive){imagejs.msg($('#msg').html()+'<span style="color:red"> positive KI67 segmentation missing </span>')};
			if(!imagejs.data.segNuclei){imagejs.msg($('#msg').html()+'> <span style="color:red"> nuclei segmentation missing </span>')};
			imagejs.data.segNuclei=imagejs.data.segNuclei.map(function(x,i){return x.map(function(y,j){if(imagejs.data.segKI67positive[i][j]==1){return 1}else{return y}})}); // take the union of the two segmentations
			var edgPositive = jmat.edge(imagejs.data.segKI67positive);
			var edgNuclei = jmat.edge(imagejs.data.segNuclei);
			var edgs = edgNuclei.map(function(x){return x.map(function(y){if(y==1){return [0,0,255,255]}else{return [0,0,0,0]}})}); // nuclei outlined blue on transparent
			edgs = edgs.map(function(x,i){return x.map(function(y,j){if(edgPositive[i][j]==1){return [255,0,0,255]}else{return y}})}); // ki67 positive outlined in red
			jmat.imwrite(cvTop,edgs);
			var all = jmat.sum(jmat.sum(imagejs.data.segNuclei));
			var ki67 = jmat.sum(jmat.sum(imagejs.data.segKI67positive));
			var sz = jmat.size(imagejs.data.seg);
			imagejs.msg(imagejs.data.fname+': proliferation =  <span style="color:red">'+Math.round(10000*ki67/(sz[0]*sz[1]))/100+'%</span> / <span style="color:blue">'+Math.round(10000*all/(sz[0]*sz[1]))/100+'%</span> = '+Math.round(100*ki67/all)/100);
			//jmat.imagebw(cvTop,edg,[0,0,0,0],[255,255,0,255]); // display edge
		}
	}
	var menu={
		'Help':function(){imagejs.msg('See <a href="http://www.youtube.com/watch?v=NCPNgRxWWDQ" target="blank">SCREENCAST</a> of capture a) segmented in positive ki67 nuclei and b) segmented out all nuclei.<br> See also <a href="https://sites.google.com/a/mathbiol.org/doc/imagejs/ki67" target="blank"> WIKI</a> for more information and calibration data. [<a href="https://code.google.com/p/imagejs/source/browse/ki67.js?repo=module" target="blank">Source code</a>, <a href="https://code.google.com/p/imagejs/source/list?repo=module" target="blank">Change log</a>].')},
		'Original Image':function(){imagejs.modules[id].originalImage()},
		'Invert Colors':function(){imagejs.msg('<span style="color:red">Inverting colors, please wait ...</span>');setTimeout(imagejs.modules[id].invertColor,100)},
		'True recolor':function(){imagejs.msg('<span style="color:red">Recoloring, please wait ...</span>');setTimeout(imagejs.modules[id].trueRecolor,100)},
		'Nuclei recolor':function(){imagejs.msg('<span style="color:red">Recoloring, please wait ...</span>');setTimeout(imagejs.modules[id].nucleiColor,100)},
		'Weighted image':function(){imagejs.modules[id].showImage()},
		'Capture KI67 positive':function(){imagejs.modules[id].capturePositive()},
		'Capture all nuclei (inverted)':function(){imagejs.modules[id].captureNuclei()},
		'Calculate proliferation':function(){imagejs.msg('<span style="color:red">Calculating proliferation, please wait ...</span>');setTimeout(imagejs.modules[id].showKI67,100)},
		'channel Red':function(){imagejs.modules[id].showRed()},
		'channel Green':function(){imagejs.modules[id].showGreen()},
		'channel Blue':function(){imagejs.modules[id].showBlue()},
		'Align segmentation':function(){imagejs.modules[id].alignImage()},
		'--- Comp Intensive ---':function(){imagejs.msg('Operations below this one are computationally intensive and may take some time, i.e. be patient')},
		'Density distributions':function(){imagejs.msg('<span style="color:red">Calculating RG, RB and GB density distributions, please wait ...</span>');setTimeout(imagejs.modules.ki67.showDensity,100)},
		'Red heatmap':function(){imagejs.msg('<span style="color:red">Calculating red channel heatmap, please wait ...</span>');setTimeout(imagejs.modules[id].mapRed,100)},
		'Green heatmap':function(){imagejs.msg('<span style="color:red">Calculating green channel heatmap, please wait ...</span>');setTimeout(imagejs.modules[id].mapGreen,100)},
		'Blue heatmap':function(){imagejs.msg('<span style="color:red">Calculating blue channel heatmap, please wait ...</span>');setTimeout(imagejs.modules[id].mapBlue,100)},
		
	}
	var name= 'KI67';
	jmat.gId('menu').appendChild(imagejs.menu(menu,name));
	
	
})()
