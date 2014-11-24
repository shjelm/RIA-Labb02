/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");

var CardsList = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div id='card' key={ index }><img onClick={this.props.onClick.bind(null, this)} src={ card.url }/></div>;
    }.bind(this);
    return <div id='cards'>{ this.props.cards.map(createItem) }</div>;

  	}
});

var DeckCalculator = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function() {
		this.cards = [];
		this.userCards = [];
		return {cards: [], name:"default", url:"defaultURL"};
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
    	console.log(event.props.cards[0].name);
    	this.firebaseRefUser["userCards"].push({
        	name: event.props.cards[0].name,
        	url: event.props.cards[0].url
      	});
    },
  	render: function() {
    return (
      <div>
      	<h3>All Cards</h3>
        <CardsList onClick={ this.handleOnAdd } cards={ this.state.cards } />
      </div>
    );
  }
});

React.render(<DeckCalculator />, document.getElementById("allCardsDiv"));