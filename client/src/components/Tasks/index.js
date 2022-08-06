// Node modules.
import PropTypes from "prop-types";
import moment from "moment";
import { ethers } from "ethers";
// Relative imports.
import TASK_CONTRACT from "../../contracts/TaskContract.json";
import alarm from "../../assets/alarm.png";
import categoryImages from "../Tasks/CATEGORY_IMAGES";
import checkmark from "../../assets/checkmark.png";
import trash from "../../assets/trash.png";
import unchecked from "../../assets/unchecked.png";
import { TASK_CONTRACT_ADDRESS } from "../../contracts";
import { Wrapper } from "./styles";
import { formatTasks } from "../../utils";

const Tasks = ({ accounts, page, setTasks, tasks }) => {
  const onComplete = (task) => async () => {
    try {
      // Escape early if no ethereum object is found.
      if (!window.ethereum) {
        console.log("Metamask not detected");
        return;
      }

      // Ensure the user is the owner.
      if (accounts?.[0]?.toLowerCase() !== task?.owner?.toLowerCase()) {
        console.log("User is not the owner");
        return;
      }

      // Derive the task ID.
      const taskID = task?.id;

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

      // Update the task.
      await TaskContract.completeTask(taskID);

      // Optimistically update the tasks.
      const updatedTasks = tasks.map((task) => {
        // Update the task.
        if (task.id === taskID) {
          task.stateID = 1;
        }

        // Return the task.
        return task;
      });

      // Set the tasks.
      setTasks(formatTasks(updatedTasks));
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = (task) => async () => {
    try {
      // Escape early if no ethereum object is found.
      if (!window.ethereum) {
        console.log("Metamask not detected");
        return;
      }

      // Ensure the user is the owner.
      if (accounts?.[0]?.toLowerCase() !== task?.owner?.toLowerCase()) {
        console.log("User is not the owner");
        return;
      }

      // Derive the task ID.
      const taskID = task?.id;
      console.log("task", task);

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

      // Update the task.
      await TaskContract.deleteTask(taskID);

      // Optimistically filter the tasks.
      const filteredTasks = tasks.filter((task) => task.id !== taskID);

      // Set the tasks.
      setTasks(formatTasks(filteredTasks));
    } catch (error) {
      console.log(error);
    }
  };

  const doesExpire = (task) => {
    return (
      task?.expiresAtSeconds &&
      moment().add(1, "year").unix() >= task.expiresAtSeconds
    );
  };

  return (
    <Wrapper>
      {/* Title */}
      <h1>Tasks</h1>

      {/* No Tasks */}
      {!tasks?.length && (
        <div className="empty">
          <img alt="checkmark" src={checkmark} />
          <p>No tasks</p>
        </div>
      )}

      {/* Tasks */}
      {!!tasks?.length && (
        <ul>
          {tasks?.map((task) => (
            <li key={task.id}>
              <img
                alt={task.category}
                src={categoryImages[task.categoryID] || categoryImages["0"]}
              />
              <div className="info">
                {task.owner && (
                  <p className="owner">
                    Created by{" "}
                    <a
                      href={`https://goerli.etherscan.io/address/${task.owner}`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {task.owner.slice(0, 6)}...
                      {task.owner.slice(-4)}
                    </a>
                  </p>
                )}
                <p className={`text${task.stateID === 1 ? " completed" : ""}`}>
                  {task.text}
                </p>
                {doesExpire(task) && (
                  <p className="expiration">
                    <img alt="alarm" src={alarm} />{" "}
                    {moment(
                      new Date(task.expiresAtSeconds * 1000),
                      "YYYY-MM-DDTHH:mm:ssZ"
                    )
                      .fromNow()
                      .includes("ago")
                      ? "Expired"
                      : "Expires"}{" "}
                    {moment(
                      new Date(task.expiresAtSeconds * 1000),
                      "YYYY-MM-DDTHH:mm:ssZ"
                    ).fromNow()}
                  </p>
                )}
              </div>
              <div className="actions">
                {accounts?.[0]?.toLowerCase?.() ===
                  task.owner?.toLowerCase() && (
                  <>
                    <img
                      alt="checkmark"
                      className={
                        task.stateID === 1 ? "completed" : "not-completed"
                      }
                      onClick={onComplete(task)}
                      role="button"
                      src={task.stateID === 1 ? checkmark : unchecked}
                    />
                    <img
                      alt="trash"
                      onClick={onDelete(task)}
                      role="button"
                      src={trash}
                    />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
};

Tasks.propTypes = {
  accounts: PropTypes.array,
  page: PropTypes.string.isRequired,
  setTasks: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default Tasks;
