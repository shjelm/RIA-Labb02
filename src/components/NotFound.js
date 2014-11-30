/** @jsx React.DOM */

var React = require("react");

var NotFound  = React.createClass({
  	render: function() {
    return (
      <div className='div'>
      	<h3>Not Found</h3>
        <p>The Content was not found!</p>
      </div>
    );
  }
}); 

module.exports = NotFound;