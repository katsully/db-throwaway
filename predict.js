var express = require('express');
const SW = require('stopword');
const bayes = require('bayes');
const fs = require('fs');

// app --> application
// using the constructor to create an express app
var app = express();

// create our server
var server = app.listen(3000);

// have my application use files in the public folder
app.use(express.static('public'));

var socket = require('socket.io');

// create a variable that keeps track of inputs and outputs
var io = socket(server);

// set up a connection event - ie new car of the highway lane
// second parameter - callback
io.sockets.on('connection', newConnection);
var revivedClassifier;
  
function newConnection(socket){
    console.log("new connection! " + socket.id);
    fs.readFile('./classifier.json', downloadedFile);
    function downloadedFile(err, jsonString) {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        revivedClassifier = bayes.fromJson(jsonString);
    }

    socket.on('guess', guessMsg);

    async function guessMsg(data){
        var data_arr = data.split(" ");
        var words = cleanup(data_arr);
        category = await revivedClassifier.categorize(words.join());
        socket.emit('guess', category);
    }
}

function cleanup(words){
    var new_words = [];
    const alphanumeric = /^[0-9a-zA-Z]+$/;
    words = SW.removeStopwords(words);
    for(var i=0; i<words.length; i++){
        // the result variable will be true if it's only alphanumeric and false if it contains non-alphanumeric characters
        if(alphanumeric.test(words[i]) && words[i].length > 2){
            new_words.push(words[i].toLowerCase());
        }
    }
    // spread operator
    var uniq = [...new Set(new_words)];
    return uniq;
}