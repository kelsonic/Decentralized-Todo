// Node modules.
import { ethers } from "ethers";
import { useEffect, useState } from "react";
// Relative imports.
import Actions from "../Actions";
import ConnectWallet from "../ConnectWallet";
import CreateTask from "../CreateTask";
import TASK_CONTRACT from "../../contracts/TaskContract.json";
import Tasks from "../Tasks";
import cross from "../../assets/cross.png";
import { TASKS, TASKS_CREATE } from "./PAGES";
import { TASK_CONTRACT_ADDRESS } from "../../contracts";
import { Wrapper } from "./styles";
import { formatTasks } from "../../utils";

function App() {
  // Derive the state we need.
  const [accounts, setAccounts] = useState([]);
  const [chain, setChain] = useState(null);
  const [page, setPage] = useState(TASKS);
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      // Escape early if no ethereum object is found.
      if (!window.ethereum) {
        console.log("Metamask not detected");
        return;
      }

      // Get the provider.
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer.
      const signer = provider.getSigner();

      // Get the contract.
      const TaskContract = new ethers.Contract(
        TASK_CONTRACT_ADDRESS,
        TASK_CONTRACT.abi,
        signer
      );

      // Get all tasks.
      const tasks = await TaskContract.getTasks();

      // Format the tasks.
      const formattedTasks = formatTasks(tasks);

      // Set the tasks.
      setTasks(formattedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch tasks whenever accounts change.
  useEffect(() => {
    getTasks();
  }, [accounts]);

  return (
    <Wrapper>
      {/* Connect wallet button + flow. */}
      <ConnectWallet
        accounts={accounts}
        setAccounts={setAccounts}
        setChain={setChain}
      />

      {/* Chain warning. */}
      {chain && chain !== process.env.REACT_APP_CHAIN_ID && (
        <div className="chain-warning-background">
          <div className="chain-warning">
            <h2>
              <img alt="cross" src={cross} /> Wrong Network
            </h2>
            <p>Please switch your wallet network to Goerli to use the app.</p>
          </div>
        </div>
      )}

      {/* List Tasks page. */}
      {page === TASKS && (
        <Tasks
          accounts={accounts}
          page={page}
          setTasks={setTasks}
          tasks={tasks}
        />
      )}

      {/* Create Task page. */}
      {page === TASKS_CREATE && (
        <CreateTask accounts={accounts} setPage={setPage} setTasks={setTasks} />
      )}

      {/* Actions at bottom of screen. */}
      <Actions accounts={accounts} page={page} setPage={setPage} />
    </Wrapper>
  );
}

export default App;
