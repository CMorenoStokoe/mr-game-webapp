/* 

Assets to preload
=================
Description:
List of assets and locations, required for the game so they can be preloaded in

Use:
The preload script will iterate over these lists and preload in all these assets on page load

*/

// List of images to preload
const imagesToPreload = [
    
    // Ships
    'images/ships/rocket_comet.png',
    'images/ships/rocket_emperor.png',
    'images/ships/rocket_explorer1.png',
    'images/ships/rocket_explorer2.png',
    'images/ships/rocket_mule.png',
    'images/ships/rocket_prestige.png',
    'images/ships/rocket_whale.png',
    
    // Planets
    'images/planets/earth.png',
    'images/planets/earth1.png',
    'images/planets/earth2.png',
    'images/planets/earth3.png',
    'images/planets/earth4.png',
    'images/planets/jupiter.png',
    'images/planets/mars.png',
    'images/planets/mercury.png',
    'images/planets/neptune.png',
    'images/planets/saturn.png',
    'images/planets/saturn2.png',
    'images/planets/uranus.png',
    'images/planets/venus.png',
    
    // Epicons'images/epicons/bmi.png',
    'images/epicons/caffeine.png',
    'images/epicons/chd_alt.png',
    'images/epicons/diabetes.png',
    'images/epicons/drinking.png',
    'images/epicons/drugs.png',
    'images/epicons/education_schoolYears.png',
    'images/epicons/education_schoolYears_alt.png',
    'images/epicons/eveningness.png',
    'images/epicons/exercise_bike.png',
    'images/epicons/gaming.png',
    'images/epicons/intelligence.png',
    'images/epicons/intelligence_alt.png',
    'images/epicons/mh_anxiety2.png',
    'images/epicons/mh_depression2.png',
    'images/epicons/mh_ocd2.png',
    'images/epicons/phone.png',
    'images/epicons/sleep.png',
    'images/epicons/sleep_duration.png',
    'images/epicons/sleep_insomnia.png',
    'images/epicons/smoking.png',
    'images/epicons/social_chatBubble.png',
    'images/epicons/social_chatBubble_alt.png',
    'images/epicons/social_loneliness.png',
    'images/epicons/social_loneliness_alt.png',
    'images/epicons/social_notChatting.png',
    'images/epicons/wellbeing2_alt.png',
    'images/epicons/work_nightShifts.png',
    'images/epicons/work_nightShifts_alt.png',

    // Backgrounds
    'images/spaceboxes/1.jpg',
    'images/spaceboxes/2.jpg',
    'images/spaceboxes/3.jpg',
    'images/spaceboxes/4.jpg',
    'images/spaceboxes/5.jpg',
    'images/spaceboxes/6.jpg',
    'images/spaceboxes/7.jpg',
    'images/spaceboxes/space2.jpg',

];

// List of audio to preload
const audioToPreload = [

    // Sounds
        // Ships
        'audio/sounds/ships/flyby_fast_1.mp3',
        'audio/sounds/ships/flyby_fast_2.mp3',
        'audio/sounds/ships/flyby_med_1.mp3',
        'audio/sounds/ships/flyby_med_2.mp3',
        'audio/sounds/ships/flyby_slow_1.wav',
        'audio/sounds/ships/flyby_veryfast_1.wav',
        'audio/sounds/ships/flyby_veryslow_1.mp3',
        // UI
        'audio/sounds/event-positive/moment2.mp3',
        'audio/sounds/ui/effect-good.wav',

    // Music
        // Soundtrack
        'audio/music/01_infinity_awaits_us.mp3',
        'audio/music/04_artificial_serenity.mp3',
        'audio/music/space/space_imagine.mp3',

];