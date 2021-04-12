// bring in the Twit package
const Twit = require("twit");
const config = require('./config.js');
var T = new Twit(config);

// const is a var that never changes
const request = require('request');

const SW = require('stopword');
const bayes = require('bayes');
const fs = require('fs');
var classifier = bayes();

T.get('search/tweets', { q: "how do we", count: 100 }, async function(err, data, response) {
    try {
        for(var j=0; j<data.statuses.length; j++){
            console.log(data.statuses[j].text);
        }
    } catch (err){
        console.log(err);
    }
})