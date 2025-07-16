import mockTasks from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem("taskflow_tasks");
    return stored ? JSON.parse(stored) : [...mockTasks];
  }

  saveToStorage() {
    localStorage.setItem("taskflow_tasks", JSON.stringify(this.tasks));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.tasks]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const task = this.tasks.find(item => item.Id === parseInt(id));
        if (task) {
          resolve({ ...task });
        } else {
          reject(new Error("Task not found"));
        }
      }, 200);
    });
  }

  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...taskData,
          Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
          createdAt: new Date().toISOString(),
          order: this.tasks.length + 1
        };
        
        this.tasks.push(newTask);
        this.saveToStorage();
        resolve({ ...newTask });
      }, 400);
    });
  }

  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...taskData };
          this.saveToStorage();
          resolve({ ...this.tasks[index] });
        } else {
          reject(new Error("Task not found"));
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.tasks.splice(index, 1);
          this.saveToStorage();
          resolve();
        } else {
          reject(new Error("Task not found"));
        }
      }, 300);
    });
  }

  async getByListId(listId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredTasks = this.tasks.filter(task => task.listId === listId);
        resolve([...filteredTasks]);
      }, 250);
    });
  }

  async toggleComplete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          const task = this.tasks[index];
          task.completed = !task.completed;
          task.completedAt = task.completed ? new Date().toISOString() : null;
          this.saveToStorage();
          resolve({ ...task });
        } else {
          reject(new Error("Task not found"));
        }
      }, 200);
    });
  }
}

export default new TaskService();