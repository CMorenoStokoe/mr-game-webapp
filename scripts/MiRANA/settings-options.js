/*

Options
=======
Description:
This file contains options for the visualisation.

Use:
The main file uses this collection of options to populate buttons using methods from settings-btn-builder.

*/

// List of options {label on btn:, function to run:, type of btn:,}
const options = [ 
    {
        groupTitle: 'Edges',
        buttons:[
            { 
                name: 'Color: -ve', 
                funct: function(){settings.links.colNeg=this.value;},
                type: 'textForm',
                default: 'blue',
                size: 8,
            },
            { 
                name: 'Color: +ve', 
                funct: function(){settings.links.colPos=this.value;},
                type: 'textForm',
                default: 'red',
                size: 8,
            },
            { 
                name: 'Scale line width by beta', 
                funct: function(){
                    settings.links.scaleToBeta.method = 'none'; 
                    settings.links.width = 2},
                type: 'checkbox',
                default: true,  
            },
            { 
                name: 'Edge opacity', 
                funct: function(){settings.links.opacity=this.value;},
                type: 'textForm',
                default: '100%',
                size: 4,
            },
            { 
                name: 'Show estimates from:', 
                funct: function(){settings.data.mrMethods=this.value;},
                type: 'textForm',
                default: 'all methods',
                size: 20,
            },
            { 
                name: 'Causal data', 
                funct: function(){settings.data.observational = this.value},
                type: 'radio',
                default: true,
                value: 'Causal data',
                group: 'Data',
            },
            { 
                name: 'Observational data*', 
                funct: function(){settings.data.observational = this.value},
                type: 'radio',
                default: false,
                value: 'Observational data',
                group: 'Data',
            },
            { 
                name: 'Alternative view for bi-directional links', 
                funct: function(){
                    settings.links.bidirectional.enabled = !(settings.data.observational);
                    settings.links.multiEdges.enabled = !(settings.data.observational);
                },
                type: 'checkbox',
                default: true,  
            },
        ]
    },
    {
        groupTitle: 'Labels',
        buttons:[
            { 
                name: 'Font', 
                funct: function(){settings.nodes.labels.font=this.value;},
                type: 'textForm',
                default: 'Rubik, sans-serif',
                size: 15,
            },
            { 
                name: 'Display names', 
                funct: function(){
                    settings.nodes.labels.enabled = true;
                    settings.nodes.labels.content=d => d[this.value];
                    settings.nodes.icons.enabled = false;},
                type: 'radio',
                default: true,
                value: 'label',
                group: 'Trait labels',
            },
            { 
                name: 'Display IDs', 
                funct: function(){
                    settings.nodes.labels.enabled = true;
                    settings.nodes.labels.content=d => d[this.value];
                    settings.nodes.icons.enabled = false;},
                type: 'radio',
                default: false,
                value: 'id',
                group: 'Trait labels',
            },
            { 
                name: 'Display Icons*', 
                funct: function(){
                    settings.nodes.labels.enabled = false;
                    settings.nodes.icons.enabled = true; },
                type: 'radio',
                default: false,
                value: 'icon',
                group: 'Trait labels',
            },
            { 
                name: 'Labels to right', 
                funct: function(){settings.nodes.labels.posX = 16; settings.nodes.labels.anchor = 'none';},
                type: 'radio',
                default: true,
                value: 'label',
                group: 'Label placement',
            },
            { 
                name: 'Labels in middle', 
                funct: function(){settings.nodes.labels.posX = 0; settings.nodes.labels.anchor = 'middle';},
                type: 'radio',
                default: false,
                value: 'id',
                group: 'Label placement',
            },
            { 
                name: 'Better names: Rename traits', 
                funct: function(){settings.data.cleaning.enabled = toggleSetting(settings.data.cleaning.enabled);console.log(settings.data.cleaning.enabled)},
                type: 'checkbox',
                default: true,
            },
        ]
    },
    {
        groupTitle: 'Nodes',
        buttons:[
            { 
                name: 'Fill color', 
                funct: function(){settings.nodes.fill=this.value;},
                type: 'textForm',
                default: 'white',
                size: 8,
            },
            { 
                name: 'Outline color', 
                funct: function(){settings.nodes.strokeColor=this.value;},
                type: 'textForm',
                default: 'black',
                size: 8,
            },
            { 
                name: 'Node opacity', 
                funct: function(){settings.nodes.opacity=this.value;},
                type: 'textForm',
                default: '100%',
                size: 4,
            },
            { 
                name: 'Color from CSV*', 
                funct: function(){settings.nodes.fillFromCSV = true; settings.nodes.fill = d => d.color;},
                type: 'checkbox',
                default: false,  
            },
        ]
    }
]

/*

// Full data cleaning options
removeHyphens: true, // Data cleaning, removes hyphens from IDs
removeMRBaseId: true, // Remove MR base ID from name (e.g., default R output name)
removeCategory: true, // Remove identified categories following structure typical for UKB variables (cat:name)
shorten: true, // Shorten names if over n chars

*/