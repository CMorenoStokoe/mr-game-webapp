/*

Graph settings
==============
Description:
This page contains settings for the graph:
- Function to easily create settings buttons
- Function to toggle state of true/false settings

Use:
The main script can use functions in this page to easily create buttons for controlling settings.

*/

/* Toggle settings function */
function toggleSetting(setting){
	switch(setting){
		case true:
			return(false);
		case false:
			return(true);
	}
}

/* Build buttons to change settings */

// Identify and make groups of buttons for options
function createOptions(options, optionPanelId){
	var groupCount = 1; // Count number of options groups for IDs

	for(const optionGroup of options){
			
		// Wrap group in div
		var div = document.createElement("DIV");
			div.id = `settGroup-div-${groupCount}`;
			div.innerHTML = `<p><strong>${optionGroup.groupTitle}</strong></p><hr>`;
			div.className = 'col-md';
		document.getElementById(optionPanelId).appendChild(div);
		
		// Create buttons for this option group and append in this div
		createOptionBtns(optionGroup.buttons, div.id);
		
		groupCount++; // Increment group count for IDs
	}

}

// Create buttons for options
var btnCount = 1; // Count number of buttons for IDs
function createOptionBtns(options, parentId){
	
	// Create options forms for each setting option
	for(const option of options){

		// Create appropriate button for each settings option
		switch(option.type){
			case 'checkbox':
				createCheckbox(option, parentId, btnCount);
				break;
			case 'radio':
				createRadio(option, parentId, btnCount)
				break;
			case 'textForm':
				createTextForm(option, parentId, btnCount);
				break;
		}
		btnCount++; // Increment button count
	}
}

// Function to create checkbox buttons 
function createCheckbox(option, parentId, btnCount){
	const name = option.name;
	const funct = option.funct;
	const checked = option.default;

	// Create input button
	var btn = document.createElement("INPUT");
		btn.id = `sett-btn-${btnCount}`;
		btn.setAttribute("type", 'checkbox');
		btn.className = 'm-1 settings-btns'; // Spacing
		btn.onclick = funct;
		btn.checked = checked;
	
	// Create label for button
	var label = document.createElement("Label");
		label.htmlFor = btn.id;
		label.innerHTML= name;
		label.className = 'm-1 settings-labels'; // Spacing
	
	// Wrap in div
	var div = document.createElement("DIV");
		div.id = `sett-div-${btnCount}`;
	
	// Append to DOM
	document.getElementById(parentId).appendChild(div);
	document.getElementById(div.id).appendChild(btn);
	document.getElementById(div.id).appendChild(label);	
}

// Function to create text form 
function createTextForm(option, parentId, btnCount){
	const name = option.name;
	const funct = option.funct;
	const defaultValue = option.default;
	const size = option.size;

	// Create input button
	var btn = document.createElement("INPUT");
		btn.id = `sett-btn-${btnCount}`;
		btn.setAttribute("type", 'text');
		btn.className = 'm-1 settings-btns'; // Spacing
		btn.onchange = funct;
		btn.value = defaultValue;
		btn.size = size;
	
	// Create label for button
	var label = document.createElement("Label");
		label.htmlFor = btn.id;
		label.innerHTML= name;
		label.className = 'm-1 settings-labels'; // Spacing
	
	// Wrap in div
	var div = document.createElement("DIV");
		div.id = `sett-div-${btnCount}`;
	
	// Append to DOM
	document.getElementById(parentId).appendChild(div);
	document.getElementById(div.id).appendChild(label);	
	document.getElementById(div.id).appendChild(btn);
}


// Function to create radio buttons 
function createRadio(option, parentId, btnCount){
	const name = option.name;
	const funct = option.funct;
	const checked = option.default;

	// Create input button
	var btn = document.createElement("INPUT");
		btn.id = `sett-btn-${btnCount}`;
		btn.setAttribute("type", 'radio');
		btn.className = 'm-1 settings-btns'; // Spacing
		btn.onclick = funct;
		btn.value = option.value;
		btn.checked = checked;
		btn.name = option.group;
	
	// Create label for button
	var label = document.createElement("Label");
		label.htmlFor = btn.id;
		label.innerHTML= name;
		label.className = 'm-1 settings-labels'; // Spacing
	
	// Wrap in div
	var div = document.createElement("DIV");
		div.id = `sett-div-${btnCount}`;
	
	// Append to DOM
	document.getElementById(parentId).appendChild(div);
	document.getElementById(div.id).appendChild(btn);
	document.getElementById(div.id).appendChild(label);	
}
