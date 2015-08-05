/**
 * Created by lukedowell on 8/3/15.
 */
var students = [];
$(document).ready(function() {
    var $btnList = $("#buttonList");

    requestStudentData();
    addButtons($btnList);

    $btnList.on('click', 'button', function() {
        $(".activeButton").removeClass("activeButton");
        $(this).addClass("activeButton");
    });

    $("#generateButton").on('click', function() {
        $('.team-wrapper').html('');
        if(students.length > 2) {
            var shuffledMembers = shuffle(students);
            var numTeams = parseInt($(".activeButton").text());
            var teams = generateTeams(shuffledMembers, {numTeams: numTeams});
            appendTeams(teams);
            sexyReveal();
        }
    });

    $("#altGenerateButton").on('click', function() {
       $('.team-wrapper').html('');
        if(students.length > 2) {
            var shuffledMembers = shuffle(students);
            var numMembersPerTeam = parseInt($(".activeButton").text());
            var teams = generateTeams(shuffledMembers, {membersPerTeam: numMembersPerTeam});
            appendTeams(teams);
            sexyReveal();
        }
    });
});

/**
 * Representation of a team
 * @constructor
 */
function Team(id) {
    this.id = id;
    this.members = [];
}

/**
 * Generates a list of teams based on a list of members and a
 * set of options
 * @param memberList
 *      An array of people with which we will populate the teams
 * @param options
 *      Required. Needs either a numTeams option or a membersPerTeam option. If both are provided,
 *      it will default to numTeams. If neither are provided, null will be returned.
 * @returns {Array}
 */
function generateTeams(memberList, options) {
    var teams = [];
    var membersPerTeam = undefined;
    var numTeams = undefined;

    //Figure out what information we do not have
    if(options.numTeams != undefined) {
        //We are calculating the number of members per team
        numTeams = options.numTeams;
        membersPerTeam = Math.floor(memberList.length / numTeams);
    } else if(options.membersPerTeam != undefined) {
        //We are calculating the number of teams to make
        membersPerTeam = options.membersPerTeam;
        numTeams = Math.floor(memberList.length / membersPerTeam);
    } else {
        return null;
    }

    //Calculate our extra members
    var extraMembers = memberList.length % numTeams;

    //Create perfect teams
    for(var i = 0; i < numTeams; i++) {
        var team = new Team(i+1);
        for(var j = 0; j < membersPerTeam; j++) {
            team.members.push(memberList.shift());
        }
        teams.push(team);
    }

    //Distribute extra members
    for(var k = 0; k < extraMembers; k++) {
        teams[k].members.push(memberList.shift());
    }
    console.log("Num Teams: " + numTeams + " -- Extra Members: " + extraMembers);

    return teams;
}

/**
 * Randomly shuffles an array and returns a new copy of the shuffled array
 * Dat fisher-yates
 * @param array
 *      The array to shuffle
 */
function shuffle(array) {
    var shuffled = array.slice(); //Copy array
    var m = shuffled.length;
    var temp, i;
    while(m) {
        i = Math.floor(Math.random() * m--); //i is the index of the value we are going to shuffle
        temp = shuffled[m]; //Grabs the last non-shuffled value and stores it
        shuffled[m] = shuffled[i]; //Swaps the last element with our element at i
        shuffled[i] = temp; //Replaces our 'empty' spot with t
    }
    return shuffled;
}

/**
 * Takes in an array of teams and appends them to the DOM
 * @param teams
 */
function appendTeams(teams) {
    $.each(teams, function() {
        var $team = buildTeam(this);
        $('.team-wrapper').append($team);
    })
}

/**
 * Builds our team card
 * @param team
 * @returns {*|jQuery|HTMLElement}
 */
function buildTeam(team) {
    var $teamDiv = $("<div/>", {class: "team"});
    var $teamHead = $("<div/>", {class: "team-heading"});
    var $teamBody = $("<div/>", {class: "team-body"});

    var $teamName = $("<h2/>", {text: "Team " + team.id});
    var $memberList = $("<ul/>", {class: "member-list"});

    var length = team.members.length;
    for(var i = 0; i < length; i++) {
        $memberList.append($("<li/>", {text:team.members[i]}));
    }

    $teamHead.append($teamName);
    $teamBody.append($memberList);
    $teamDiv.append($teamHead);
    $teamDiv.append($teamBody);
    return $teamDiv;
}

/**
 * MMmmmm
 */
function sexyReveal() {
    var totalDelay = 750;
    $(".team").each(function() {
       $(this).fadeIn(totalDelay+=750, function() {
           var liDelay = 500;
           $(this).find('li').each(function() {
                $(this).fadeIn(liDelay+=500);
           });
       }).css('display', 'inline-block');
    });
}


/**
 * Function to request student data from the server
 * @param recepticle
 *      The array we will populate with data from the response
 */
function requestStudentData() {
    $.ajax({
        type: "GET",
        url: "/data",
        success: function(data) {
            console.log(data);
            students = data.students;
            console.log(students);
        },
        error: function() {
            console.log("Error ;_;")
        }
    })
}

/**
 * Adds buttons yo
 */
function addButtons(container) {
    for(var i = 2; i <= 11; i++) {
        var newButton = $("<button/>", {
            text: i
        });
        if(i === 2) {
            newButton.addClass("activeButton");
        }
        container.append(newButton);
    }
}