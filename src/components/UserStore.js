/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');

var User = [];

var UserStore = Reflux.createStore({
  init: function(){
    //this.listenTo(Actions.login,this.login.bind(this));
    //this.listenTo(Actions.logout,this.logout.bind(this));
  },
  login: function(user){
    console.log(user);
    this.User = user;
  },
  logout: function(){
    this.trigger((this.User = {}||{}));
  },
  getDefaultData: function(){
    return this.User || {};
  }
});