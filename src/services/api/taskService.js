import { toast } from "react-toastify";

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completedAt_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "listId_c" } }
        ],
        orderBy: [
          { fieldName: "order_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.dueDate_c,
        completed: task.completed_c === 'true' || task.completed_c === true,
        completedAt: task.completedAt_c,
        listId: task.listId_c?.toString() || '',
        createdAt: task.createdAt_c,
        order: task.order_c || 0,
        tags: task.Tags || '',
        owner: task.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completedAt_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "listId_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.dueDate_c,
        completed: task.completed_c === 'true' || task.completed_c === true,
        completedAt: task.completedAt_c,
        listId: task.listId_c?.toString() || '',
        createdAt: task.createdAt_c,
        order: task.order_c || 0,
        tags: task.Tags || '',
        owner: task.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title,
          Tags: taskData.tags || '',
          title_c: taskData.title,
          description_c: taskData.description || '',
          priority_c: taskData.priority || 'medium',
          dueDate_c: taskData.dueDate || null,
          completed_c: taskData.completed ? 'true' : 'false',
          completedAt_c: taskData.completedAt || null,
          createdAt_c: taskData.createdAt || new Date().toISOString(),
          order_c: taskData.order || 0,
          listId_c: parseInt(taskData.listId) || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || '',
            description: task.description_c || '',
            priority: task.priority_c || 'medium',
            dueDate: task.dueDate_c,
            completed: task.completed_c === 'true' || task.completed_c === true,
            completedAt: task.completedAt_c,
            listId: task.listId_c?.toString() || '',
            createdAt: task.createdAt_c,
            order: task.order_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
      }
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (taskData.title !== undefined) updateData.title_c = taskData.title;
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) updateData.dueDate_c = taskData.dueDate;
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed ? 'true' : 'false';
      if (taskData.completedAt !== undefined) updateData.completedAt_c = taskData.completedAt;
      if (taskData.listId !== undefined) updateData.listId_c = parseInt(taskData.listId);
      if (taskData.order !== undefined) updateData.order_c = taskData.order;
      if (taskData.tags !== undefined) updateData.Tags = taskData.tags;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            Id: task.Id,
            title: task.title_c || '',
            description: task.description_c || '',
            priority: task.priority_c || 'medium',
            dueDate: task.dueDate_c,
            completed: task.completed_c === 'true' || task.completed_c === true,
            completedAt: task.completedAt_c,
            listId: task.listId_c?.toString() || '',
            createdAt: task.createdAt_c,
            order: task.order_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
      }
      return false;
    }
  }

  async getByListId(listId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completedAt_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "listId_c" } }
        ],
        where: [
          {
            FieldName: "listId_c",
            Operator: "EqualTo",
            Values: [parseInt(listId)]
          }
        ],
        orderBy: [
          { fieldName: "order_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        dueDate: task.dueDate_c,
        completed: task.completed_c === 'true' || task.completed_c === true,
        completedAt: task.completedAt_c,
        listId: task.listId_c?.toString() || '',
        createdAt: task.createdAt_c,
        order: task.order_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by list ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks by list ID:", error.message);
      }
      return [];
    }
  }

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      if (!task) return null;

      const updatedTask = {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      };

      return await this.update(id, updatedTask);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling task completion:", error?.response?.data?.message);
      } else {
        console.error("Error toggling task completion:", error.message);
      }
      return null;
    }
  }
}

export default new TaskService();