/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');

var cardRef = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");

var CardStore = Reflux.createStore({
  init: function(){
    this.cards = [];
    cardRef.on("child_added",this.updateCards.bind(this));
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
    for (index = 0; index < this.cards.length; ++index) {
      if(this.cards[index].key == card.key){
        this.cards.splice( index, 1);
        index = this.cards.length;
      }
    }

    cardRef.child(card.key).remove();
    this.trigger((this.cards));
  },
  updateCards: function(snapshot){
    var card = {
        key: snapshot.name(),
        name: snapshot.val().name,
        url: snapshot.val().url
    };

    this.cards.push(
      card
    );

    this.trigger((this.cards));
  },
  getDefaultData: function(){
    return this.cards || [];
  }
});

module.exports = CardStore;