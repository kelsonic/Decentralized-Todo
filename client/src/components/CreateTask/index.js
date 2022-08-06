// Node modules.
import PropTypes from "prop-types";
import moment from "moment";
import { ethers } from "ethers";
import { useState } from "react";
// Relative imports.
import TASK_CONTRACT from "../../contracts/TaskContract.json";
import categoryImages from "../Tasks/CATEGORY_IMAGES";
import { TASKS } from "../App/PAGES";
import { TASK_CONTRACT_ADDRESS } from "../../contracts";
import { Wrapper } from "./styles";
import { formatTasks } from "../../utils";

const categoryNames = ["General", "Programming", "Design", "Marketing"];

const CreateTask = ({ accounts, setPage, setTasks }) => {
  // Derive the state we need.
  const [category, setCategory] = useState(0);
  const [dayFilter, setDayFilter] = useState("today");
  const [text, setText] = useState("");

  const deriveExpiresAt = () => {
    switch (dayFilter) {
      case "today":
        return moment().endOf("day").unix();
      case "tomorrow":
        return moment().endOf("day").add(1, "day").unix();
      default:
        return moment().endOf("day").add(100, "years").unix();
    }
  };

  const createTask = async (event) => {
    event.preventDefault();

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

      // Derive the expiresAtSeconds.
      const expiresAtSeconds = deriveExpiresAt();

      // Create the task.
      await TaskContract.addTask(text, category, expiresAtSeconds);

      // Get raw tasks.
      const rawTasks = await TaskContract.getTasks();

      // Optimistically update the tasks.
      setTasks((tasks) =>
        formatTasks([
          ...tasks,
          {
            id: rawTasks?.length,
            text,
            categoryID: category,
            expiresAtSeconds,
            stateID: 0,
            owner: accounts[0],
          },
        ])
      );

      // Reset the form.
      setText("");
      setCategory(0);
      setDayFilter("today");

      // Redirect back to the Tasks page.
      setPage(TASKS);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper onSubmit={createTask}>
      <h1>New Task</h1>

      <label>What do you need to get done?</label>
      <textarea
        autoFocus
        onChange={(event) => setText(event.target.value)}
        value={text}
      />

      <label>Select a Category</label>
      <ul>
        {categoryNames.map((categoryName, index) => (
          <li
            className={index === category ? "selected" : ""}
            key={categoryName}
          >
            <img
              alt={categoryName}
              onClick={() => setCategory(index)}
              role="button"
              src={categoryImages[index]}
            />
            <p>{categoryName}</p>
          </li>
        ))}
      </ul>

      <label>When do you need it done by?</label>
      <ul className="expires">
        <li
          className={dayFilter === "today" ? "selected" : ""}
          onClick={() => setDayFilter("today")}
          role="button"
        >
          Today
        </li>
        <li
          className={dayFilter === "tomorrow" ? "selected" : ""}
          onClick={() => setDayFilter("tomorrow")}
          role="button"
        >
          Tomorrow
        </li>
        <li
          className={dayFilter === "all" ? "selected" : ""}
          onClick={() => setDayFilter("all")}
          role="button"
        >
          Whenever
        </li>
      </ul>

      <button onClick={createTask} type="submit">
        Create Task
      </button>
    </Wrapper>
  );
};

CreateTask.propTypes = {
  accounts: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default CreateTask;
