import mockLists from "@/services/mockData/lists.json";
import taskService from "./taskService";

class ListService {
  constructor() {
    this.lists = this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem("taskflow_lists");
    return stored ? JSON.parse(stored) : [...mockLists];
  }

  saveToStorage() {
    localStorage.setItem("taskflow_lists", JSON.stringify(this.lists));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Update task counts
        const tasks = await taskService.getAll();
        const updatedLists = this.lists.map(list => ({
          ...list,
          taskCount: tasks.filter(task => task.listId === list.Id.toString() && !task.completed).length
        }));
        
        this.lists = updatedLists;
        this.saveToStorage();
        resolve([...this.lists]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = this.lists.find(item => item.Id === parseInt(id));
        if (list) {
          resolve({ ...list });
        } else {
          reject(new Error("List not found"));
        }
      }, 200);
    });
  }

  async create(listData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newList = {
          ...listData,
          Id: Math.max(...this.lists.map(l => l.Id), 0) + 1,
          taskCount: 0,
          order: this.lists.length + 1
        };
        
        this.lists.push(newList);
        this.saveToStorage();
        resolve({ ...newList });
      }, 400);
    });
  }

  async update(id, listData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.lists.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.lists[index] = { ...this.lists[index], ...listData };
          this.saveToStorage();
          resolve({ ...this.lists[index] });
        } else {
          reject(new Error("List not found"));
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.lists.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.lists.splice(index, 1);
          this.saveToStorage();
          resolve();
        } else {
          reject(new Error("List not found"));
        }
      }, 300);
    });
  }
}

export default new ListService();