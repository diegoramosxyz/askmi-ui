//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Dqanda {
    // Todo: add reentrancy protection

    address public owner;
    // The price in wei required to ask a question
    uint256 public price; // This will become a mapping of price tiers

    constructor(uint256 _price) {
        owner = msg.sender;
        price = _price;
    }

    event QuestionAsked(address questioner, string _questionHash);
    event QuestionAnswered(
        address questioner,
        string _questionHash,
        string _answerHash
    );

    struct QandA {
        string question;
        string answer;
        // The balance in wei paid to the owner for a response
        // This will vary depending on the price tiers
        uint256 balance;
    }

    // Questioners can ask multiple questions
    mapping(address => QandA[]) public QandAs;

    // Helper function to get all of the questions made by
    // a questioner
    function getQuestions(address _questioner)
        public
        view
        returns (QandA[] memory)
    {
        return QandAs[_questioner];
    }

    // An array of all questioners. Needed for the UI.
    address[] public questioners;

    // Helper function to get the complete questioners array.
    function getQuestioners() public view returns (address[] memory) {
        return questioners;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Must be owner.");
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner, "Unauthorized: Must not be owner.");
        _;
    }

    // Make the contract payable
    receive() external payable {}

    // Ensure the questioner is paying the right price
    modifier coversCost() {
        require(msg.value == price, "Payment is not equal to the price.");
        _;
    }

    // Anyone, but the owner can ask a question
    function ask(string memory _questionHash)
        public
        payable
        notOwner
        coversCost
    {
        // Save new questioners
        if (QandAs[msg.sender].length == 0) {
            questioners.push(msg.sender);
        }
        // initialize an empty struct and then update it
        QandA memory qanda;
        qanda.question = _questionHash;
        qanda.balance = msg.value;
        // qanda.answer initialized to deafult value

        QandAs[msg.sender].push(qanda);

        emit QuestionAsked(msg.sender, _questionHash);
    }

    // Todo: create a withdraw function for questioners

    // Only the owner can respond and get paid.
    function respond(
        address questioner,
        string memory _questionHash,
        string memory _answerHash
    ) public onlyOwner {
        // Todo: check that question exists

        QandAs[questioner].push(
            QandA({question: _questionHash, answer: _answerHash, balance: 0})
        );

        // Todo: Get value from the mapping
        (bool success, ) = owner.call{value: price}("");
        require(success, "Failed to send Ether");
        emit QuestionAnswered(questioner, _questionHash, _answerHash);
    }
}
