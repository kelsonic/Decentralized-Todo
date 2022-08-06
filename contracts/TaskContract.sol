// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract TaskContract {
    // DEFINE THE TYPES USED.
    // ======================
    enum Category {
        GENERAL,
        PROGRAMMING,
        DESIGN,
        MARKETING
    }
    enum State {
        ACTIVE,
        COMPLETED,
        DELETED
    }
    struct Task {
        address owner;
        string text;
        Category category;
        uint256 expiresAtSeconds;
        State state;
        uint256 id;
    }

    // DEFINE THE DATA TO TRACK.
    // =========================
    Task[] private tasks;

    // DECLARE THE EVENTS TO BE EMITTED.
    // =================================
    event AddTask(
        uint256 id,
        address owner,
        string text,
        Category category,
        uint256 expiresAtSeconds,
        State state
    );
    event CompleteTask(
        uint256 id,
        address owner,
        string text,
        Category category,
        uint256 expiresAtSeconds,
        State state
    );
    event DeleteTask(
        uint256 id,
        address owner,
        string text,
        Category category,
        uint256 expiresAtSeconds,
        State state
    );
    event UpdateTask(
        uint256 id,
        address owner,
        string text,
        Category category,
        uint256 expiresAtSeconds,
        State state
    );

    // DEFINE THE PUBLIC MUTATIVE METHODS.
    // ==========================
    function addTask(
        string memory text,
        Category category,
        uint256 expiresAtSeconds
    ) public {
        // Ensure expiresAtSeconds is in the future.
        require(
            expiresAtSeconds > block.timestamp,
            "Task must expire in the future."
        );

        // Create a new task.
        Task memory task = Task(
            msg.sender,
            text,
            category,
            expiresAtSeconds,
            State.ACTIVE,
            tasks.length
        );

        // Add the task to the list of tasks we track.
        tasks.push(task);

        // Emit the event.
        emit AddTask(
            task.id,
            task.owner,
            task.text,
            task.category,
            task.expiresAtSeconds,
            task.state
        );
    }

    function completeTask(uint256 taskID) public {
        // Check if the task is active.
        require(
            tasks[taskID].state != State.COMPLETED,
            "Task was already completed."
        );

        // Ensure the task is owned by the caller.
        require(
            msg.sender == tasks[taskID].owner,
            "Only the owner can complete a task."
        );

        // Update the task.
        tasks[taskID].state = State.COMPLETED;

        // Emit the event.
        emit CompleteTask(
            tasks[taskID].id,
            tasks[taskID].owner,
            tasks[taskID].text,
            tasks[taskID].category,
            tasks[taskID].expiresAtSeconds,
            tasks[taskID].state
        );
    }

    function deleteTask(uint256 taskID) public {
        // Check if the task exists.
        require(
            tasks[taskID].state != State.DELETED,
            "Task was already deleted."
        );

        // Check if the caller is the owner.
        require(
            msg.sender == tasks[taskID].owner,
            "Only the owner can delete a task."
        );

        // Update the task.
        tasks[taskID].state = State.DELETED;

        // Emit the event.
        emit DeleteTask(
            tasks[taskID].id,
            tasks[taskID].owner,
            tasks[taskID].text,
            tasks[taskID].category,
            tasks[taskID].expiresAtSeconds,
            tasks[taskID].state
        );
    }

    function updateTask(uint256 taskID, string memory text) public {
        // Check if the task is active.
        require(tasks[taskID].state == State.ACTIVE, "Task is not active.");

        // Check if the caller is the owner.
        require(
            msg.sender == tasks[taskID].owner,
            "Only the owner can update a task."
        );

        // Update the task.
        tasks[taskID].text = text;

        // Emit the event.
        emit UpdateTask(
            tasks[taskID].id,
            tasks[taskID].owner,
            tasks[taskID].text,
            tasks[taskID].category,
            tasks[taskID].expiresAtSeconds,
            tasks[taskID].state
        );
    }

    // DEFINE THE PUBLIC QUERY METHODS.
    // ==========================
    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }
}
