// Node modules.
import orderBy from "lodash/orderBy";

const formatCategory = (category) => {
  if (typeof category === "string") {
    return category;
  }

  switch (category) {
    case 0:
      return "GENERAL";
    case 1:
      return "PROGRAMMING";
    case 2:
      return "DESIGN";
    case 3:
      return "MARKETING";
    default:
      return "UNKNOWN";
  }
};

const formatState = (state) => {
  if (typeof state === "string") {
    return state;
  }

  switch (state) {
    case 0:
      return "ACTIVE";
    case 1:
      return "COMPLETED";
    case 2:
      return "DELETED";
    default:
      return "UNKNOWN";
  }
};

export const formatTasks = (tasks) => {
  // Format the tasks.
  const formattedTasks = tasks?.map((task) => ({
    category: formatCategory(task?.category),
    categoryID:
      typeof task?.category === "number" ? task?.category : task?.categoryID,
    expiresAtSeconds:
      task?.expiresAtSeconds?.toNumber?.() || task?.expiresAtSeconds,
    id: task?.id?.toNumber?.() || task?.id,
    owner: task?.owner,
    state: formatState(task?.state),
    stateID: typeof task?.state === "number" ? task?.state : task?.stateID,
    text: task?.text,
  }));

  // Filter out deleted tasks.
  const filteredTasks =
    formattedTasks?.filter((task) => task?.stateID !== 2) || [];

  // Order the tasks.
  const orderedTasks = orderBy(filteredTasks, ["expiresAtSeconds"], ["asc"]);

  // Return the tasks.
  return orderedTasks;
};
