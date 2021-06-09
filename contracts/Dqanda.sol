//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract Dqanda {
    string public answer;
    // Payable address can receive Ether
    address payable public owner;

    // Questioners will be identified by their address
    // The address will map to an array of strings containing 
    // the hash for each of their question
    // The Frontend might be used to limit the questions that 
    // can be asked to prevent the user from using too much gas
    mapping(address => string[]) public myMap;

    // Make an event that returns the

    constructor() {
        answer = "";
        owner = msg.sender;
    }

    function respond(string memory _answerHash) public {
        answer = _answerHash;
    }
}
