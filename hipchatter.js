//  Endpoints
var API_ROOT = 'https://api.hipchat.com/v2/';

//  Dependencies
var request = require('request');
var path = require('path');
var needle = require('needle');
  
//  Hipchatter constructor
var Hipchatter = function(token) {  
    this.token = token;
}

//  Hipchatter functions
Hipchatter.prototype = {

    // Get all rooms
    rooms: function(callback){
        this.request('room', function(err, results){
            if (err) callback(err);
            else callback(err, JSON.parse(results).items);
        });
    },

    // Get history from room
    // Takes either a room id or room name as a parameter
    history: function(room, callback){
        this.request('room/'+room+'/history', function(err, results){
            if (err) callback(err);
            else callback(err, JSON.parse(results));
        });
    },

    // Uses the simple "Room notification" token
    notify: function(room, message, token, callback){
        var data = {
            color: 'green',
            message: message
        }
        needle.post(this.url('room/'+room+'/message', token), data, {json:true}, function(error, res, body){
            console.log(body)
            if (!error && res.statusCode == 204) { callback(null, body); }
            else callback(error, 'API connection error.');
        });
    },

    // Generator API url
    url: function(rest_path, alternate_token){
        var token = (alternate_token == undefined)? this.token : alternate_token;
        return API_ROOT + '/' + escape(rest_path) + '?auth_token=' + token;
    },

    // Make a request
    request: function(path, callback){
        request(this.url(path), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(null, body);
            }
            else callback(error, 'API connection error.');
        });
    }
}

module.exports = Hipchatter;