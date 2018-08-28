import React, { Component } from 'react';
import {Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/layout';
import Home from './components/Home';
import CheckBalanceForm from './components/checkBalance';
//import * as ACinstances from './ethereum/attendancecoin';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Layout>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/checkBalance" component={CheckBalanceForm} />
					</Switch>
				</Layout>
			</BrowserRouter>
		);
	}
}

export default App;