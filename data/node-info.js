/*

Node info
=====
Description: This file contains information associated with each node in the game.

Use: This file is called by the model script to assign icons and prevalence to nodes
which are then used by the graph script to display icons.

*/

const icons = {
    'ieu_a_1187': 'mh_depression2', //Depression, 
    'ukb_b_6519': 'mh_anxiety2', //Worry, 
    'ieu_a_1018': 'wellbeing2_alt', //Wellbeing, 
    'ukb_b_8476': 'social_loneliness', //Loneliness, 
    'ukb_b_3957': 'sleep_insomnia', //Sleeplessness, 
    'ukb_d_SLEEP': 'sleep_insomnia', //ICD10 Insomni, 
    'ukb_b_4062': 'wellbeing2_alt', //Happiness, 
    'ieu_a_118': 'mh_ocd2', //Neuroticism, 
    'ukb_b_5779': 'drinking', //Alcohol, 
    'ieu_a_1239': 'education_schoolYears', //Education, 
    'ukb_b_19953': 'bmi', //BMI, 
    'ukb_b_5238': 'intelligence', //Intelligence, 
    'ukb_b_4956': 'eveningness', //Eveningness, 
    'ukb_b_5076': 'social_chatBubble', //Not socialising, 
    'ieu_a_961': 'smoking', //Smoking, 
    'ukb_b_4710': 'exercise_bike', //Exercise, 
    'ukb_b_5237': 'caffeine', //Coffee intake, 
    'ieu_a_7': 'chd_alt', //CHD, 
    'ukb_b_4424': 'sleep', //Sleep duration, 
    'ieu_a_24': 'diabetes', //Diabetes
}

const nodeValues = {
    'ukb_b_8476': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_6519': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_5779': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_5238': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_5237': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_5076': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_4956': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_4710': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_3957': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ukb_b_19953': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ieu_a_961': {'prevalence': 0.018, 'min': 0, 'max': 35, 'units':'Cigs/day', 'SD':11.7},
    'ieu_a_7': {'prevalence': 0.014, 'min': 0, 'max': 1, 'units':'Odds (%)', 'SD':null},
    'ieu_a_24': {'prevalence': 0.056, 'min': 0, 'max': 1, 'units':'Odds (%)', 'SD':null},
    'ieu_a_1187': {'prevalence': 0.04, 'min': 0, 'max': 1, 'units':'Odds (%)', 'SD':null},
    'ieu_a_118': {'prevalence': 1.05, 'min': 0, 'max': 2.1, 'units':'Arbitrary score', 'SD':0.35},
    'ieu_a_1018': {'prevalence': 3, 'min': 0, 'max': 6, 'units':'SD', 'SD':1},
    'ieu_a_1239': {'prevalence': 16.8, 'min': 4.4, 'max': 28.4, 'units':'Years', 'SD':4.2},

    // Unused traits
    'ukb_b_4424': {'prevalence': 7.15, 'min': 1, 'max': 23, 'units':'Hrs/d', 'SD':1},
    'ukb_d_SLEEP': {'prevalence': 0.022, 'min': 0, 'max': 1, 'units':'Odds (%)', 'SD':1},
}

const isGood = {
    'ieu_a_1187': false, //Depression, 
    'ukb_b_6519': false, //Worry, 
    'ieu_a_1018': true, //Wellbeing, 
    'ukb_b_8476': false, //Loneliness, 
    'ukb_b_3957': false, //Sleeplessness, 
    //'ukb_d_SLEEP': false, //ICD10 Insomni, 
    //'ukb_b_4062': true, //Happiness, 
    'ieu_a_118': false, //Neuroticism, 
    'ukb_b_5779': false, //Alcohol, 
    'ieu_a_1239': true, //Education, 
    'ukb_b_19953': false, //BMI, 
    'ukb_b_5238': true, //Intelligence, 
    'ukb_b_4956': false, //Eveningness, 
    'ukb_b_5076': true, // Socialising, 
    'ieu_a_961': false, //Smoking, 
    'ukb_b_4710': true, //Exercise, 
    'ukb_b_5237': false, //Coffee intake, 
    'ieu_a_7': false, //CHD, 
    'ukb_b_4424': true, //Sleep duration, 
    'ieu_a_24': false, //Diabetes
}
const nodeNames = {
    'ieu_a_1187': 'Depression', //, 
    'ukb_b_6519': 'Worry', //, 
    'ieu_a_1018': 'Wellbeing', //, 
    'ukb_b_8476': 'Loneliness', //, 
    'ukb_b_3957': 'Insomnia', //, 
    'ieu_a_118': 'Neuroticism', //, 
    'ukb_b_5779': 'Alcohol', //, 
    'ieu_a_1239': 'Education', //, 
    'ukb_b_19953': 'BMI', //, 
    'ukb_b_5238': 'Intelligence', //, 
    'ukb_b_4956': 'Eveningness', //, 
    'ukb_b_5076': 'Socialising', // , 
    'ieu_a_961': 'Smoking', //, 
    'ukb_b_4710': 'Exercise', //, 
    'ukb_b_5237': 'Coffee intake', //, 
    'ieu_a_7': 'Heart disease', //CHD, 
    'ukb_b_4424': 'Sleep', //, 
    'ieu_a_24': 'Diabetes', //
}

const nodeDefs = {
    'ieu_a_1187': 'Mood disorder associated with sadness and loss of interest', //, 
    'ukb_b_6519': 'Frequency of feeling worried', //, 
    'ieu_a_1018': 'Self-reported feelings of life satisfaction and happiness', //, 
    'ukb_b_8476': 'Frequency of feeling lonely', //, 
    'ukb_b_3957': 'Difficulties initiating and maintaining sleep', //, 
    'ieu_a_118': 'Personality trait associated with feeling strong emotions', //, 
    'ukb_b_5779': 'Units of alcohol drank per week', //, 
    'ieu_a_1239': 'Years of education', //, 
    'ukb_b_19953': 'Body weight relative to height', //, 
    'ukb_b_5238': 'Fluid intelligence score', //, 
    'ukb_b_4956': 'Whether you are more of a \'morning\' or \'evening\' person', //, 
    'ukb_b_5076': 'Frequency of self-reported social activities', // , 
    'ieu_a_961': 'Cigarettes smoked per day', //, 
    'ukb_b_4710': 'Hours of moderate exercise per week', //, 
    'ukb_b_5237': 'Quantity of coffee drank per week', //, 
    'ieu_a_7': 'Diagnosis of Chronic Heart Disease', //CHD, 
    'ukb_b_4424': 'Average hours of sleep per night', //, 
    'ieu_a_24': 'Diagnosis of diabetes', //
}    