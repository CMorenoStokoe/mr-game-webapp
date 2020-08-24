/*

Node info
=====
Description: This file contains information associated with each node in the game.

Use: This file is called by the main script and its data used to assign icons and prevalence to nodes.

*/

const icons = {
    'ieu_a_1187': 'mh_depression2', //Depression, 
    'ukb_b_6519': 'mh_anxiety2', //Worry, 
    'ieu_a_1018': 'wellbeing2_alt', //Wellbeing, 
    'ukb_b_8476': 'social_loneliness_alt', //Loneliness, 
    'ukb_b_3957': 'sleep_duration2', //Sleeplessness, 
    'ukb_d_SLEEP': 'sleep_duration2', //ICD10 Insomni, 
    'ukb_b_4062': 'wellbeing2', //Happiness, 
    'ieu_a_118': 'mh_ocd2', //Neuroticism, 
    'ukb_b_5779': 'drinking', //Alcohol, 
    'ieu_a_1239': 'education_schoolYears_alt', //Education, 
    'ukb_b_19953': 'bmi', //BMI, 
    'ukb_b_5238': 'intelligence_alt', //Intelligence, 
    'ukb_b_4956': 'sleep_duration', //Eveningness, 
    'ukb_b_5076': 'social_chatBubble_alt', //Not socialising, 
    'ieu_a_961': 'smoking', //Smoking, 
    'ukb_b_4710': 'exercise_bike', //Exercise, 
    'ukb_b_5237': 'drinking', //Coffee intake, 
    'ieu_a_7': 'bmi', //CHD, 
    'ukb_b_4424': 'sleep_duration', //Sleep duration, 
    'ieu_a_24': 'bmi', //Diabetes
}

const nodeValues = {
    
    'ukb_b_4424': {'prevalence': 7.15, 'min': 1, 'max': 23, 'units':'Hrs/d'},
    'ukb_b_4956': {'prevalence': 2.12, 'min': 1, 'max': 4, 'units':'Category'},
    'ukb_d_SLEEP': {'prevalence': 0.022, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_4062': {'prevalence': 4.44, 'min': 6, 'max': 1, 'units':'Category'},
    'ieu_a_1187': {'prevalence': 0.04, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_6519': {'prevalence': 0.75, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_5779': {'prevalence': 0.2, 'min': 6, 'max': 1, 'units':'Category'},
    'ieu_a_961': {'prevalence': 1.5, 'min': 0, 'max': 145, 'units':'Cigs/day'},
    'ieu_a_1239': {'prevalence': 16.8, 'min': 4.4, 'max': 29.4, 'units':'Years'},
    'ukb_b_19953': {'prevalence': 27, 'min': 10, 'max': 70, 'units':'Units'},
    'ukb_b_5238': {'prevalence': 6, 'min': 0, 'max': 13, 'units':'Test score'},
    'ukb_b_8476': {'prevalence': 0.22, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ukb_b_4710': {'prevalence': 3.66, 'min': 0, 'max': 7, 'units':'Days/wk'},
    'ukb_b_5076': {'prevalence': 0.34, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ieu_a_118': {'prevalence': -0.482, 'min': -1.882, 'max': 0.918, 'units':'Arbitrary score'},
    'ukb_b_5237': {'prevalence': 2.1377, 'min': 0, 'max': 5, 'units':'Cups/wk'},
    'ieu_a_24': {'prevalence': 0.056, 'min': 0, 'max': 1, 'units':'Odds (%)'},
    'ieu_a_7': {'prevalence': 0.014, 'min': 0, 'max': 1, 'units':'Odds(%)'},
    'ieu_a_1018': {'prevalence': 0, 'min': 0, 'max': 1, 'units':'SD score'},
    'ukb_b_3957': {'prevalence': 1.98, 'min': 1, 'max': 3, 'units':'Category'},

}