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
class GameData {

    constructor(nodes, edges) {
        // Data variables
        this.nodes = nodes;
        this.edges = edges;
        this.policies = this.initialisePolicies();
        // Game variables
        this.objective = this.setObjective();
        this.activePolicies = [];
    }


    initialisePolicies(){
        const policyList = []

        for (const node of this.nodes){
            policyList.push(
                node
            )
        };

        return policyList;
    }


    setObjective(){
        
        for (const node of this.nodes){

            switch(node.id){

                case 'l1': 
                    return node;

                default: 
                    break;
            }
        };
    }
}

// Data 
var data_json = {
    nodes : [
        {
            id : 'l1',
            label : 'depression',
            name : 'depression score',
            prevalence : 3,
            units : 'score',
        },
        {
            id : 'l2',
            label : 'sleep',
            name : 'sleep per day',
            prevalence : 3,
            units : 'hours',
        },
        {
            id : 'l3',
            label : 'exercise',
            name : 'days exercise moderately',
            prevalence : 3,
            units : 'days',
        },
    ],
  
    links : [
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
var data = new GameData(data_json.nodes, data_json.links);