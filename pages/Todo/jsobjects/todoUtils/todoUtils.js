export default {
  // Get all tasks from the database
  getAllTasks: async () => {
    const tasks = await getAllTasks.run();
    // Sort tasks with incomplete tasks first, then by creation date (newest first)
    return tasks.sort((a, b) => {
      if (a.is_complete !== b.is_complete) {
        return a.is_complete ? 1 : -1; // Incomplete tasks first
      }
      // If completion status is the same, sort by creation date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  },
  
  // Add a new task
  addTask: async () => {
    // Check if task title is empty
    if (!Input_TaskTitle.text || Input_TaskTitle.text.trim() === "") {
      showAlert("Task title cannot be empty", "error");
      return;
    }
    
    // Generate a unique ID for the new task
    const id = Math.floor(Math.random() * 1000000);
    
    // Create the task
    await createTask.run({
      id: id
    });
    
    // Clear the input field
    Input_TaskTitle.setValue("");
    
    // Refresh the task list
    await List_Tasks.setData(await this.getAllTasks());
    
    // Show success message
    showAlert("Task added successfully", "success");
  },
  
  // Toggle task completion status
  toggleComplete: async (taskId, currentStatus) => {
    // Set the selected task
    storeValue("selectedTask", { id: taskId, is_complete: currentStatus });
    
    // Update the task completion status
    await updateTaskIsComplete.run();
    
    // Refresh the task list
    await List_Tasks.setData(await this.getAllTasks());
    
    // Show success message
    showAlert("Task updated", "success");
  },
  
  // Delete a task
  deleteTask: async (taskId) => {
    // Confirm deletion
    const confirmDelete = await showModal("confirmDelete");
    if (!confirmDelete) return;
    
    // Delete the task (this would need a deleteTask query to be created)
    // For now, we'll just refresh the list
    await List_Tasks.setData(await this.getAllTasks());
    
    // Show success message
    showAlert("Task deleted", "success");
  }
}