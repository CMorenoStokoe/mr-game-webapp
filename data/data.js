/* 

Database
---------------

Intended purpose of this script:
- This file contains the data model on which the simulation is based

Contents of this script:
- Data classes 
    A Pseudo data class is parent to child classes and provides them with basic data structure and operations 

*/


// Pseudo data class containing network MR data
class DataClass {

    constructor(nodes, edges) {

        // Add variables for node and edge lists
        this.nodeList = nodes;
        this.edgeList = edges;

        // Make lists easier to edit by making them searchable
        this.nodes = this.indexItems(nodes, 'id');
        this.edges = this.indexItems(edges, 'id');
    }

    // Index dictionary arrays (items) by key (key) to be searchable {item.id : item}
    indexItems(items, key, desiredProperty=null){
        var indexed = {}

        for (const item of items){

            /* TEMPORARY : Move to MiRANA: csv to json operation */
            // Make sure strings are safe
            if (typeof item[key] == 'string'){
                item[key] = safeStr(item[key]);
            } else {
                item[key] = 'e' + item[key];
                item.source = safeStr(item.source)
                item.target = safeStr(item.target)
            } //temp key cleaning

            function safeStr(str){
                return str.replace(/-/g, '_')
            }

            // If a desiredProperty is given then give {key : desired property}
            // This is used if only one property is desired (e.g., an index of ids : names)
            if(desiredProperty){indexed[item[key]] = item[desiredProperty];}

            // Else give {key : item}
            else{indexed[item[key]] = item;}
            
        };

        return indexed;
    }
}

// New class for extending DataClass with additional properties for graphing network MR
class GraphData extends DataClass {
    
    constructor(nodes, edges) {

        // Call constructor of parent class
        super(nodes, edges);

        // Add access point for nodes and edges in d3 graph format
        this.nodesAndEdges = {nodes : this.nodeList, edges : this.edgeList};
    }
}

class PropagationData extends DataClass {

    constructor(nodes, edges) {

        // Get nodes and edges from parent class
        super(nodes, edges);

        // Get current and initial values
        this.value = this.indexItems(nodes, 'id', 'prevalence');
        this.startValue = this.indexItems(nodes, 'id', 'prevalence');
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
        return (this.nodeList[0].id)
    }

    addLogEntry(entry){
        this.log.push(entry);
    }

}

/* Move to master file*/
// Add data in master file using classes from data.js

// Data data_json is contained in data_json.js
// Make main data objects used for game, as GameData pseudo data class from MR data
var data = new DataClass(data_json.nodes, data_json.edges);
var graph = new GraphData(data_json.nodes, data_json.edges);
var prop =  new PropagationData(data_json.nodes, data_json.edges);
var game =  new GameData(data_json.nodes, data_json.edges);

game.addLogEntry('example entry');

// Log data to console
//console.log(data);
//console.log(graph);
//console.log(prop);
//console.log(game);