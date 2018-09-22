pragma solidity ^0.4.24;

// Deployed at 0x45d73d3d938ace7de0a6a4f0568c8f8bb6d71c8e on Rinkeby

import './ERC721.sol';
import './Owned.sol';

contract BadgeCoin is ERC721, Owned{
    address public owner;
    uint256 public badgeId = 1;

    struct Badge {
        uint id;
        string name;
        string description;
    }

    mapping(address => Badge) public badgeHolder;
    Badge[] public badges;

    constructor() public {
        owner = msg.sender;
        badges.push(Badge(0,"",""));
    }

    function createBadge(string _name, string _description, address _to) public onlyOwner{
        badgeHolder[_to] = Badge({id: badgeId,name:_name, description: _description});
        badges.push(badgeHolder[_to]);
        
        // Create new coin
        _mint(_to, badgeId);
        badgeId = badges.length;
    }

    function tradeItem(uint256 _badgeId, address _to) public {
        _safeTransferFrom(msg.sender, _to, _badgeId, "");
    }
    
    // Returns ID of coins msg.sender owns!
    function userCoins() view external returns(uint[]){
        // Check user balance
        uint balance = ownerToNFTokenCount[msg.sender];
        uint[] memory coinArr = new uint[](balance);
        
        if (balance == 0){
            
        }else{
            uint lastCoinID = badgeHolder[msg.sender].id;
            uint j = 0;
            
            for(uint i=1; i<=lastCoinID; i++){
                if (msg.sender == idToOwner[i]){
                    coinArr[j] = i;
                    j += 1;
                }
            }
        }

        return coinArr;
    }
}