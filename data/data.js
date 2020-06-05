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

        // Index nodes and edges by id for searchability
        this.nodes = this.indexItems(nodes, 'id');
        this.edges = this.indexItems(edges, 'id');

        // Add access point for edge lookup to identify edges from DFS output
        this.edgeLookup = this.indexEdgesByNodePairs(edges);
    }

    // Index dictionary arrays (items) by key (key) to be searchable {item.id : item}
    indexItems(items, key, desiredProperty=null){
        var indexed = {}

        for (const item of items){

            /* TEMPORARY : Move to MiRANA: csv to json operation */
            // Make sure node and edge ID strings are safe for use as index keys (e.g., in js numbers are not safe keys since edges[0] returns the first edge whereas edges[e0] correctly returns edge e0)
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

    // Create edge ID look up with [source, successor] node pairs as keys since this is the DFS output
    indexEdgesByNodePairs(){
        const lookup = {}

        // Index edges in edgeList by ID
        for (const edge of this.edges){
            lookup[[edge.source, edge.target]] = edge.id;
        }

        return(lookup);
    }
    
    // Export data as D3 node-edge dictionary
    toD3(){
        return {nodes : this.nodes, edges : this.edges};
    }

    // Export data as jsnx ebunch format 
    toJsnx(edges){
        
        const ebunch = []

        // Convert edges in edgeList into jsnx ebunch format
        for (const edge of this.edges){
            
            // Compile edge bunch for jsnx graphing ([source, target])
            ebunch.push([edge.source, edge.target]);
        }

        return(ebunch);
    }

    // Export data as list of data required for propagation MR
    toProp(){
        let output = [];

        for (const [ key, value ] of Object.entries(data.nodes)) {
            output.push({
                value,
            }
        }

        return output;
    }

}

// Class for variables used only by the game
class GameData extends DataClass {

    constructor(nodes, edges) {
        // Get nodes and edges from parent class
        super(nodes, edges);
        // Make game variables
        this.objective = this.setObjective();
        this.log = [];
    }

    setObjective(){
        return (this.nodes.ieu_a_1187);
    }

    addLogEntry(entry){
        this.log.push(entry);
    }

}