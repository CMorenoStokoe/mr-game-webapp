/*

Menu
====
Description:
This script creates and executes functionality for the player menu.

Use:
The main view script will call this script in order to create the 
player menu for options and gameplay screens. Relies on the audio 
script.

*/

// Track whether menu has already been generated
var menuGenerated = false;

// Create menu
function createMenu(){
    if(menuGenerated){return}

    // Create menu div
    createDiv(id='menu', parent='body', className='menu');

    // Create menu buttons

        // Create elements
        createButton('menu-settings-btn', `<i class="fas fa-cogs"></i>`, 'menu', 'btn btn-lg btn-custom m-1');

        // Assign function to buttons
        $(`#menu-settings-btn`).click(function(){$(`#menu-settings`).modal('show')});
        
    // Create menu items

        // Create settings
        createModal('menu-settings', 'modals', title='Settings', body=``, className='modal');
        
            // Volume

                // Create volume slider
                var div = document.createElement('DIV');
                var volumeLabel = document.createElement('LABEL'); // Label
                    volumeLabel.for = 'volume-slider';
                    volumeLabel.innerHTML = '<i class="fas fa-volume-up"></i> Volume';
                    volumeLabel.className = 'p-3';
                var volumeSlider = document.createElement('INPUT'); // Slider
                    volumeSlider.type = 'range';
                    volumeSlider.min = '0';
                    volumeSlider.max = '100';
                    volumeSlider.value = '30';
                    volumeSlider.className = 'slider';
                    volumeSlider.id = 'volume-slider';
                
                // Append volume to DOM
                document.getElementById('menu-settings-body').appendChild(div);
                    div.appendChild(volumeLabel);
                    div.appendChild(volumeSlider);
                
                // Add volume change functionality
                addVolumeSlider();

            /* Color blind
            
                // Create toggle
                var div = document.createElement('DIV');
                var volumeLabel = document.createElement('LABEL'); // Label
                    volumeLabel.for = 'menu-settings-colorBlindness';
                    volumeLabel.innerHTML = `Colorblind mode <br> <span class='text-muted'>Purple/Green replaces Red/Green</span>`;
                    volumeLabel.className = 'p-3';
                var btn = document.createElement("INPUT");
                    btn.id = `menu-settings-colorBlindness`;
                    btn.setAttribute("type", 'checkbox');
                    btn.className = 'm-1';
                    btn.onchange = function(){
                        if(this.value){ // If enabled
                            settings.nodes.colorSchemeForInterpolation = function(value){return d3.interpolatePRGn(value)}
                        } else {
                            settings.nodes.colorSchemeForInterpolation = function(value){return d3.interpolateRdYlGn(value)}
                        }
                    };
                    btn.value = false;
                    btn.checked = false;
                    btn.name = 'colorBlindness';           

                // Append toggles to DOM
                document.getElementById('menu-settings-body').appendChild(div);
                    div.appendChild(volumeLabel);
                    div.appendChild(btn);
                
                */

    // Record menu as generated
    menuGenerated = true;
}

/* Cut features

    // Create buttons
    createButton('menu-map-btn', `Star map <i class="fas fa-globe-africa"></i>`, 'menu', 'btn btn-lg btn-custom m-1');
    createButton('menu-log-btn', `Log <i class="fas fa-book"></i>`, 'menu', 'btn btn-lg btn-custom m-1');
    
    $(`#menu-map-btn`).click(function(){$(`#menu-map`).modal('show')});
    $(`#menu-log-btn`).click(function(){$(`#menu-log`).modal('show')});

    
    // Create map
    createModal('menu-map', 'modals', title='Map', body='');
    // init from map.js

    // Create log
    createModal('menu-log', 'modals', title='Log', body='');
    initLog();
    
    notify(title='title', body='body', width = '600px', position = {x:'45vw', y:'45vh'}, contextIndicator = 'arrow-up')
    
*/