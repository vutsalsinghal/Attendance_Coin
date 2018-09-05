import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/layout';
import Home from './components/Home';
import ACFaucet from './components/ACFaucet';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Layout>
					<Switch>
						<Route exact path="/Attendance_Coin" component={Home} />
						<Route path="/Attendance_Coin/faucet" component={ACFaucet} />
					</Switch>
				</Layout>
			</BrowserRouter>
		);
	}
}

export default App;