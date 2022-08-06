// Node modules.
import MetaMaskOnboarding from "@metamask/onboarding";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";

// Derive the constant values we need.
export const CHAIN_ID = "0x5";

// Derive the onboarding instance for MetaMask.
const metaMaskOnboarding = new MetaMaskOnboarding();

const ConnectWallet = ({ accounts, setAccounts }) => {
  const registerEthereumListeners = useCallback(() => {
    if (!window.ethereum) {
      return;
    }

    // Listen to accounts being changed.
    window.ethereum.on("accountsChanged", (accounts) => {
      console.info("accountsChanged", accounts);

      setAccounts(accounts);
    });

    // Listen to chain changes.
    window.ethereum.on("chainChanged", async (chainId) => {
      console.info("chainChanged", chainId);

      if (chainId !== CHAIN_ID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: CHAIN_ID,
            },
          ],
        });
      }
    });

    // Listen to the user being logged in.
    window.ethereum.on("connect", async (connectInfo) => {
      console.info("connect", connectInfo);

      // Request to change to the correct chain.
      if (connectInfo.chainId !== CHAIN_ID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: CHAIN_ID,
            },
          ],
        });
      }

      // Fetch the user's accounts.
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    });

    // Listen to the user being logged out.
    window.ethereum.on("disconnect", (disconnectInfo) => {
      console.info("disconnect", disconnectInfo);

      setAccounts([]);
    });
  }, [setAccounts]);

  useEffect(() => {
    registerEthereumListeners();
  }, [registerEthereumListeners]);

  const onMetaMaskInstall = () => {
    metaMaskOnboarding.startOnboarding();
  };

  const onConnect = async () => {
    try {
      // Register the listeners.
      registerEthereumListeners();

      // Fetch the user's accounts.
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    return (
      <button onClick={onMetaMaskInstall} type="button">
        Install MetaMask to use this app
      </button>
    );
  }

  // If we have an account, we're connected.
  if (!accounts?.[0]) {
    return (
      <button onClick={onConnect} type="button">
        Connect
      </button>
    );
  }

  return (
    <button type="button">
      {accounts?.[0].slice(0, 6)}...{accounts[0].slice(-4)}
    </button>
  );
};

ConnectWallet.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setAccounts: PropTypes.func.isRequired,
};

export default ConnectWallet;
