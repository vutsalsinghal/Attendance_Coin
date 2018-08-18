import React from 'react';
import { Menu, Modal } from 'semantic-ui-react';
import CheckMetadata from './checkMetadata';
import TransferCoin from './transferCoin';

export default () => {
	return (
	    <Menu style={{ marginTop:'10px' }}>
	      	<Menu.Item>Attendance Coin</Menu.Item>

	       	<Menu.Menu position="right">
	       		<Modal trigger={<Menu.Item>Metadata</Menu.Item>}>
					<Modal.Header>Attendance Coin Meatdata</Modal.Header>
					<Modal.Content>
						<CheckMetadata />
					</Modal.Content>
				</Modal>

  	    		<Modal trigger={<Menu.Item>+</Menu.Item>}>
					<Modal.Header>Transfer Coin</Modal.Header>
					<Modal.Content>
						<h3 style={{color:"red"}}>You must've >= the amount you're transfering!</h3>
						<TransferCoin />
					</Modal.Content>
				</Modal>
	      	</Menu.Menu>
	    </Menu>
  	);
};