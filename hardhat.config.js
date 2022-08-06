require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: false,
    gasPrice: 20,
    showTimeSpent: true,
    token: "ETH",
  },
  networks: {
    goerli: {
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
      url: process.env.ALCHEMY_GOERLI_URL,
    },
  },
  solidity: "0.8.9",
};
