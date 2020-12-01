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

        // Help
        // Create elements
        createButton('menu-help-btn', `Help`, 'menu', 'btn btn-lg btn-custom m-1');

        // Assign function to buttons
        $(`#menu-help-btn`).click(function(){$(`#menu-help`).modal('show')});

        // Settings
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
                var volumeTitle = document.createElement('H5');
                    volumeTitle.innerHTML = 'Volume';
                    volumeTitle.className = 'p-2 m-2 w-100 d-flex';
                var volumeLabel = document.createElement('LABEL'); // Label
                    volumeLabel.for = 'volume-slider';
                    volumeLabel.innerHTML = '<i class="fas fa-volume-up"></i> Volume';
                    volumeLabel.className = 'p-3';
                var volumeSlider = document.createElement('INPUT'); // Slider
                    volumeSlider.type = 'range';
                    volumeSlider.min = '0';
                    volumeSlider.max = '100';
                    volumeSlider.value = '10';
                    volumeSlider.className = 'slider';
                    volumeSlider.id = 'volume-slider';
                
                // Append volume to DOM
                document.getElementById('menu-settings-body').appendChild(div);
                    div.appendChild(volumeTitle)
                    div.appendChild(volumeLabel);
                    div.appendChild(volumeSlider);
                
                // Add volume change functionality
                addVolumeSlider();


            /* View the tutorial again
                var tutorialDiv = document.createElement('DIV');
                tutorialDiv.className = 'p-2 m-2 w-100 d-flex flex-column';
                document.getElementById('menu-settings-body').appendChild(tutorialDiv);
                
                var tutorialTitle = document.createElement('H5');
                    tutorialTitle.innerHTML = 'Controls';
                    tutorialTitle.className = 'p-2 m-2 w-100 d-flex';
                tutorialDiv.appendChild(tutorialTitle);

                var tutorialLabel = document.createElement('P');
                    tutorialLabel.innerHTML='If you forget the controls or want a refresher click the button below to rewatch the tutorial.';
                tutorialDiv.appendChild(tutorialLabel);

                var tutorialBtn = document.createElement('BUTTON');
                    tutorialBtn.onclick = function(){tutorial('game');};
                    tutorialBtn.innerText = 'Rewatch tutorial';
                    tutorialBtn.className = 'btn btn-lg btn-custom';
                tutorialDiv.appendChild(tutorialBtn);*/

            // Force reset
                var resetDiv = document.createElement('DIV');
                    resetDiv.className = 'p-2 m-2 w-100 d-flex flex-column';
                document.getElementById('menu-settings-body').appendChild(resetDiv);
                
                var resetTitle = document.createElement('H5');
                    resetTitle.innerHTML = 'Force reset';
                    resetTitle.className = 'p-2 m-2 w-100 d-flex';
                resetDiv.appendChild(resetTitle);

                var resetLabel = document.createElement('P');
                    resetLabel.innerHTML='If you run into issues with the game try force-resetting it with the button below.';
                resetDiv.appendChild(resetLabel);

                var resetBtn = document.createElement('BUTTON');
                    resetBtn.onclick = function(){gamestates[gameState].action()};
                    resetBtn.innerText = 'Force reset game';
                    resetBtn.className = 'btn btn-lg btn-custom';
                resetDiv.appendChild(resetBtn);

            
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