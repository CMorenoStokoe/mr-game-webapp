/*

Node info
=====
Description: This file contains information associated with each node in the game.

Use: This file is called by the model script to assign icons and prevalence to nodes
which are then used by the graph script to display icons.

*/

const icons = {
    'ieu_a_1187': 'depression', //Depression, 
    'ukb_b_6519': 'anxiety', //Worry, 
    'ieu_a_1018': 'wellbeing', //Wellbeing, 
    'ukb_b_8476': 'loneliness', //Loneliness, 
    'ukb_b_3957': 'sleep_insomnia', //Sleeplessness, 
    'ukb_d_SLEEP': 'sleep_insomnia', //ICD10 Insomni, 
    'ukb_b_4062': 'wellbeing', //Happiness, 
    'ieu_a_118': 'ocd', //Neuroticism, 
    'ukb_b_5779': 'drinking', //Alcohol, 
    'ieu_a_1239': 'education', //Education, 
    'ukb_b_19953': 'bmi', //BMI, 
    'ukb_b_5238': 'intelligence', //Intelligence, 
    'ukb_b_4956': 'eveningness', //Eveningness, 
    'ukb_b_5076': 'notSocial1', //Not socialising, 
    'ieu_a_961': 'smoking', //Smoking, 
    'ukb_b_4710': 'exercise', //Exercise, 
    'ukb_b_5237': 'caffeine', //Coffee intake, 
    'ieu_a_7': 'chd', //CHD, 
    'ukb_b_4424': 'sleep', //Sleep duration, 
    'ieu_a_24': 'diabetes', //Diabetes
}

const nodeValues = {
    'ukb_b_4424': {'prevalence': 7.15, 'min': 1, 'max': 23, 'units':'Hrs/d'},
    'ukb_b_4956': {'prevalence': 2.19, 'min': 1, 'max': 4, 'units':'Category'},
    'ukb_d_SLEEP': {'prevalence': 0.022, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_4062': {'prevalence': 4.95, 'min': 1, 'max': 6, 'units':'Category'},
    'ieu_a_1187': {'prevalence': 0.04, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_6519': {'prevalence': 0.75, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_5779': {'prevalence': 3.56, 'min': 1, 'max': 6, 'units':'Category'},
    'ieu_a_961': {'prevalence': 0.018, 'min': 0, 'max': 145, 'units':'Cigs/day'},
    'ieu_a_1239': {'prevalence': 16.8, 'min': 4.4, 'max': 29.4, 'units':'Years'},
    'ukb_b_19953': {'prevalence': 27, 'min': 10, 'max': 70, 'units':'Units'},
    'ukb_b_5238': {'prevalence': 6, 'min': 0, 'max': 13, 'units':'Test score'},
    'ukb_b_8476': {'prevalence': 0.18, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_4710': {'prevalence': 3.66, 'min': 0, 'max': 7, 'units':'Days/wk'},
    'ukb_b_5076': {'prevalence': 0.25, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ieu_a_118': {'prevalence': 1.482, 'min': 0, 'max': 3, 'units':'Arbitrary score'},
    'ukb_b_5237': {'prevalence': 2.1377, 'min': 0, 'max': 5, 'units':'Cups/wk'},
    'ieu_a_24': {'prevalence': 0.056, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ieu_a_7': {'prevalence': 0.014, 'min': 0, 'max': 1, 'units':'Odds(%)'},
    'ieu_a_1018': {'prevalence': 1, 'min': 0, 'max': 2, 'units':'SD score'},
    'ukb_b_3957': {'prevalence': 2.05, 'min': 1, 'max': 3, 'units':'Category'},
}

const isGood = {
    'ieu_a_1187': false, //Depression, 
    'ukb_b_6519': false, //Worry, 
    'ieu_a_1018': true, //Wellbeing, 
    'ukb_b_8476': false, //Loneliness, 
    'ukb_b_3957': false, //Sleeplessness, 
    'ukb_d_SLEEP': false, //ICD10 Insomni, 
    'ukb_b_4062': true, //Happiness, 
    'ieu_a_118': false, //Neuroticism, 
    'ukb_b_5779': false, //Alcohol, 
    'ieu_a_1239': true, //Education, 
    'ukb_b_19953': false, //BMI, 
    'ukb_b_5238': true, //Intelligence, 
    'ukb_b_4956': false, //Eveningness, 
    'ukb_b_5076': false, //Not socialising, 
    'ieu_a_961': false, //Smoking, 
    'ukb_b_4710': true, //Exercise, 
    'ukb_b_5237': false, //Coffee intake, 
    'ieu_a_7': false, //CHD, 
    'ukb_b_4424': true, //Sleep duration, 
    'ieu_a_24': false, //Diabetes
}