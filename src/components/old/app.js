/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");

var CardsListAllCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div id='card' key={ index }><img onClick={this.props.onClick.bind(null, this)} src={ card.url }/></div>;
    }.bind(this);
    return <div id='cards'>{ this.props.cards.map(createItem) }</div>;

  	}
});

var DeckCalculatorAllCards = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function() {
		this.cards = [];
		this.userCards = [];
		return {cards: [], name:"default", url:"defaultURL", key:"null"};
  	},
  	componentWillMount: function() {
		var firebaseRefAllCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_Cards/");
		var firebaseRefUser = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards/");
	    this.bindAsArray(firebaseRefAllCards, "cards");
	    this.bindAsArray(firebaseRefUser, "userCards");
	},
	componentWillUnmount: function() {
    	this.firebaseRefAllCards.off();
    	this.firebaseRefUser.off();
    },
    handleOnAdd: function(event){
    	console.log("Adding card: " + event.props.cards[0].name);
    	this.firebaseRefs["userCards"].push({
        	name: event.props.cards[0].name,
        	url: event.props.cards[0].url
      	});
    },
  	render: function() {
    return (
      <div>
      	<h3>All Cards</h3>
        <CardsListAllCard onClick={ this.handleOnAdd } cards={ this.state.cards } />
      </div>
    );
  }
});

var CardsListUserCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div id='card' key={ index }><img onClick={this.props.onClick.bind(null, this)} src={ card.url }/></div>;
    }.bind(this);
    return <div id='cards'>{ this.props.cards.map(createItem) }</div>;

  	}
});

var DeckCalculatorUserCards = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function() {
		this.userCards = [];
		return {userCards: [], name:"", url:""};
  	},
	componentWillMount: function() {
	var firebaseRefUser = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards/");
    this.bindAsArray(firebaseRefUser, "userCards");
	},
	componentWillUnmount: function() {
    	this.firebaseRefUser.off();
    },
    handleOnRemove: function(event){
    	console.log(this.firebaseRefs["userCards"]);
    },
  	render: function() {
    return (
      <div>
      	<h3>Your Cards</h3>
        <CardsListUserCard onClick={ this.handleOnRemove } cards={ this.state.userCards } />
      </div>
    );
  }
});


var DeckCalculator = React.createClass({
	render : function (){
	return (
		<div>
			<DeckCalculatorUserCards />
			<DeckCalculatorAllCards />
		</div>
		);	
	}
});

React.render(<DeckCalculator />, document.getElementById("content"));