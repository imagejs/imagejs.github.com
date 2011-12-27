// Main Menu functions
// This is also a good template for writing imagejs modules.
// The main thing is to keep your code within a function call and not generate global variables.
// use instead imagejs.modules[yourModule].

imagejs.msg('mainMenu loaded'); // to notify via console and div#msg

(function(){
	
	var listOfModules={
		'distance to line':function(evt){imagejs.loadModule('mainMenu.js')},
		'hello world':function(evt){imagejs.loadModule('helloWorld.js')},
		'morphomarkers':function(evt){imagejs.loadModule('http://morphomarkers.imagejs.googlecode.com/git/morphomarkers.js')}		
	}
	
	var menu={
		Load:function(){
			console.log('Load Module');
			var msg=jmat.gId('msg'); // message div
			msg.innerHTML='from select from <select><option>List</option><option>Morphomarkers</option><option>Morphomarkers</option><option>Morphomarkers</option><option>Distance to line</option></select> or from URL:<input type=text>';
			msg.innerHTML='from select from <span id=listOfModules></span> or from URL:<input type=text>';
			jmat.gId('listOfModules').appendChild(imagejs.menu(listOfModules,'List'));
		},
		Save:function(){
			console.log('Save Results');
		}
	}
	var name= 'Main Menu';
	jmat.gId('menu').appendChild(imagejs.menu(menu,name)); // <-- this 
	
	// --------------
	
	
	
})()