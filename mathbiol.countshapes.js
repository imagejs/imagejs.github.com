// ImageJS module to filter shapes
console.log('countshapes library loaded');
// write module as a function call to avoid messing global scope

(function(){
	
	
	var id='countshapes'; // name of the modules attribute where module-specific stuff will be stored
	imagejs.modules[id]={ // this way all that pertains to the inner workings of this module stays in this branch
		UID:{}, // casheing results being saved remotely
		buttonUID:function(that){
			// create UID so GUI doesn't have to wait
			var divId=that.parentElement.id;
			var input=jQuery('#'+divId+' #inputUID')[0];
			this.webrwURL='http://165.225.128.64/';
			input.style.color='red';
			//input.value=uid;
			that.style.visibility='hidden';
			if(input.value.length>0){ // this is about retrieving an image
				// find out if this image is in cache or needs to be retrieved
				$('#'+divId+' #UIDmsg').html('processing, please wait ...');
				jmat.load(this.webrwURL+'?doc='+input.value,function(){
					$('#'+divId+' #UIDmsg').html('');
					input.style.color='green';
					// find out if cvTop is there
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
					jmat.imwrite(cvBase,imagejs.data.img); // write image
					//cvTop=jQuery('#cvTop')[0];
					cvTop.width=cvBase.width;
					cvTop.height=cvBase.height;
					cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop;
					jmat.imagebw(cvTop,jmat.edge(imagejs.data.seg),[0,0,0,0],[255,255,0,255]); // display edge
				});
			}
			else{ // store image
				var uid = jmat.uid(); // uid assigned to this data + analysis
				imagejs.data.url=this.webURL+'?get='+uid;
				var input = jQuery('#'+divId+' #inputUID')[0];
				input.value=uid;
				$('#'+divId+' #UIDmsg').html('processing, please wait ...')
				//console.log('compression started');
				//var w = new Worker('compressWorker.js');
				//w.onmessage=function(event){
				//	console.log('compressed by Worker ...');
				//	jQuery.post('http://165.225.128.64/?set=blob&key='+uid,'imagejs.data=jmat.decompress(['+event.data+'])',function(){input.style.color='green'})}
				//}
				setTimeout("(function(){input = jQuery('#"+divId+" #inputUID')[0];jQuery.post('http://165.225.128.64/?set=blob&key="+uid+"','imagejs.data=jmat.decompress(['+jmat.compress(imagejs.data)+'])',function(){input.style.color='green';$('#"+divId+" #UIDmsg').html('')})})()",500);
				}
				//w.postMessage(imagejs.data);
		},
		New:function(){
			var divCountShapes=this.createCountDiv();
			imagejs.modules[id].currentDivId=divCountShapes.id;// current count div
			imagejs.modules[id][divCountShapes.id]={}; // save count results here
			this.segmentationStats(divCountShapes.id); // action
			this.alignCanvas();
		},
		end:function(){
			
		},
		alignCanvas:function(){
			if($('#cvTop').length>0){
				cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop // make sure the two canvas are aligned
			}
		},
		createCountDiv:function(){
			var divCountShapes=$('<div>')[0];
			divCountShapes.id=jmat.uid('divCountShapes');
			//divCountShapes.style.width=200;
			$(divCountShapes).addClass("ui-widget-content");
			var H='';
			// First line, file name and close button
			H+='<button style="color:red" onclick="this.parentElement.parentElement.removeChild(this.parentElement);imagejs.modules.'+id+'.alignCanvas()">[x]</button>';
			H+=' File :<span class="countShapesFile" style="color:blue"></span>';
			H+=' <button id=buttonUID onclick="imagejs.modules.'+id+'.buttonUID(this)">ID:</button><input id=inputUID size=30> <span id=UIDmsg style="color:red"></span>.<br>';
			// Second line, Segmentation Statistics
			H+='<button style="color:green" onclick="imagejs.modules.'+id+'.segmentationStats(\''+divCountShapes.id+'\')">Segmentation</button>';
			H+=' Density <span style="color:blue" class="countShapesDensity"> ... </span>';
			H+=' Intensity <span style="color:blue" class="countShapesIntensity"> ... </span>';
			H+=' .<br>';
			//H+='<table>';
			//H+='<tr><td>File:</td><td class="countShapesFile" style="color:blue">...</td><td>Density:</td><td class="countShapesDensity" style="color:blue">...</td></tr>';
			//H+='</table>';
			//H+='<tr><td>Circularity:</td><td class="countShapesCircularity">...</td></tr>';
			//H+='<tr><td>Intensity:</td><td class="countShapesIntensity">...</td></tr>';
			//H+='<tr><td>Density:</td><td class="countShapesDensity" style="color:blue">...</td></tr>';
			//H+='<table>';
			//H+='<tr><td><button onclick="imagejs.modules.'+id+'.featuresTable(\''+divCountShapes.id+'\')">Features</button> Number:</td><td class="countShapesFeatures" style="color:blue">...</td></tr>';
			//H+='</table>';
			H+='<button onclick="imagejs.modules.'+id+'.featuresStats(\''+divCountShapes.id+'\');imagejs.modules.'+id+'.segmentationStats(\''+divCountShapes.id+'\')" style="color:green">Features</button> Number: <span class="countShapesFeatures" style="color:blue">...</span>, Filters: <span id=filterShapes id=filterShapes style="color:blue"> ... </span>';
			divCountShapes.innerHTML = H;
			menu.appendChild(divCountShapes);
			// FILTERS
			imagejs.msg=function(x){console.log(x)};
			//imagejs.loadModule('http://module.imagejs.googlecode.com/git/mathbiol.filterShapes.js',function(){// callback function
			jmat.load('http://module.imagejs.googlecode.com/git/mathbiol.filterShapes.js',function(){// callback function
				$('#'+divCountShapes.id+' #filterShapes').html('');
				var F=jmat.fieldnames(imagejs.modules.filterShapes)
				for (var i=0;i<F.length;i++){
					$('#'+divCountShapes.id+' #filterShapes')[0].innerHTML+=' <button onclick="imagejs.modules.filterShapes.'+F[i]+'();jmat.imagebw(cvTop,jmat.edge(imagejs.data.seg),[0,0,0,0],[255,255,0,255]);">'+F[i]+'</button>';				
				}
				//$('#filterShapes_').attr('id','filterShapes')
			}
			)
			
			return divCountShapes;
		},
		segmentationStats:function(divId){
			console.log(divId);
			$('#'+divId+' .countShapesFile').html(imagejs.data.fname);
			imagejs.data.size=jmat.size(imagejs.data.seg);
			imagejs.data.n=jmat.prod(imagejs.data.size);
			imagejs.data.density = jmat.sum(jmat.sum(imagejs.data.seg))/imagejs.data.n;
			var d = imagejs.data.density*100+'';if(d.length>6){d=d.slice(0,6)};
			$('#'+divId+' .countShapesDensity').html(d + ' %');
			//imagejs.data.IrgbTotal=imagejs.data.img.map(function(x){
			//	return x.map(function(y){return y}).reduce(function(a,b){
			//		return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
			//		})
			//	}).reduce(function(a,b){
			//	return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
			//});
			//imagejs.data.IrgbTotal.map(function(x){return x/imagejs.data.n});
			imagejs.data.IrgbSeg=imagejs.data.img.map(function(x,i){
				return x.map(function(y,j){
						if (imagejs.data.seg[i][j]>0){return y}
						else {return [0,0,0]}
					}).reduce(function(a,b){
					return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
					})
				}).reduce(function(a,b){
				return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
			});
			imagejs.data.IrgbNonSeg=imagejs.data.img.map(function(x,i){
				return x.map(function(y,j){
						if (imagejs.data.seg[i][j]>0){return [0,0,0]}
						else {return y}
					}).reduce(function(a,b){
					return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
					})
				}).reduce(function(a,b){
				return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
			});
			imagejs.data.IrgbSeg=imagejs.data.IrgbSeg.map(function(x){return x/(imagejs.data.n*imagejs.data.density)});
			imagejs.data.IrgbNonSeg=imagejs.data.IrgbNonSeg.map(function(x){return x/(imagejs.data.n*(1-imagejs.data.density))});
			$('#'+divId+' .countShapesIntensity').html('RGB = ['+jmat.shorten(imagejs.data.IrgbSeg,5)+'], vs background: ['+jmat.shorten(jmat.innerfun(imagejs.data.IrgbSeg,imagejs.data.IrgbNonSeg,function(a,b){return a/b}),5)+']');
			//imagejs.modules[id][divId].features = jmat.extractSegs(jmat.clone(jmat.edges(imagejs.data.seg)));
			//$('#'+divId+' .countShapesFeatures').html(imagejs.modules[id][divId].features.length);
		},
		featuresStats:function(divId){
			imagejs.data.segs = jmat.extractSegs(jmat.clone(imagejs.data.seg));
			$('#'+divId+' .countShapesFeatures').html(imagejs.data.segs.length);	
		}
		
	}
	
	// Assemble CountShapes menu
	var ShapesMenu={
		New:function(){
			//imagejs.msg('Counting started ...');
			console.log('Counting started ...');
			imagejs.modules[id].New();
			imagejs.modules[id].alignCanvas(); 
		},
		End:function(){
			imagejs.msg('');
			console.log('... counting ended.');
			imagejs.modules[id].end();
			imagejs.modules[id].alignCanvas();
		}
	}
	jmat.gId('menu').appendChild(imagejs.menu(ShapesMenu,'CountShapes')); //assemble menu
	
	//Miscelaneous
	$('#menu').onchange=function(){this.alignCanvas()};
	$('#msg').onchange=function(){this.alignCanvas()};
	
})()



