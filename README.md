# Decentralized Todo

The world's universal and decentralized TODO web app, built with Solidity + React.

![App](./readme/app.mp4)

## Getting Started

1. Clone the repo.
1. Create `.env` file based off `.env.example`. You will also need an [Alchemy](https://www.alchemy.com/) account! 🧙‍♀️⚗️
1. Install dependencies with `yarn install` or `npm install`.
1. Compile the smart contracts using `yarn compile`.
1. Run the smart contracts' tests using `yarn test`. ✅ ✅ ✅
1. Copy the files under `./artifacts/contracts/*` to `./client/src/contracts`.
1. Deploy the smart contracts using `yarn deploy`.
1. Copy the address posted to the terminal from the previous command and paste it into `./client/src/contracts/index.js` for the constant `TASK_CONTRACT_ADDRESS`.
1. Change directory to `./client`.
1. Create `.env` file based off `.env.example`.
1. Install the client's dependencies with `yarn install` or `npm install`.
1. Run `yarn start`, the site should now be running at [localhost:3000](http://localhost:3000).
