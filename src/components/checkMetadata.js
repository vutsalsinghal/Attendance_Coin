import React, {Component} from 'react';
import {Card} from 'semantic-ui-react';
import AttendanceCoin from '../ethereum/attendancecoin';
import web3 from '../ethereum/web3';

class CheckMetadata extends Component{
	state = {
		name:'',
		symbol:'',
		totalSupply:'',
		owner:'',
	}

	async componentDidMount(){
		const name = await AttendanceCoin.methods.name().call();
		const owner = await AttendanceCoin.methods.owner().call();
		const symbol = await AttendanceCoin.methods.symbol().call();
		let totalSupply = await AttendanceCoin.methods.totalSupply().call();
		totalSupply = web3.utils.fromWei(totalSupply, 'ether');

		this.setState({name, owner, symbol, totalSupply});
	}

	renderCards(){
		const repo = 'https://github.com/vutsalsinghal/Attendance_Coin';

		const metaCards = [
			{
				header:this.state.name,
				meta: 'Name Of The Coin',
				description: 'The full-name of the coin',
				style: { overflowWrap: 'break-word' }
			},
			{
				header:this.state.symbol,
				meta: 'Symbol Of The Coin',
				description: 'Identifying acronym of the coin',
				style: { overflowWrap: 'break-word' }
			},
			{
				header:this.state.totalSupply,
				meta: 'Initial Total Fixed Supply',
				description: 'No. of coins mined at the time of contract creation',
				style: { overflowWrap: 'break-word' }
			},
			{
				header:this.state.owner,
				meta: 'Owner of the Attendance Coin Contract',
				description: 'Contract creator address',
				style: { overflowWrap: 'break-word' }
			},
			{
				href:repo,
				header: repo,
				meta: 'Code Repository Of The Coin',
				description: 'Repository contains both contract and application code',
				style: { overflowWrap: 'break-word' },
				color:"blue"
			}
		];

		return <Card.Group items={metaCards} />
	}

	render(){
		return <div>{this.renderCards()}</div>;
	}
};

export default CheckMetadata;
