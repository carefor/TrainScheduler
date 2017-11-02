$(document).ready(function () {

    "use strict";

    var config = {
        apiKey: "AIzaSyDtBHYVrazi2tbXsT66OCMux-owPq678NE",
        authDomain: "trainscheduler-349ab.firebaseapp.com",
        databaseURL: "https://trainscheduler-349ab.firebaseio.com",
        projectId: "trainscheduler-349ab",
        storageBucket: "trainscheduler-349ab.appspot.com",
        messagingSenderId: "266760117472"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    $("#addTrainBtn").on("click", function (event) {
        event.preventDefault();

        var trainName = $("#nameInput").val().trim();
        var destination = $("#destInput").val().trim();
        var firstTime = $("#firstTimeInput").val().trim();
        var frequency = $("#freqInput").val().trim();

        var addTrain = {
            train: trainName,
            headedTo: destination,
            departsAt: firstTime,
            everyXMin: frequency
        };

        database.ref().push(addTrain);

        alert("Train " + trainName + " was successfully added!");

        $("#nameInput").val("");
        $("#destInput").val("");
        $("#firstTimeInput").val("");
        $("#freqInput").val("");
    });

    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        var trainName = childSnapshot.val().train;
        var destination = childSnapshot.val().headedTo;
        var firstTime = childSnapshot.val().departsAt;
        var frequency = childSnapshot.val().everyXMin;

        //Ensure frequency is an integer
        var trainfreq = parseInt(frequency);

        //Current time
        var currentTime = moment();

        //Push time back one year
        var dConverted = moment(childSnapshot.val().departsAt, "HH:mm").subtract(1, "years");

        var trainTime = moment(dConverted).format("HH:mm");

        //difference between times
        var timeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

        var timeDifference = moment().diff(moment(timeConverted), "minutes");

        //remaining time 
        var timeRemainder = timeDifference % frequency;

        //minutes until next train
        var minsAway = frequency - timeRemainder;

        //next train
        var nextTrain = moment().add(minsAway, "minutes").format("hh:mm A");

        $("#train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" +
            destination + "</td><td>" + frequency + " min" + "</td><td>" + nextTrain +
            "</td><td>" + minsAway + "</td></tr>");
    });
});

//Automatically insert colon after hours typed
var timeInput = $("#firstTimeInput");
for (var i = 0; i < timeInput.length; i++) {
    timeInput[i].addEventListener('keyup', function (e) {
        var reg = /[0-9]/;
        //Add colon if string length > 2 and string is a number
        if (this.value.length == 2 && reg.test(this.value)) this.value = this.value + ":";
    });
};