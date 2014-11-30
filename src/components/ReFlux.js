/** @jsx React.DOM */

var React = require("react");
var Reflux = require('reflux');

var Actions = Reflux.createActions([
    "statusUpdate",
    "statusEdited",
    "statusAdded"
  ]);

// Creates a DataStore
var statusStore = Reflux.createStore({

    // Initial setup
    init: function() {

        // Register statusUpdate action
        this.listenTo(Actions.statusUpdate, this.output);
    },

    // Callback
    output: function(flag) {
        var status = flag ? 'ONLINE' : 'OFFLINE';
        console.log(status);
    }

});

var Status = React.createClass({
	mixins: [Reflux.ListenerMixin],
    onStatusChange: function(status) {
        this.setState({
            currentStatus: status
        });
    },
    componentDidMount: function() {
        this.listenTo(statusStore, this.onStatusChange);
        this.setState({
            currentStatus: true
        });
    },
    changeStatus: function(){
    	Actions.statusUpdate(true);
    	Actions.statusUpdate(false);
    },
    render: function() {
    	return(
    		<a href="#" onClick={ this.changeStatus }>status: { this.currentStatus }</a>
    	);       
    }
});

module.exports = Status;