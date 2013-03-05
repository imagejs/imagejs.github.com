// ImageJS module to filter shapes
console.log('filtershapes library loaded');
// write module as a function call to avoid messing global scope

(function(){ // subsidiary module of mathbiol.countShapes 
	var id='filterShapes'; // name of the modules attribute where module-specific stuff will be stored
	imagejs.modules[id]={ // this way all that pertains to the inner workings of this module stays in this branch
		round:function(){
			var S = imagejs.data.seg;
			var z = jmat.size(imagejs.data.img);
			imagejs.data.seg=S.map(function(si,i){
				return si.map(function(pij,j){
					if((i*j>0)&(i<z[0]-1)&(j<z[1]-1)){
						if( (S[i][j]+S[i][j-1]+S[i][j+1]+S[i-1][j]+S[i-1][j-1]+S[i-1][j+1]+S[i+1][j]+S[i+1][j-1]+S[i+1][j+1])>4){return 1}else{return 0}
					}
					else{return 0} // Too lazy to wory about edges, be more industrius later
				})
			})
		},
		erode:function(){
			var S = imagejs.data.seg;
			var z = jmat.size(imagejs.data.img);
			imagejs.data.seg=S.map(function(si,i){
				return si.map(function(pij,j){
					if((i*j>0)&(i<z[0]-1)&(j<z[1]-1)){
						if( (S[i][j]+S[i][j-1]+S[i][j+1]+S[i-1][j]+S[i-1][j-1]+S[i-1][j+1]+S[i+1][j]+S[i+1][j-1]+S[i+1][j+1])>6){return 1}else{return 0}
					}
					else{return 0} // Too lazy to wory about edges, be more industrius later
				})
			})
		}
	}
})()



