pragma solidity ^0.4.24;

import './attendancecoin-erc20.sol';

contract AttendanceCoin_Faucet{
    address public owner;
    mapping (address => uint) public count;
    mapping (address => uint) public cool_down;

    FixedSupplyToken tokenAddress;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor(FixedSupplyToken _tokenAddress) public {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    function getAC() public returns (bool success){
        if (count[msg.sender] > 5){                     // user is greedy!
            if (cool_down[msg.sender] == 0){
                cool_down[msg.sender] = now + 172800;   // 2 days cooldown!
            }else if (now > cool_down[msg.sender]){
                count[msg.sender] = 0;
                cool_down[msg.sender] = 0;
            }

            success = false;
        }else{
            ++count[msg.sender];
            success = tokenAddress.approve(msg.sender, 8000000000000000000 * count[msg.sender]);
        }
    }

    function transferAC(address _addr, uint _amt) onlyOwner public returns (bool success){
        return tokenAddress.approve(_addr, _amt);
    }
}