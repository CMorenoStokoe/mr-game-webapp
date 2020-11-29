/*

Startup
=======
Configure start up

*/

// Startup vars
var developerMode = false;
var previewMode = false;
$('#legend').hide();
if(developerMode){
    setTimeout(function(){

        document.getElementById('GUI-planetInfo').style.opacity = 1;
    }, 1500)
}