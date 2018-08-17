import React, { Component } from 'react';
import {Button, Icon, Modal, Card, Grid} from 'semantic-ui-react';
import Layout from './components/layout';
import CheckBalanceForm from './components/checkBalance';
import CheckMetadata from './components/checkMetadata';
import AttendanceCoin from './ethereum/attendancecoin';
import web3 from './ethereum/web3';

class App extends Component {
	state = {
		lastId:'',
		users:[],
	}

	async componentDidMount(){
		let users = [];
		let userAddr, userBal;

		const lastId = await AttendanceCoin.methods.lastID().call();
		this.setState({lastId:lastId});

		for (var i=2; i < parseInt(this.state.lastId,10)+1; i++){
			userAddr = await AttendanceCoin.methods.idToAddress(i).call();
			userBal = await AttendanceCoin.methods.balanceOf(userAddr).call();
			
			users.push([userAddr,web3.utils.fromWei(userBal,'ether')]);
		}

		this.setState({users:users.sort(function(a,b){return a[1] - b[1];}).reverse()});
	}

	renderUsers(){
		const items = this.state.users.map(user => {
			return {
				header: "Address: " + user[0],
				description: "Balance: " + user[1] + " ATNC",
				fluid: true
			};
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<h1>Coin Index!</h1>
				
				<Grid>
					<Grid.Column width={12}>
						{this.renderUsers()}
					</Grid.Column>
					<Grid.Column width={4}>
						<Grid.Row>
							<Modal
								trigger={
									<Button icon labelPosition='left' className="primary" floated="right">
										<Icon name='check square outline' />
										Check Balance
									</Button>
								}>
								<Modal.Header>Check Balance</Modal.Header>
								<Modal.Content>
									<CheckBalanceForm />
								</Modal.Content>
							</Modal>
						</Grid.Row>
						<Grid.Row>
							<Modal
								trigger={
									<Button icon labelPosition='left' className="primary" floated="right" style={{marginTop:"5px"}}>
										<Icon name='check square outline' />
										Check Metadata
									</Button>
								}>
								<Modal.Header>Attendance Coin Meatdata</Modal.Header>
								<Modal.Content>
									<CheckMetadata />
								</Modal.Content>
							</Modal>
						</Grid.Row>
					</Grid.Column>
				</Grid>
			</Layout>
		);
	}
}

export default App;
