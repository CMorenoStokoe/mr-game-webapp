/*

Database
========
Description:
These functions update an online database containing player information.

Use:
This script is called by the main script when data upload and fetch operations are required.

*/

// Create new user
function createNewUser(username, callback = printToConsole){

    // Attempt create new user (fails if already exists)
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };
        xhttp.open("GET", `http://www.morenostok.io/game_newuser.php?usr=${username}`, true);
        xhttp.send();

}


// Get player information
function getPlayerData(username, callback = printToConsole){

    // Get player progress data
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                callback(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", `http://www.morenostok.io/game_getPlayerProgress.php?usr=${username}`, true);
        xhttp.send();
}

// Get player badges
function getPlayerBadges(username, callback = printToConsole){

    // Get player badge data
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                callback(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", `http://www.morenostok.io/game_getPlayerBadges.php?usr=${username}`, true);
}

// Update player progress
function updateProgress(username, currentLevel, currentProgress, callback = printToConsole){

    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };
        xhttp.open("GET", `http://www.morenostok.io/game_userProgress.php?usr=${username}&lvl=${currentLevel}&prog=${currentProgress}`, true);
        xhttp.send();

}

// Record player intervention
function recordMove(username, target, effect, score, interventionLimit, callback = printToConsole){

    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };
        xhttp.open("GET", `http://www.morenostok.io/game_recordMove.php?usr=${username}&trgt=${target}&efct=${effect}&score=${score}&limit=${interventionLimit}`, true);
        xhttp.send();

}

// Default callback function is to print to console the response from the database
function printToConsole(payload){
    console.log(payload)
}
