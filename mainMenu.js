//Main Menu functions
// This is also a good template for writing imagejs modules.
// The main thing is to keep your code within a function call and not generate global variables.
// use instead imagejs.modules[yourModule].

imagejs.msg('mainMenu loaded'); // to notify via console and div#msg

function handleDownloadImage(ev) {
    ev.preventDefault();
    document.getElementById('cvBase').getContext('2d').drawImage(document.getElementById('cvTop'),0,0);
    imagejs.canvas2Blob('cvBase', function (blob) {
        saveAs(blob, 'image.png');
    }); //Get updated base canvas
}

function handleJSONDownload(){
    var jsonText = JSON.stringify(imagejs.data);
    var compressedText = LZW.compress(jsonText); 

    var bb = new WebKitBlobBuilder();
    bb.append(compressedText);
    var b = bb.getBlob('application/zip');
    var oURL = (window.URL || window.webkitURL);
    oURL = oURL.createObjectURL(b);
    document.getElementById('jdButton').href = oURL;
}


function handleJSONDownload2(){
	var imageURI = imagejs.data.orig;
	var seperatorString = "ZZZZZZZ"
    var segText = JSON.stringify(imagejs.data.seg);
	var compressedSegText = LZW.compress(segText);
	var text = imageURI + seperatorString + compressedSegText;

    var bb = new WebKitBlobBuilder();
    bb.append(text);
    var b = bb.getBlob('application/text');
    var oURL = (window.URL || window.webkitURL);
    oURL = oURL.createObjectURL(b);
    document.getElementById('jdButton').href = oURL;
}
 

(function(){
    var listOfModules={
        'Hello world':function(evt){imagejs.loadModule('http://imagejs.googlecode.com/git/helloWorld.js')},
        'Chromomarkers':function(evt){imagejs.loadModule('http://module.imagejs.googlecode.com/git/mathbiol.chromomarkers.js')},
        'Count Shapes':function(evt){imagejs.loadModules(['http://module.imagejs.googlecode.com/git/mathbiol.chromomarkers.js','http://module.imagejs.googlecode.com/git/mathbiol.countshapes.js'])}           
    }

    var menu={
        Load:function(){
            console.log('Load Module');
            var msg=jmat.gId('msg'); // message div
            msg.innerHTML='Load module from <span id=listOfModules></span> or from URL:<input type=text size=50 onkeyup="if(event.keyCode==13)(imagejs.loadModule(this.value))">';
            jmat.gId('listOfModules').appendChild(imagejs.menu(listOfModules,'List'));
            cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop; // make sure the two canvas are aligned
        },
        Save:function(){
            console.log('Save Results');
        }
    }
   

    var name= 'Main Menu';
    jmat.gId('menu').appendChild(imagejs.menu(menu,name)); // <-- this
    cvTop.style.left=cvBase.offsetLeft;cvTop.style.top=cvBase.offsetTop; // make sure the two canvas are aligned
    // --------------
   

    var a = document.createElement('a');
    document.body.appendChild(a);
    a.id = "dButton";
    a.href="";
    a.textContent="Download Image";
    a.addEventListener('click', handleDownloadImage, false);

    document.body.appendChild(document.createElement('br'))
   
    var b = document.createElement('a');
    document.body.appendChild(b);
    b.id = "jdButton";
    b.href="";
    b.download="file.txt";
    b.textContent="Download File";
    b.addEventListener('click', handleJSONDownload2, false);
   
})()

var LZW = {
                compress: function (uncompressed) {
                    "use strict";
                    // Build the dictionary.
                    var i,
                        dictionary = {},
                        c,
                        wc,
                        w = "",
                        result = [],
                        dictSize = 256;
                    for (i = 0; i < 256; i += 1) {
                        dictionary[String.fromCharCode(i)] = i;
                    }
             
                    for (i = 0; i < uncompressed.length; i += 1) {
                       
                        c = uncompressed.charAt(i);
                        wc = w + c;
                        if (dictionary[wc]) {
                            w = wc;
                        } else {
                            result.push(dictionary[w]);
                            // Add wc to the dictionary.
                            dictionary[wc] = dictSize++;
                            w = String(c);
                        }
                    }
             
                    // Output the code for w.
                    if (w !== "") {
                        result.push(dictionary[w]);
                    }
                    return result;
                },
             
             
                decompress: function (compressed) {
                    "use strict";
                    // Build the dictionary.
                    var i,
                        dictionary = [],
                        w,
                        result,
                        k,
                        entry = "",
                        dictSize = 256;
                    for (i = 0; i < 256; i += 1) {
                        dictionary[i] = String.fromCharCode(i);
                    }
             
                    w = String.fromCharCode(compressed[0]);
                    result = w;
                    for (i = 1; i < compressed.length; i += 1) {
                        k = compressed[i];
                        if (dictionary[k]) {
                            entry = dictionary[k];
                        } else {
                            if (k === dictSize) {
                                entry = w + w.charAt(0);
                            } else {
                                return null;
                            }
                        }
             
                        result += entry;
             
                        // Add w+entry[0] to the dictionary.
                        dictionary[dictSize++] = w + entry.charAt(0);
             
                        w = entry;
                    }
                    return result;
                }
            }
