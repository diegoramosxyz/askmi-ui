# AskMi

AskMi is dapp used to offer a pay-per-response service in which anyone can ask questions by depositing ETH into a smart contract with the expectation of receiving a response. If the responder answers the question, he will gain the deposit.

The responder will add Priority Tiers, which inform the questioner of how fast he should expect a response.

Once a question has been answered, anyone but the responder can tip the answer. This signals approval of the answer and support for the responder. The questioner will receive a small fraction of the tips.

Tipping is preffered to sending ETH directly to the responder because the amount of tips can be used to rank the best responses.

### PROBLEM BEING ADRESSED

As seen in websites such as Quora, people are willing to answer questions, even when there is no economic incentive for doing so. AskMi aims to provide an economic incentive for anyone to provide the best answer to any question in a decentralized and non-custodial fashion.

### ACTIONS

- The Responder deploys an AskMi instance to provide a pay-per-response service. He does so by setting the Priority Tiers he wishes to charge and the cost to Tip answers.

- The Questioner asks a question using the UI

- The questioner can cancel and widthdraw at anytime, before an answer is received

- The responder can reject questions

- The responder answers the question and gets the reward/deposit.

- Anyone can tip answers

### IDEAS

- Make it so that the responder only gets a fraction of the reward once he responds and the rest of the reward when the questioner accepts the answer. We might leave this option up to the responder.

- Allow the responder to set not just the prices for the Priority Tiers, but also a timeout, such that the responder automatically gets back its deposit if the responder did not answer on time.

- This project could becomme a "public file exchange." IPFS can store any file so people can pay to receive PDFs, MP4, ZIP files, etc. It's an on-chain method to commission work.

### THOUGHTS

This project only works under the premise that those who provide their answers/files have an audience and interact with their customers outsite of the dapp or have a good record of providing quality content.

Also, the questioners will be incetivized by the tips.

### CONTRACTS

Read the [Solidity contracts](https://github.com/diegoramosxyz/askmi).

# NOTES

I developed this project to learn Solidity and Svelte. Once I was satisfied with the smart contracts, I created a minimal interface to interact with it. The focus was not on creating a beautiful UI and good UX. I will pause development for now.
