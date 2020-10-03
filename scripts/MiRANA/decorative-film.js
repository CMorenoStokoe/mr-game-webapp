/*

Clear film
==========
Description:
Contains a function to clear a grey film which is presented over the SVG.

Use:
This fills an otherwise blank white space. The Main script calls this function
to clear it when the SVG is drawn onto. Purely aesthetic.

*/

function clearDecorativeFilm(svgContainer, filmText, filmLogo){
    
    // Remove background from SVG container
    document.getElementById(svgContainer).style.background = 'none';

    // Remove box shadow from SVG container
    document.getElementById(svgContainer).style['-moz-box-shadow'] = 'none';
    document.getElementById(svgContainer).style['-webkit-box-shadow'] = 'none';
    document.getElementById(svgContainer).style['box-shadow'] = 'none';

    // Clear decorative film elements
    document.getElementById(filmText).style.display = 'none';
    document.getElementById(filmLogo).style.display = 'none';
        
}
