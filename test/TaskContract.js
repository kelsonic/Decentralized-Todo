// Node modules.
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task Contract", function () {
  // Create some variables we will manipulate in our tests.
  let owner;
  let TaskContract;
  let taskContract;
  let tasks;
  let account1;
  let defaultCategory = 0;
  let defaultExpiresAtSeconds = Math.floor(Date.now() / 1000) + 60 * 5;

  // Create constants.
  const NUM_TOTAL_TASKS = 5;

  beforeEach(async function () {
    // Deploy the Task contract.
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner, account1] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    // Reset our list of tasks.
    tasks = [];

    // Create some tasks.
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      const taskText = `Task number: ${i}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );
      tasks.push(taskText);
    }
  });

  describe("Add Task", function () {
    it("should emit AddTask event", async function () {
      // Setup.
      const taskText = "test";
      const emittedTask = {
        id: tasks.length,
        owner: owner.address,
        state: 0,
        category: defaultCategory,
        expiresAtSeconds: defaultExpiresAtSeconds,
        text: taskText,
      };

      // Assertions.
      await expect(
        await taskContract.addTask(
          taskText,
          defaultCategory,
          defaultExpiresAtSeconds
        )
      )
        .to.emit(taskContract, "AddTask")
        .withArgs(
          emittedTask.id,
          emittedTask.owner,
          emittedTask.text,
          emittedTask.category,
          emittedTask.expiresAtSeconds,
          emittedTask.state
        );
    });

    it("should not allow a bad category", async function () {
      // Setup.
      const category = 10;
      const taskText = "test";

      // Assertions.
      await expect(
        taskContract.addTask(taskText, category, defaultExpiresAtSeconds)
      ).to.be.rejectedWith(
        "Transaction reverted: function was called with incorrect parameters"
      );
    });

    it("should not allow an expiresAtSeconds in the past", async function () {
      // Setup.
      const expiresAtSeconds = Math.floor(Date.now() / 1000) - 60 * 5;
      const taskText = "test";

      // Assertions.
      await expect(
        taskContract.addTask(taskText, defaultCategory, expiresAtSeconds)
      ).to.be.rejectedWith("Task must expire in the future.");
    });
  });

  describe("Complete Task", function () {
    it("should emit CompleteTask event", async function () {
      // Setup.
      const emittedTask = {
        id: tasks.length - 1,
        owner: owner.address,
        state: 1,
        text: `Task number: ${tasks.length - 1}`,
        category: defaultCategory,
        expiresAtSeconds: defaultExpiresAtSeconds,
      };

      // Assertions.
      await expect(await taskContract.completeTask(emittedTask.id))
        .to.emit(taskContract, "CompleteTask")
        .withArgs(
          emittedTask.id,
          emittedTask.owner,
          emittedTask.text,
          emittedTask.category,
          emittedTask.expiresAtSeconds,
          emittedTask.state
        );
    });

    it("should only complete non-COMPLETED tasks", async function () {
      // Setup.
      const taskId = tasks.length - 1;
      const taskText = `Task number: ${taskId}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );
      await taskContract.completeTask(taskId);

      // Assertions.
      await expect(taskContract.completeTask(taskId)).to.be.revertedWith(
        "Task was already completed."
      );
    });

    it("should only complete tasks owned by the caller", async function () {
      // Setup.
      const taskId = tasks.length - 1;
      const taskText = `Task number: ${taskId}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );

      // Assertions.
      await expect(
        taskContract
          .connect(account1)
          .completeTask(taskId, { from: account1.address })
      ).to.be.revertedWith("Only the owner can complete a task.");
    });
  });

  describe("Delete Task", function () {
    it("should emit DeleteTask event", async function () {
      // Setup.
      const emittedTask = {
        id: tasks.length - 1,
        owner: owner.address,
        state: 2,
        text: `Task number: ${tasks.length - 1}`,
        category: defaultCategory,
        expiresAtSeconds: defaultExpiresAtSeconds,
      };

      // Assertions.
      await expect(await taskContract.deleteTask(emittedTask.id))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(
          emittedTask.id,
          emittedTask.owner,
          emittedTask.text,
          emittedTask.category,
          emittedTask.expiresAtSeconds,
          emittedTask.state
        );
    });

    it("should only delete non-DELETED tasks", async function () {
      // Setup.
      const taskId = tasks.length - 1;
      const taskText = `Task number: ${taskId}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );
      await taskContract.deleteTask(taskId);

      // Assertions.
      await expect(taskContract.deleteTask(taskId)).to.be.revertedWith(
        "Task was already deleted."
      );
    });

    it("should only delete tasks owned by the caller", async function () {
      // Setup.
      const taskId = tasks.length - 1;
      const taskText = `Task number: ${taskId}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );

      // Assertions.
      await expect(
        taskContract
          .connect(account1)
          .deleteTask(taskId, { from: account1.address })
      ).to.be.revertedWith("Only the owner can delete a task.");
    });
  });

  describe("Update Task", function () {
    it("should emit UpdateTask event", async function () {
      // Setup.
      const newTaskText = "test";
      const emittedTask = {
        id: tasks.length - 1,
        owner: owner.address,
        state: 0,
        text: `Task number: ${tasks.length - 1}`,
        category: defaultCategory,
        expiresAtSeconds: defaultExpiresAtSeconds,
      };

      // Assertions.
      await expect(await taskContract.updateTask(emittedTask.id, newTaskText))
        .to.emit(taskContract, "UpdateTask")
        .withArgs(
          emittedTask.id,
          emittedTask.owner,
          newTaskText,
          emittedTask.category,
          emittedTask.expiresAtSeconds,
          emittedTask.state
        );
    });

    it("should only update ACTIVE tasks", async function () {
      // Setup.
      const taskId = tasks.length - 1;
      const taskText = `Task number: ${taskId}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );
      await taskContract.completeTask(taskId);
      const newTaskText = "test";

      // Assertions.
      await expect(
        taskContract.updateTask(taskId, newTaskText)
      ).to.be.revertedWith("Task is not active.");
    });

    it("should only update tasks owned by the caller", async function () {
      // Setup.
      const taskId = tasks.length - 1;
      const taskText = `Task number: ${taskId}`;
      await taskContract.addTask(
        taskText,
        defaultCategory,
        defaultExpiresAtSeconds
      );
      const newTaskText = "test";

      // Assertions.
      await expect(
        taskContract
          .connect(account1)
          .updateTask(taskId, newTaskText, { from: account1.address })
      ).to.be.revertedWith("Only the owner can update a task.");
    });
  });

  describe("Get Tasks", function () {
    it("should return all tasks", async function () {
      // Setup.
      const tasks = await taskContract.getTasks();

      // Assertions.
      expect(tasks).to.have.lengthOf(tasks.length);
    });

    it("should return expected key-value pairs for a task", async () => {
      // Setup.
      const tasks = await taskContract.getTasks();
      const task = tasks[0];

      // Assertions.
      expect(task.category).to.equal(defaultCategory);
      expect(task.expiresAtSeconds).to.equal(defaultExpiresAtSeconds);
      expect(task.id).to.equal(0);
      expect(task.owner).to.equal(owner.address);
      expect(task.state).to.equal(0);
      expect(task.text).to.equal("Task number: 0");
    });
  });
});
