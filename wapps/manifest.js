// This document, manifest.js, is the only file a wApps repository needs to maintain.
// it includes four sections: 1) Branding, 2) Tabs, 3) Apps, and 4) Authors


// 1) BRANDING - the icon and link in the upper left corner
wApps.manifest.brand={
    pic:'https://wapps.googlecode.com/git/brandMathBiol.png',
    url:'https://github.com/wApps/manifest#wapps-all-you-need-is-a-manifest'
};

// 2) TABS - the navigation tabs in the head of wApps. 
//    The code manage "myApps", "Store" and "People",
//    the rest is up to you.
wApps.manifest.tabs={
    "myApps":{
        html:'Apps you selected from the AppStore ...',
        Div:{} // where the DOM element will be set later 
    },
    "Store":{
        html:'Retrieving list of Apps from the manifest ...',
        Div:{}
    },
    "People":{
        html:'Retrieving list of people authoring Apps ...',
        Div:{}
    },
    "About":{
        html:'<h1>wApps</h1>This is an experiment in loosening the architecture of a webApp store to achieve a deeper integration between autonomously developed components.',
        Div:{}
    }
};

// 3) APPS - the description of the applications 
wApps.manifest.apps.push(
    {
    "name": "QMachine",
    "description": "QMachine volunteer",
    "url": "http://v1.qmachine.org",
    "author":"Sean Wilkinson",
    "namespace":'QM',
    buildUI:function(id){
        this.require('', // script needed to volunteer compute cycles to QM
            function(){
                $('#'+id).html("<p>Sean, it may make sense to have a local volunteer such that other wApps can also use qmachine: it could be used as the HPC engine :-)</p><iframe width=100% height=500 src='https://v1.qmachine.org/'/>");
            });
        }
    },

    {
    "name": "Login@ S3DB.UAB",
    "description": "<p>Very simple login into UAB's S3DB cloud deployment using jmat's toolbox.<br> The login credentials will be stored at wApps.s3db.info.",
    "url": "https://code.google.com/p/jmat/", // home page of App
    "author":"Jonas Almeida",
    "namespace":'jmat',
    buildUI:function(id){
        this.require('https://jmat.googlecode.com/git/jmat.js', //'http://localhost:8888/jmat/jmat.js',
            function(){jmat.s3db.UI.wApp(id,'https://uab.s3db.org/s3db')}
            );
        }
    },

    {
    "name": "TCGA toolbox",
    "description": "VAlex's TCGA Toolbox in a iframe",
    "url": "https://code.google.com/p/jmat/", // home page of App
    "author":"Alexander Gruneberg",
    "namespace":'TCGA',
    buildUI:function(id){
        this.require('', // script needed to volunteer compute cycles to QM
            function(){
                $('#'+id).html('<p>Unlike QMachine, it may make sense to keep this one in a iframe</p><iframe width=100% height=800 src="http://tcga.github.com" seamless="seamless" />');
            });
        }
    },

    {
    "name": "Kinomics toolbox",
    "description": "Kinomics toolbox under development",
    "url": "http://adussaq.github.com/kinomicDataQC/",
    "author":"Alex Dussaq",
    "namespace":'QM',
    buildUI:function(id){
        this.require('', // script needed to volunteer compute cycles to QM
            function(){
                $('#'+id).html("<p>Unlike QMachine, it may make sense to keep this one in a iframe</p><iframe width=100% height=500 src='http://adussaq.github.com/kinomicDataQC'/>");
            });
        }
    },

    {
    "name": "MinervaJS",
    "description": "Weaving JavaScript modules like a goddess",
    "url": "http://minervajs.org/",
    "author":"David Robbins",
    "namespace":'minerva',
    buildUI:function(id){
        this.require('', // script needed to volunteer compute cycles to QM
            function(){
                $('#'+id).html("<p>I really like the user management and social networking via DISCUS here</p><iframe width=100% height=500 seamless='seamless' src='http://minervajs.org'/>");
            });
        }
    },

    {
    "name": "ET callHome",
    "description": "a little coding on the manifest can go a long way.",
    "url": "https://code.google.com/p/jmat/", // home page of App
    "author":"Jonas Almeida",
    "namespace":'jmat',
    buildUI:function(id){
        this.require('https://jmat.googlecode.com/git/jmat.js', //'http://localhost:8888/jmat/jmat.js',
            function(){
                $('<div id="plotHere">').appendTo($('#'+id).html(''));
                jmat.plot("plotHere",jmat.rand(100),jmat.rand(100));
                var bt = $('<button>').html('call home').appendTo($('#'+id));
                bt.click(function(){jmat.plot("plotHere",jmat.rand(100),jmat.rand(100))});      
            }
        )}
    },

    {
    "name": "someWApp",
    "description": "Some wApp one of you links here",
    "url": "http://uab.mathbiol.org/workshop",
    "author":"Some Author",
    "namespace":'Some_wAapp',
    buildUI:function(id){
        this.require('', // script to load your code 
            function(){
                $('#'+id).html("<h1>Some wApp</h1>Some Application you developped and want to wApp here");
            });
        }
    }
);

// 4) AUTHORS - description of the authors, matching the names in the Apps,
//              where they can be described as a string or, when there is
//              a team of authors, as an Array of strings .
wApps.manifest.authors.push(
    {
    "name":"Jonas Almeida",
    "url":"http://jonasalmeida.info"
    },

    {
    "name":"David Robbins",
    "url":"https://sites.google.com/a/mathbiol.org/robbinsd/"
    },

    {
    "name":"Sean Wilkinson",
    "url":"mailto:wilkinson@uab.edu"
    },

    {
    "name":"Alexander Gruneberg",
    "url":"https://sites.google.com/a/mathbiol.org/agrueneberg/"
    },

    {
    "name":"Alex Dussaq",
    "url":"mailto:adussaq@uab.edu"
    },

    {
    "name":"Some Author",
    "url":"http://someUrl.com"
    }
);

