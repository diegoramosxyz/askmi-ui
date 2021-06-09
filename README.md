# dqanda

dqanda (Decentralized Q&A) is dapp used to offer a pay-per-response service in which anyone can ask questions by paying a price set by the responder in exchange for a answer.

The responder will add Priority Tiers, which inform the questioner of how fast he should expect a response.

### PROBLEM BEING ADRESSED

As seen in websites such as Quora and Yahoo Answers, people are willing to answer questions, even when there is no economic incentive for doing so. dqanda aims to provide an economic incentive for anyone to provide the best answer the any question in a decentralized and non-custodial fashion.

Thanks to IPFS the answer will not be limited to strings. If feasiable, any type of file could be use to answer the questions.

### THE SERVICE AND THE PROTOCOL

dqanda as a service will be the best and easiest to use graphical user interface to interact with dqanda, the protocol. It will show stats for the responder and allow viewers to tip answers, signaling a cosign. Such tips will be distributed between the responder and questioner.

### STATEMENTS

- An user (The Responder) deploys a contract to provide a pay-per-response service. He does so by setting the Priority Tiers he wishes to charge.

- An user (The Questioner) generates a hash of his question and uses it to ask the question

- The questioner can cancel and widthdraw at anytime, before an answer is received

- The responder can reject questions

- Somehow, the hashes in the contract will be read to find the answers and questions stored in IPFS such that the users have a similar experience to Quora or Yahoo Answer. Gas issues are a concern here.

### TENTATIVE IDEAS

If the responder does not answer before the time stipulated the user will receive the money back. This will incentivize the responder to answer as many questions as possible.

Instead of the responder owning a contract which others can use to ask questions (many-to-one), every time a new user wants to ask questions a new contract is created such that there are only two addresses interacting per contract (one-to-one).

This proposition is based on lack of knowledge. If it is gas efficient to only have one contract per responder, that option will be chosen.

_Disclaimer: I'm using this project to learn solidity. I might say or code some outrageous things._

### Sources

https://medium.com/coinmonks/state-machines-in-solidity-9e2d8a6d7a11

http://amavridou.com/papers/mavridou2018SC.pdf