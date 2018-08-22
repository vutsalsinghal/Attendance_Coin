import React, {Component} from 'react';
import {Form, Input, Button, Message} from 'semantic-ui-react';
import * as ACinstances from '../ethereum/attendancecoin';
import web3 from '../ethereum/web3';

class CheckBalanceForm extends Component{
	state = {
		value:'',
		errorMessage:'',
		balance:'',
	}

	onSubmit = async event => {
		event.preventDefault();

		this.setState({errorMessage:''});		
		
		try{
			const balance = await ACinstances.AttendanceCoin.methods.balanceOf(this.state.value).call();
			this.setState({balance:web3.utils.fromWei(balance, 'ether')});
		}catch(err){
			this.setState({errorMessage:err.message});
		}

		this.setState({value:''});
	};

	render(){
		let balanceMessage;

		if (this.state.balance === ''){
			balanceMessage = null;
		}else if (this.state.balance === '0'){
			balanceMessage = <Message floating negative header="Balance" content={"You've 0 ATNC coins!"} />;
		}else{
			balanceMessage = <Message floating positive header="Balance" content={"You've " + this.state.balance + ' ATNC coins!'} />;
		}

		return (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
				<Form.Field>
					<label>Enter Your Address</label>
					<Input
					//label='ether'
					//labelPosition="right"
					value={this.state.value}
					onChange={event => this.setState({value:event.target.value})}
				/>
				</Form.Field>
				<Message error header="Oops!" content={this.state.errorMessage} />
				<Button primary basic>
					Shoot
				</Button>
				{balanceMessage}
			</Form>
		);
	}
};

export default CheckBalanceForm;
