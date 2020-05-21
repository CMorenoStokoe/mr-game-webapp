/* 

Database
---------------

Intended purpose of this script:
- This file contains the database on which the simulation is based

Contents of this script:
- Data
    An objective JS data

*/

const data = {
    nodes : [
        {
            id : 'l1',
            short_name : 'depression',
            name : 'depression score',
            acivation : 3,
            units : 'score',
        },
        {
            id : 'l2',
            short_name : 'sleep',
            name : 'sleep per day',
            acivation : 3,
            units : 'hours',
        },
        {
            id : 'l3',
            short_name : 'exercise',
            name : 'days exercise moderately',
            acivation : 3,
            units : 'days',
        },
    ],
  
    links : [
        {
          "id" : 1,
          "source" : 'l1',
          "target" : 'l3',
          "source_name" : 'fdgfdg',
          "target_name" : 'gfdgfd',
          "method" : 'ivw',
          "nsnp" : 299,
          "b" : 1,
          "se" : 0.5,
          "pval" : 0.5,
          "color" : 'blue',
          "dash" : 'No',
        },
        {
          "id" : 2,
          "source" : 'l2',
          "target" : 'l1',
          "source_name" : 'fdgfdg',
          "target_name" : 'gfdgfd',
          "method" : 'ivw',
          "nsnp" : 299,
          "b" : -1,
          "se" : 0.5,
          "pval" : 0.5,
          "color" : 'red',
          "dash" : 'No',
        },
    ],
  
    gameVars : {
        activePolicies : [],
    },
  }