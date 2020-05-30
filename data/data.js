/* 

Database
---------------

Intended purpose of this script:
- This file contains the database on which the simulation is based

Contents of this script:
- Data
    An objective JS data

*/


// Pseudo data class
class DataClass {

    constructor(nodes, edges) {
        // Get data variables
        this.nodes = nodes;
        this.edges = edges;
    }

    initNodes(){
        var values = {}

        for (const node of this.nodes){
            activations[node.id] = 0;
        };

        return activations;
    }

    

    initNodes(){
        var values = {}

        for (const node of this.nodes){
            activations[node.id] = 0;
        };

        return activations;

    }

}

class PropagationData extends DataClass {

    constructor(nodes, edges) {
        // Get nodes and edges from parent class
        super(nodes, edges);
        // Make propagation variables
        this.currentValues = this.initNodeActivation();
        this.minValues = this.initNodeActivation();
        this.maxValues = this.initNodeActivation();
    }

    getInitialValues(){
        var activations = {}

        for (const node of this.nodes){
            activations[node.id] = 0;
        };

        return activations;
        
    }

    initNodeActivation(){
        var activations = {}

        for (const node of this.nodes){
            activations[node.id] = 0;
        };

        return activations;
        
    }

    initNodeActivation(){
        var activations = {}

        for (const node of this.nodes){
            activations[node.id] = 0;
        };

        return activations;
        
    }
  
  }

class GameData extends DataClass {

    constructor(nodes, edges) {
        // Get nodes and edges from parent class
        super(nodes, edges);
        // Make game variables
        this.objective = this.setObjective();
        this.log = [];
    }

    setObjective(){
        for (const node of this.nodes){

            switch(node.id){

                case 'l1': 
                    return node.id;

                default: 
                    break;
            }
        };
    }

    addLogEntry(entry){
        this.log.push(entry);
    }

}

// Data 
var data_json = {
    nodes : [
        {
            id : 'l1', // Id of node
            label : 'depression', // Label to display on graph
            name : 'depression score', // Full name
            prevalence : 3, // Prevalence in real-world units
            units : 'score', // Units of prevalence measurement
            activation : 1, // Activation level relative to start (1 = start, 0.5 = 50% decrease from start)
        },
        {
            id : 'l2',
            label : 'sleep',
            name : 'sleep per day',
            prevalence : 3,
            units : 'hours',
            activation : 1,
        },
        {
            id : 'l3',
            label : 'exercise',
            name : 'days exercise moderately',
            prevalence : 3,
            units : 'days',
            activation : 1,
        },
    ],
  
    edges : [
        {
          id : 1,
          source : 'l1',
          target : 'l3',
          b : 1,
        },
        {
          id : 2,
          source : 'l2',
          target : 'l1',
          b : -1,
        },
    ],
  }

// Make main data object used for game, as GameData pseudo data class
var data = new DataClass(data_json.nodes, data_json.edges);
var graph = new PropagationData(data_json.nodes, data_json.edges);
var game =  new GameData(data_json.nodes, data_json.edges);

game.addLogEntry('example entry');

console.log(data);
console.log(graph);
console.log(game);