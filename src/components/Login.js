/** @jsx React.DOM */

var React = require("react");
var Firebase = require("firebase");
var Actions = require("./Actions");
var Reflux = require('reflux');
var UserStore = require("./UserStore");

var Login = React.createClass({
  mixins: [Reflux.connect(UserStore,"user")],
	componentWillMount: function() {
  		this.ref = new Firebase("https://sizzling-torch-8926.firebaseio.com");
      this.user = [];
  		var authData = this.ref.getAuth();
  		if(authData){
        console.log("mount");
  			Actions.login(authData);
        /*
  			this.setState({
    				authData: authData
  			});
  			window.authData = authData;*/
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
          console.log("calling");
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
        	<p className='Login' onClick={ this.handleOnLogin }>Login</p>
        	</div>
        );
     }
     else{
     	return(
     		<div id='div'>
     		<h3>Welcome { authData.github.username }</h3>
     		<p className='Login' onClick={ this.handleOnLogout }>Logout</p>
     		</div>
     	);
     }
  }
});

module.exports = Login;