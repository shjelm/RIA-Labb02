/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');

var cardRef = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");

var CardStore = Reflux.createStore({
  init: function(){
    cardRef.on("value",this.updateCards.bind(this));
    this.listenTo(Actions.addUserCard,this.addCard.bind(this));
    this.listenTo(Actions.removeUserCard,this.removeCard.bind(this));
  },
  addCard: function(card){
    cardRef.push(card,function(err){
      if (err){
        console.log("did not add card");
      } else {
        console.log("did add card: " + card.name);
      }
    });
  },
  removeCard: function(card){
    this.cardRef.child(card.key).remove();
  },
  updateCards: function(snapshot){
    console.log(snapshot.val());
    this.trigger((this.cards = snapshot.val() || {}));
  },
  getDefaultData: function(){
    return this.cards || {};
  }
});

module.exports = CardStore;