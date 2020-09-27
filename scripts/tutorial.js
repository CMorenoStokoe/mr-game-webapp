/*

Tutorial
=====
Description: This file contains scripts for the tutorial for the game.

Use: This file is called by the main script when a player has logged in and is first starting the game.

*/

// Initialise tutorial dialogues
function initialiseTutorial(){

    // Hide GUI elements for reveal
    $('#GUI-goal').hide().css('opacity', 0);
    $('#svg-main').hide().css('opacity', 0);
    
    // Show intro welcome text
    $('#tutorial-0-modal').modal('show');

    // Set up string of tutorials
    $('#tutorial-0-modal').on('hidden.bs.modal', function(){
        $('#tutorial-1').show().animate({opacity: 1}, 500);
    })
    $('#win-screen-btn').one('click', function(){
        $('#tutorial-6').show().animate({opacity: 1}, 500);
    })
    $('#tutorial-1-btn').click(function(){
        $('#tutorial-1').hide();
        $('#tutorial-2').show().animate({opacity: 1}, 500);
        $('#GUI-goal').show().animate({opacity: 1}, 500);
    });
    $('#tutorial-2-btn').click(function(){
        $('#tutorial-2').hide();
        $('#tutorial-3').show().animate({opacity: 1}, 500);
        $('#svg-main').show().animate({opacity: 1}, 500);
    });
    $('#tutorial-3-btn').click(function(){
        $('#tutorial-3').hide();
        $('#tutorial-4').show().animate({opacity: 1}, 500);
    });
    $('#tutorial-4-btn').click(function(){
        $('#tutorial-4').hide();
    });
    $('#tutorial-5-btn').click(function(){
        $('#tutorial-5').hide();
    });
    $('#tutorial-6-btn').click(function(){
        $('#tutorial-6').hide();
    });

    // Show intervention tip when the intervention menu is brought up for the first time
    $('#intervention-modal').one('shown.bs.modal', function(){
        $('#tutorial-5').show().animate({opacity: 1}, 500);
    })
    $('#intervention-modal').one('hidden.bs.modal', function(){
        $('#tutorial-5').hide();
    })
}