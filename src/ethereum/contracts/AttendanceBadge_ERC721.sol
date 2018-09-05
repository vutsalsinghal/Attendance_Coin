pragma solidity ^0.4.24;

// Deployed on Rinkey network at 0x05023b3df1c9088b7431dce589f91a63d5b43599

import './libraries/SafeMath.sol';
import './utility/CheckERC165.sol';
import './standard/ERC721.sol';
import './standard/ERC721TokenReceiver.sol';
import './standard/Owned.sol';

contract AttendanceBadge is ERC721, CheckERC165, Owned{
    using SafeMath for uint256;
    uint256 internal maxId;                                                     // The highest valid tokenId, for checking if a tokenId is valid
    
    mapping(address => uint256) internal balances;                              // A mapping storing the balance of each address
    mapping(uint256 => bool) internal burned;                                   // A mapping of burnt tokens, for checking if a tokenId is valid
    mapping(uint256 => address) internal owners;                                // A mapping of token owners
    mapping (uint256 => address) internal allowance;                            // A mapping of the "approved" address for each token
    mapping (address => mapping (address => bool)) internal authorised;         // A nested mapping for managing "operators"
    
    constructor(uint _initialSupply) public CheckERC165(){
        balances[msg.sender] = _initialSupply;                                  // All initial tokens belong to creator, so set the balance
        maxId = _initialSupply;                                                 // Set maxId to number of tokens
        
        supportedInterfaces[                                                    //Add to ERC165 Interface Check
            this.balanceOf.selector ^
            this.ownerOf.selector ^
            bytes4(keccak256("safeTransferFrom(address,address,uint256"))^
            bytes4(keccak256("safeTransferFrom(address,address,uint256,bytes"))^
            this.transferFrom.selector ^
            this.approve.selector ^
            this.setApprovalForAll.selector ^
            this.getApproved.selector ^
            this.isApprovedForAll.selector
        ] = true;
    }
    
    function isValidToken(uint256 _tokenId) internal view returns(bool){
        return _tokenId != 0 && _tokenId <= maxId && !burned[_tokenId];
    }
    
    function balanceOf(address _owner) external view returns (uint256){
        return balances[_owner];
    }
    
    function ownerOf(uint256 _tokenId) public view returns(address){
        require(isValidToken(_tokenId));
        if(owners[_tokenId] != 0x0 ){
            return owners[_tokenId];
        }else{
            return owner;
        }
    }
    
    function issueTokens(uint256 _extraTokens) public onlyOwner{ 
        // Make sure only the contract creator can call this
        balances[msg.sender] = balances[msg.sender].add(_extraTokens);
    
        //We have to emit an event for each token that gets created
        for(uint i = maxId.add(1); i <= maxId.add(_extraTokens); i++){
            emit Transfer(0x0, owner, i);
        }
    
        maxId += _extraTokens;                                                  //<- SafeMath for this operation was done in for loop above
    }
    
    function burnToken(uint256 _tokenId) external{
        address tokenOwner = ownerOf(_tokenId);
        require (tokenOwner == msg.sender || allowance[_tokenId] == msg.sender || authorised[tokenOwner][msg.sender]);
        burned[_tokenId] = true;
        balances[tokenOwner]--;
        emit Transfer(tokenOwner, 0x0, _tokenId);
    }
    
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return authorised[_owner][_operator];
    }
    
    function setApprovalForAll(address _operator, bool _approved) external {
        emit ApprovalForAll(msg.sender,_operator, _approved);
        authorised[msg.sender][_operator] = _approved;
    }
    
    function getApproved(uint256 _tokenId) external view returns (address) {
        require(isValidToken(_tokenId));
        return allowance[_tokenId];
    }
    
    function approve(address _approved, uint256 _tokenId)  external{
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender || authorised[tokenOwner][msg.sender]);
        emit Approval(tokenOwner, _approved, _tokenId);
        allowance[_tokenId] = _approved;
    }
    
    function transferFrom(address _from, address _to, uint256 _tokenId) public{
        address tokenOwner = ownerOf(_tokenId);
        require (tokenOwner == msg.sender || allowance[_tokenId] == msg.sender || authorised[tokenOwner][msg.sender]);
        require(tokenOwner == _from);
        require(_to != 0x0);
        emit Transfer(_from, _to, _tokenId);
        owners[_tokenId] = _to;
        balances[_from]--;
        balances[_to]++;
        
        if(allowance[_tokenId] != 0x0){
            delete allowance[_tokenId];
        }
    }
    
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) public {
        transferFrom(_from, _to, _tokenId);

        //Get size of "_to" address, if 0 it's a wallet
        uint32 size;
        assembly {
            size := extcodesize(_to)
        }
        
        if(size > 0){
            ERC721TokenReceiver receiver = ERC721TokenReceiver(_to);
            require(receiver.onERC721Received(msg.sender,_from,_tokenId,data) == bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")));
        }

    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
        safeTransferFrom(_from,_to,_tokenId,"");
    }
}