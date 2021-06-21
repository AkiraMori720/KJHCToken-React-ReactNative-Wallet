// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract KJHCToken is StandardToken {
    string public name = 'KJHCToken';
    string public symbol = 'TUT';
    uint8 public decimals = 2;

    uint public INITIAL_SUPPLY = 1000000;

    function KJHCToken() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}