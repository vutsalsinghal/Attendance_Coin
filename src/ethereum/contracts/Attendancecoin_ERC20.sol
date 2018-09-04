pragma solidity ^0.4.24;

import './libraries/SafeMath.sol';
import './standard/Owned.sol';
import './standard/ERC20Interface.sol';

// ----------------------------------------------------------------------------
// 1B FIXED Supply Token contract
//
// Symbol      : AC
// Name        : Attendance Coin
// Total supply: 1,000,000,000.000000000000000000
// Decimals    : 18
//
// nyc-blockchain-devs.slack.com contributors
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Contract function to receive approval and execute function in one call
//
// Borrowed from MiniMeToken
// ----------------------------------------------------------------------------
contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}


// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a fixed supply
//
// ----------------------------------------------------------------------------
contract FixedSupplyToken is ERC20Interface, Owned {
    using SafeMath for uint;

    string public symbol;
    string public  name;
    uint8 public decimals;
    uint _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() public {
        symbol = "AC";
        name = "Attendance Coin";
        decimals = 18;
        _totalSupply = 1000000000 * 10**uint(decimals);
        balances[owner] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);
    }


    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public view returns (uint) {
        return _totalSupply.sub(balances[address(0)]);
    }


    // ------------------------------------------------------------------------
    // Get the token balance for account `tokenOwner`
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }


    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to `to` account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Transfer `tokens` from the `from` account to the `to` account
    //
    // The calling account must already have sufficient tokens approve(...)-d
    // for spending from the `from` account and
    // - From account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for `spender` to transferFrom(...) `tokens`
    // from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces
    // ------------------------------------------------------------------------
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for `spender` to transferFrom(...) `tokens`
    // from the token owner's account. The `spender` contract function
    // `receiveApproval(...)` is then executed
    // ------------------------------------------------------------------------
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        return true;
    }


    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function () public payable {
        revert();
    }


    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
}

contract AttendanceCoin_Members is Owned {
    FixedSupplyToken tokenAddress;

    uint public lastID;
    mapping(uint => address) public addresses;
    mapping(address => uint) public ids;

    constructor() public{
        tokenAddress = FixedSupplyToken(0x05e710AFeEBE27972e45F75ACA2D16Ec2C698F45);
    }

    function enter() public {
        address _address = msg.sender;
        require(tokenAddress.balanceOf(_address) > 0);
        if (ids[_address] == 0){
            addresses[++lastID] = _address;
            ids[_address] = lastID;
        }
    }

    function exit() public {
        address _address = msg.sender;
        if (ids[_address] > 0){
            addresses[ids[_address]] = 0;
            ids[_address] = 0;
        }
    }
    
    function ownerAdds(address _address) onlyOwner public{
        require(tokenAddress.balanceOf(_address) > 0);
        if (ids[_address] == 0){
            addresses[++lastID] = _address;
            ids[_address] = lastID;
        }
    }
}

contract AttendanceCoin_Faucet is Owned{
    mapping (address => uint) public count;
    mapping (address => uint) public cool_down;

    FixedSupplyToken tokenAddress;

    constructor() public {
        owner = msg.sender;
        tokenAddress = FixedSupplyToken(0x05e710AFeEBE27972e45F75ACA2D16Ec2C698F45);
    }

    function getAC() public returns (bool success){
        if (count[msg.sender] > 4){                     // user is greedy!
            if (cool_down[msg.sender] == 0){
                cool_down[msg.sender] = now + 2 days;   // 2 days cooldown!
            }else if (now > cool_down[msg.sender]){
                count[msg.sender] = 0;
                cool_down[msg.sender] = 0;
            }

            ++count[msg.sender];
            success = false;
        }else{
            ++count[msg.sender];
            success = tokenAddress.transfer(msg.sender, 10000000000000000000);
        }
    }

    function timeLeft() view public returns(uint time){
        if (now > cool_down[msg.sender]){
            return 0;
        }else{
            return cool_down[msg.sender] - now;
        }
    }
    
    function resetValues(address _addr) onlyOwner public{
        count[_addr] = 0;
        cool_down[_addr] = 0;
    }

    function transferAC(address _addr, uint _amt) onlyOwner public returns (bool success){
        return tokenAddress.transfer(_addr, _amt);
    }
}