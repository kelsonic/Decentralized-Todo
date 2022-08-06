// Node modules.
import PropTypes from "prop-types";
// Relative imports.
import arrow from "../../assets/arrow.png";
import pencil from "../../assets/pencil.png";
import { TASKS, TASKS_CREATE } from "../App/PAGES";
import { Wrapper } from "./styles";

const Actions = ({ page, setPage }) => {
  return (
    <Wrapper>
      {page === TASKS && (
        <>
          <div />
          <img
            alt="create task"
            className="create-task"
            onClick={() => setPage(TASKS_CREATE)}
            role="button"
            src={pencil}
          />
        </>
      )}
      {page === TASKS_CREATE && (
        <>
          <img
            alt="back"
            className="back"
            onClick={() => setPage(TASKS)}
            role="button"
            src={arrow}
          />
          <div />
        </>
      )}
    </Wrapper>
  );
};

Actions.propTypes = {
  page: PropTypes.string.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default Actions;
