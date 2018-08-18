import React, {Component} from 'react';
import {Input, Message, Button, Form} from 'semantic-ui-react';
import AttendanceCoin from '../ethereum/attendancecoin';
import web3 from '../ethereum/web3';

class CheckMetadata extends Component{
	state = {
		errorMessage:'',
		address:'',
		token_amt:'',
		loading:false,
		msg:''
	}

	onSubmit = async event => {
		event.preventDefault();

		this.setState({errorMessage:'', loading:true});
		
		try{
			const accounts = await web3.eth.getAccounts();
			const res = await AttendanceCoin.methods.transfer(this.state.address, this.state.token_amt).send({from:accounts[0]});
			if (res["status"]){
				this.setState({msg:<Message floating positive header="Success!" content={"Transfered " + this.state.token_amt + ' ATNC coins successfully.'} />});
			}
		}catch(err){
			this.setState({errorMessage:err.message});
		}

		this.setState({loading:false});
	};

	render(){
		return (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
				<Form.Field>
					<label>Enter 'To' Address</label>
					<Input
					value={this.state.value}
					onChange={addr => this.setState({address:addr.target.value})}
				/>
				</Form.Field>
				<Form.Field>
					<label>Enter Token Amount</label>
					<Input
					label='ATNC'
					labelPosition="right"
					value={this.state.value}
					onChange={amt => this.setState({token_amt:amt.target.value})}
				/>
				</Form.Field>
				<Message error header="Oops!" content={this.state.errorMessage} />
				<Button primary basic loading={this.state.loading} disabled={this.state.loading	}>
					Transfer
				</Button>
				{this.state.msg}
			</Form>
		);
	}
};

export default CheckMetadata;
