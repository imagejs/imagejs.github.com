// Main Menu functions
// This is also a good template for writing imagejs modules.
// The main thing is to keep your code within a function call and not generate global variables.
// use instead imagejs.modules[yourModule] to store parameters and functions.

imagejs.msg('hello world v0.1 loaded.'); // to notify via console and div#msg

(function(){
	var menu={
		Hello:function(){jmat.gId('msg').textContent+=' Hello'},
		World:function(){jmat.gId('msg').textContent+=' World !'}
	}
	var name= 'Hello World v0.1';
	jmat.gId('menu').appendChild(imagejs.menu(menu,name)); 
})()