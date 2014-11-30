/** @jsx React.DOM */

/** Other */
var React = require('react'),
	Router = require('react-router'),
    Route = require('react-router').Route,
    DefaultRoute = require('react-router').DefaultRoute,
	RouteHandler = Router.RouteHandler,
	NotFoundRoute = Router.NotFoundRoute,
	Link = Router.Link;

/** Mine */
var DeckBuilder = require('./DeckBuilder.js'),
	CardAdder = require('./CardAdder.js'),
	NotFound = require('./NotFound.js'),
	Login = require('./Login.js'),
	SUT = require('./SUT.js'), 
	Builds = require('./Builds.js');


var App = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="app">Builds</Link></li>
            <li><Link to="deckBuilder">My Deck!</Link></li>
            <li><Link to="cardAdder">Add Cards To DB (admin)</Link></li>
            <li><Link to="SUT">SUT Code (new code that I test or something)</Link></li>
          </ul>
          <Login />
        </header>

        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="deckBuilder" handler={DeckBuilder}/>
    <Route name="cardAdder" handler={CardAdder}/>
    <Route name="SUT" handler={SUT}/>
    <DefaultRoute handler={Builds}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById("content"));
});
