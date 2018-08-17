import React, {Component} from 'react';
import {Button, Message} from 'semantic-ui-react';
import AttendanceCoin from '../ethereum/attendancecoin';
import web3 from '../ethereum/web3';

class CheckMetadata extends Component{
	state = {
		name:'',
		symbol:'',
		totalSupply:'',
		owner:'',
		message:'',
	}

	async componentDidMount(){
		const name = await AttendanceCoin.methods.name().call();
		const owner = await AttendanceCoin.methods.owner().call();
		const symbol = await AttendanceCoin.methods.symbol().call();
		let totalSupply = await AttendanceCoin.methods.totalSupply().call();
		totalSupply = web3.utils.fromWei(totalSupply, 'ether');

		this.setState({name, owner, symbol, totalSupply});
	}
	
	onClick = async (para) => {
		let msg;

		if (para === 'name'){
			msg = <Message header="Name" content={this.state.name} />;
		}else if(para === 'owner'){
			msg = <Message header="Owner Address" content={this.state.owner} />;
		}else if(para === 'symbol'){
			msg = <Message header="Symbol" content={this.state.symbol} />;
		}else if(para === 'totalSupply'){
			msg = <Message header="Total Supply" content={this.state.totalSupply} />;
		}
		this.setState({message:msg});
	};

	render(){
		return (
			<div>
				<Button primary basic onClick={para => this.onClick('name')}>
					Coin Name
				</Button>

				<Button primary basic onClick={para => this.onClick('owner')}>
					Coin Owner
				</Button>

				<Button primary basic onClick={para => this.onClick('symbol')}>
					Coin Symbol
				</Button>

				<Button primary basic onClick={para => this.onClick('totalSupply')}>
					Total Coin Supply
				</Button>
				{this.state.message}
			</div>
		);
	}
};

export default CheckMetadata;
