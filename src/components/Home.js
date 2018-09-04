import React, { Component } from 'react';
import {Button, Icon, Modal, Card, Grid} from 'semantic-ui-react';
import CheckBalanceForm from './checkBalance';
import * as ACinstances from '../ethereum/attendancecoin';
import web3 from '../ethereum/web3';

class Home extends Component {
	state = {
		lastId:'',
		users:[],
	}

	async componentDidMount(){
		let users = [];
		let userAddr, userBal;

		const lastId = await ACinstances.AttendanceCoin_lastID.methods.lastID().call();
		this.setState({lastId:lastId});

		for (var i=1; i < parseInt(this.state.lastId,10)+1; i++){
			userAddr = await ACinstances.AttendanceCoin_lastID.methods.addresses(i).call();
			userBal = await ACinstances.AttendanceCoin.methods.balanceOf(userAddr).call();

			if (userBal !== '0'){
				users.push([userAddr,web3.utils.fromWei(userBal, 'ether')]);
			}
		}

		this.setState({users:users.sort(function(a,b){return a[1] - b[1];}).reverse()});
	}

	renderUsers(){
		const items = this.state.users.map(user => {
			return {
				header: "Address: " + user[0],
				description: "Balance: " + user[1] + " AC",
				fluid: true,
				style: { overflowWrap: 'break-word' },
			};
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<div>
				<h1>Attendance Coin Holders:</h1>
				<Grid stackable reversed="mobile">
					<Grid.Column width={12}>
						{this.renderUsers()}
					</Grid.Column>
					<Grid.Column width={4}>
						<Grid.Row>
							<Modal basic size='small'
								trigger={
									<Button icon labelPosition='left' className="primary" floated="right">
										<Icon name='rain' />
										Check Balance
									</Button>
								}>
								<Modal.Header>Check Attendance Coins</Modal.Header>
								<Modal.Content>
									<CheckBalanceForm />
								</Modal.Content>
							</Modal>
						</Grid.Row>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

export default Home;