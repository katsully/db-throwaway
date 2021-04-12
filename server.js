// bring in the Twit package
const Twit = require("twit");
const config = require('./config.js');
var T = new Twit(config);

// const is a var that never changes
const request = require('request');

var trends = {"Paul Pierce": "sports", 
"deGrom": "sports", 
"Kyrie": "sports", 
"Coke": "politics", 
"Manchin": "politics", 
"Maine": "politics"};

const SW = require('stopword');
const bayes = require('bayes');
const fs = require('fs');
var classifier = bayes();

var index =0;
for (let [key, value] of Object.entries(trends)) {
    T.get('search/tweets', { q: key, count: 100 }, async function(err, data, response) {
        try {
            for(var j=0; j<data.statuses.length; j++){
                var tweet_arr = data.statuses[j].text.split(" ");
                var words = cleanup(tweet_arr);
                await classifier.learn(words.join(), value);
            }
            index++;
            if(index == 6){
                var classifyJson = classifier.toJson();
                fs.writeFile('./classifier.json', classifyJson, function finishWriting(err,data) {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
                })
            }
        } catch (err){
            console.log(err);
        }
    })  
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


