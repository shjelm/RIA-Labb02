/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./actions");

var Login = React.createClass({
	componentWillMount: function() {
  		this.ref = new Firebase("https://sizzling-torch-8926.firebaseio.com");
  		var authData = this.ref.getAuth();
  		if(authData){
			Actions.login(authData);
			this.setState({
  				authData: authData
			});
			window.authData = authData;
		}	
	},
    handleOnLogin: function(build){
    	console.log("OnLogin");    	
		this.ref.authWithOAuthPopup("github", function(error, authData) {
			if(error){
				console.log(error);
			}
			if(authData){
				this.setState({
      				authData: authData
    			});
    			Actions.login(authData);
			}			
		}.bind(this), {remember: "sessionOnly"});
	},
	handleOnLogout: function (){
		Actions.logout(null);
		this.ref.unauth();
		this.setState({
      		authData: null
    	});
	},
  	render: function() {
  	var authData = this.ref.getAuth();
  	if(!authData){
  		return(
  			<div id='div'>
			<h3>Login</h3>
        	<a href='#' onClick={ this.handleOnLogin }>Login</a>
        	</div>
        );
     }
     else{
     	return(
     		<div id='div'>
     		<h3>Welcome { authData.github.username }</h3>
     		<a href='#' onClick={ this.handleOnLogout }>Logout</a>
     		</div>
     	);
     }
  }
});

module.exports = Login;