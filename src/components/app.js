/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");

var CardsListAllCard = React.createClass({
	render: function() {
    var createItem = function(card, index) {
      	return <div className='card' key={ index }><img onClick={this.props.onClick.bind(null, card)} src={ card.url }/></div>;
    }.bind(this);

    return <div className='cards'>{ this.props.cards.map(createItem) }</div>;
  	}
});

var DeckCalculatorAllCards = React.createClass({
	getInitialState: function() {
		this.cards = [];
		this.userCards = [];
		return {cards: [], key:"null", name:"default", url:"defaultURL"};
  	},
  	componentWillMount: function() {
  		this.firebaseRefAllCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_Cards/");
  		this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");

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
	},
	componentWillUnmount: function() {
    	this.firebaseRefAllCards.off();
    	this.firebaseRefUser.off();
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
      	return <div className='card' key={ index }><img onClick={this.props.onClick.bind(null, this)} src={ card.url }/></div>;
    }.bind(this);

    return <div className='cards'>{ this.props.userCards.map(createItem) }</div>;
  	}
});

var DeckCalculatorUserCards = React.createClass({
	getInitialState: function() {
		this.userCards = [];
		return {userCards: [], key:"null", name:"default", url:"defaultURL"};
  	},
  	componentWillMount: function() {
  		this.firebaseRefUserCards = new Firebase("https://sizzling-torch-8926.firebaseio.com/users/guest/cards");

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
    	this.firebaseRefUser.off();
    },
    handleOnRemove: function(event){
    	var clickedCard = event.props.userCards[0];
    	
    	for (index = 0; index < this.userCards.length; ++index) {
    		if(this.userCards[index].key == clickedCard.key){
    			this.userCards.splice( index, 1);
    			this.setState({
      				userCards: this.userCards
    			});
    			index = this.userCards.length;
    		}
		}

    	this.firebaseRefUserCards.child(clickedCard.key).remove();

  		this.setState({
      		userCards: this.userCards
    	});
    },
  	render: function() {
    return (
      <div className='div'>
      	<h3>User Cards</h3>
        <CardsListUserCard onClick={ this.handleOnRemove } userCards={ this.state.userCards } />
      </div>
    );
  }
});

var UpdateCards = React.createClass({
	getInitialState: function() {
    	this.items = [];
    	return {items: [], name: "", url:""};
  	},
  	componentWillMount: function() {
		this.firebaseRef = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_Cards/");
	},
	componentWillUnmount: function() {
    	this.firebaseRef.off();
    },
	handleSubmit: function(e) {
    	e.preventDefault();
    	if( this.state.name.toString().length > 0 &&
    		this.state.url.toString().length > 0){

			var imageUrl = this.state.url.toString();
			imageExists(imageUrl, function(exists) {
			  	if(exists){			  		
					this.firebaseRef.push({
        				name: this.state.name,
        				url: this.state.url
		  			});
		  	
		  			this.setState({name: "", url:""});

		  			document.getElementById("submitError").innerHTML = "";
			  	}
			  	else{
			  		document.getElementById("submitError").innerHTML = "Image Not Found!";
			  	}
			}.bind(this));
    	}   	
    },
    nameOnChange: function(e) {
	    this.setState({name: e.target.value});
    },
    URLOnChange: function(e) {
	    this.setState({url: e.target.value});
    },
	render: function(){
		return (
			<div className='div'>
				<form onSubmit={ this.handleSubmit }>
					<p id='submitError'></p>
					<p>Add a card to db</p>
          			Name:<input onChange={ this.nameOnChange } value={ this.state.name } /><br/>
          			URL:<input onChange={ this.URLOnChange } value={ this.state.url } /><br/>
         			<button>Add Card</button>
        		</form>
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
			<UpdateCards />
		</div>
		);	
	}
});

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}

React.render(<DeckCalculator />, document.getElementById("content"));