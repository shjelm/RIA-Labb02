/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./actions");
var Reflux = require('reflux');

var BuildsListAllBuilds = React.createClass({
	render: function() {
    var createItem = function(build, index) {
      	return <div className='build' key={ index } onClick={this.props.onClick.bind(null, build)}>Hello</div>;
    }.bind(this);

    return <div className='builds'>{ this.props.builds.map(createItem) }</div>;
  	}
});

var BuildBuilder = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState: function() {
		this.builds = [];
		return {builds: [], key:"null", author:"null", name:"default", cards:[]};
  	},
  	componentWillMount: function() {
  		this.firebaseRefAllBuilds = new Firebase("https://sizzling-torch-8926.firebaseio.com/all_builds/");

  		this.firebaseRefAllBuilds.on("child_added", function(dataSnapshot) {
  			var build = {
	            key: dataSnapshot.name(),
	            author:dataSnapshot.val().author,
	            name: dataSnapshot.val().name,
	            cards: dataSnapshot.val().cards
        	};

   			this.builds.push(
   				build
   			);
    		this.setState({
      			builds: this.builds
    		});
  		}.bind(this));

  		this.listenTo(Actions.login, this.onUserChange);
  		this.listenTo(Actions.logout, this.onUserChange);
	},
	componentWillUnmount: function() {
    	this.firebaseRefAllBuilds.off();
    },
	handleOnClick: function(build){
		console.log("Clicked: " +build);
	},
	onUserChange: function(user){
		this.setState({
      		user:user
    	});
	},
  	render: function() {
  	if(this.state.user != null){
  		return (
      		<div className='div'>
      			<h3>All Builds</h3>
        		<BuildsListAllBuilds onClick={ this.handleOnClick } builds={ this.state.builds } />
        		<a>Add Build</a>
	  		</div>
   		);
  	}
  	else{
  		return (
      		<div className='div'>
      			<h3>All Builds</h3>
        		<BuildsListAllBuilds onClick={ this.handleOnClick } builds={ this.state.builds } />
	  		</div>
   		);
  	}
    
  }
});


var Builds = React.createClass({
	render : function (){
	return (
		<div>
			<BuildBuilder />
		</div>
		);	
	}
});

module.exports = Builds;