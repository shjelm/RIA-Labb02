/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');

var CardsListAllCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div className='card' key={ index }><img onClick={this.props.onClick.bind(null, card)} src={ card.url }/></div>;
    }.bind(this);

    return <div className='cards'>{ this.props.cards.map(createItem) }</div>;
  	}
});

var DeckCalculatorAllCards = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		this.cards = [];
		this.userCards = [];
		return {cards: [], key:"null", name:"default", url:"defaultURL"};
  	},
  	componentWillMount: function() {
  		this.firebaseRefAllCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_Cards/");

  		if(this.state.user != null){
			this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/" + this.state.user.github.username +"/cards");
  		}
  		else{
  			this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");
  		}

  		this.firebaseRefAllCards.on("child_added", function(dataSnapshot) {
  			var card = {
	            key: dataSnapshot.name(),
	            name: dataSnapshot.val().name,
	            url: dataSnapshot.val().url
        	};

   			this.cards.push(
   				card
   			);
    		this.setState({
      			cards: this.cards
    		});
  		}.bind(this));

  		this.listenTo(Actions.login, this.onUserChange);
  		this.listenTo(Actions.logout, this.onUserChange);
	},
	onUserChange: function(user){
		this.setState({
      		user:user
    	});
    	console.log("user change");
    	this.updateUserPrefs();
	},
	updateUserPrefs: function(){
		if(this.state.user != null){
			this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/" + this.state.user.github.username +"/cards");
			this.setState({
  				userName:this.state.user.github.username
  			});
  		}
  		else{
  			this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");
  			this.setState({
  				userName:this.defaultUserName
  			});
  		}
  		this.userCards = [];
  		this.firebaseRefUserCards.on("child_added", function(dataSnapshot) {
  			var userCards = {
	            key: dataSnapshot.name(),
	            name: dataSnapshot.val().name,
	            url: dataSnapshot.val().url
        	};

   			this.userCards.push(
   				userCards
   			);
    		this.setState({
      			userCards: this.userCards
    		});
  		}.bind(this));
    },
	componentWillUnmount: function() {
    	this.firebaseRefAllCards.off();
    	this.firebaseRefUserCards.off();
    },
    handleOnAdd: function(card){
    	
    	this.firebaseRefUserCards.push({
	        name: card.name,
	        url: card.url
  		});

  		this.setState({
      		cards: this.cards
    	});
    },
  	render: function() {
    return (
      <div className='div'>
      	<h3>All Cards</h3>
        <CardsListAllCard onClick={ this.handleOnAdd } cards={ this.state.cards } />
      </div>
    );
  }
});

var CardsListUserCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div className='card' key={ index }><img onClick={this.props.onClick.bind(null, card)} src={ card.url }/></div>;
    }.bind(this);

    return <div className='cards'>{ this.props.userCards.map(createItem) }</div>;
  	}
});

var DeckCalculatorUserCards = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		this.userCards = [];
		this.defaultUserName = "Guest";
		return {userCards: [], key:"null", name:"default", url:"defaultURL"};
  	},
  	componentWillMount: function() {
  		this.updateUserPrefs();

  		this.listenTo(Actions.login, this.onUserChange);
  		this.listenTo(Actions.logout, this.onUserChange);
	},
	onUserChange: function(user){
		this.setState({
      		user:user
    	});
    	console.log("user change");
    	this.updateUserPrefs();
	},
	componentWillUnmount: function() {
    	this.firebaseRefUserCards.off();
    },
    updateUserPrefs: function(){
		if(this.state.user != null){
			console.log("Setting to github user");
			this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/" + this.state.user.github.username +"/cards");
			this.setState({
  				userName:this.state.user.github.username
  			});
  		}
  		else{
  			console.log("Setting to Guest user");
  			this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");
  			this.setState({
  				userName:this.defaultUserName
  			});
  		}
  		this.userCards = [];
  		this.firebaseRefUserCards.on("child_added", function(dataSnapshot) {
  			var userCards = {
	            key: dataSnapshot.name(),
	            name: dataSnapshot.val().name,
	            url: dataSnapshot.val().url
        	};

   			this.userCards.push(
   				userCards
   			);
    		this.setState({
      			userCards: this.userCards
    		});
  		}.bind(this));
    },
    handleOnRemove: function(card){
    	
    	for (index = 0; index < this.userCards.length; ++index) {
    		if(this.userCards[index].key == card.key){
    			this.userCards.splice( index, 1);
    			this.setState({
      				userCards: this.userCards
    			});
    			index = this.userCards.length;
    		}
		}

    	this.firebaseRefUserCards.child(card.key).remove();

  		this.setState({
      		userCards: this.userCards
    	});
    },
  	render: function() {
    return (
      <div className='div'>
      	<h3>{ this.state.userName } Cards</h3>
        <CardsListUserCard onClick={ this.handleOnRemove } userCards={ this.state.userCards } />
      </div>
    );
  }
});

var DeckBuilder = React.createClass({
	render : function (){
	return (
		<div>
			<DeckCalculatorUserCards />
			<DeckCalculatorAllCards />
		</div>
		);	
	}
});

module.exports = DeckBuilder;