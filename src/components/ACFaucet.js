import React, {Component} from 'react';
import {Button, Message} from 'semantic-ui-react';
import * as ACinstances from '../ethereum/attendancecoin';
import web3 from '../ethereum/web3';

class ACFaucet extends Component{
	state = {
		msg:'',
		loading:false,
		errorMessage:''
	}

	onClick = async event => {
		this.setState({errorMessage:'', loading:true, msg:''});

		try{
			const accounts = await web3.eth.getAccounts();
			await ACinstances.AttendanceCoin_Faucet.methods.getAC().send({from: accounts[0]});
			const count = await ACinstances.AttendanceCoin_Faucet.methods.count(accounts[0]).call();
			console.log(count);
			if (count > 5){
				console.log('cooldown!');
				const timeLeft = await ACinstances.AttendanceCoin_Faucet.methods.timeLeft().call({from:accounts[0]});
				console.log(timeLeft);
				this.setState({msg:<Message floating negative header="User is greedy!" content={accounts[0] + ' has already received 40 AC. Please wait ' + timeLeft + ' seconds !'} />});
			}else{
				this.setState({msg:<Message floating positive header="Success!" content={"Approved " + accounts[0] + ' 8 AC successfully. You will now be prompted to transfer AC to your account.'} />});
				await ACinstances.AttendanceCoin.methods.transferFrom("0xbec1ad77ab0dca72224f47bb94ee64a610045c79", accounts[0], 8000000000000000000).send({from: accounts[0]});
				this.setState({msg:<Message floating positive header="Success!" content={"Transfered 8AC to " + accounts[0] + ' successfully.'} />});
			}
		}catch(err){
			this.setState({errorMessage:<Message error header="Oops!" content={err.message} />});
		}

		this.setState({loading:false});
	};

	onClickAddAddress = async event => {
		this.setState({errorMessage:'', loading:true, msg:''});

		try{
			const accounts = await web3.eth.getAccounts();
			await ACinstances.AttendanceCoin_lastID.methods.enter().send({from:accounts[0]});

			this.setState({msg:<Message positive header="Address Added!" content={accounts[0] + ' Added successfully to the list!'} />});
		}catch(err){
			this.setState({errorMessage:<Message error header="Oops!" content={err.message} />});	
		}

		this.setState({loading:false});
	}

	onClickRemoveAddress = async event => {
		this.setState({errorMessage:'', loading:true, msg:''});

		try{
			const accounts = await web3.eth.getAccounts();
			await ACinstances.AttendanceCoin_lastID.methods.exit().send({from:accounts[0]});

			this.setState({msg:<Message positive header="Address Removed!" content={accounts[0] + ' Removed successfully from the list!'} />});
		}catch(err){
			this.setState({errorMessage:<Message error header="Oops!" content={err.message} />});	
		}

		this.setState({loading:false});
	}

	render(){
		return (
			<div>
				<Button primary style={{marginBottom:"15px"}} onClick={this.onClick} disabled={this.state.loading} loading={this.state.loading}>
					Get 8 Attendance Coins
				</Button>
				
				<Message info>
				    <Message.Header>
				    	If your address is not displyed in the "Coin Holders" list
					    <Button primary floated="right" onClick={this.onClickAddAddress} disabled={this.state.loading} loading={this.state.loading}>
							Add Address
						</Button>
					</Message.Header>
					<br/>
				</Message>

				{/*
				<Message info>
				    <Message.Header>
				    	If you want to remove your address from the "Coin Holders" list
					    <Button primary floated="right" onClick={this.onClickRemoveAddress} disabled={this.state.loading} loading={this.state.loading}>
							Remove Address
						</Button>
					</Message.Header>
					<br/>
				</Message>
				*/}

				{this.state.msg}
				{this.state.errorMessage}
			</div>
		);
	}
};

export default ACFaucet;