/*

Basic data structure
--------------------

Description:
The intended purpose of this script is to provide a basic
data structure for reference when designing the data input
structure and data model

*/




// Pseudo data class
{
    data : {
        nodes : {
            'nodeId1' : {
                id : ,
                name : ,
                label : ,
            },
            '...' : {},
        },
        edges : {
            'nodeId1' : {
                id : ,
                name : ,
                label : ,
            },
            '...' : {},
        }
    }

    graph extends data:{
        colors : {
            nodeScale : Green-Yellow-Blue_chromaticScale,
            negativeEdges : 'rgb(0, 0, 255)',
            positiveEdges : 'rgb(255, 0, 0)',
        }
    }

    propagation extends data:{
        
        nodes:{
            'nodeId1' : {
                valueNow : ,
                valueStart : ,
                valueMax : ,
                valueMin : ,
                units : ,
            },
            '...' : {},

    }

    game:
    this.objective = this.setObjective();
    this.log = [];
}
