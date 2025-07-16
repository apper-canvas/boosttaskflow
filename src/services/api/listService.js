import { toast } from "react-toastify";
import taskService from "./taskService";

class ListService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'list_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "taskCount_c" } }
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

      // Get tasks to calculate task counts
      const tasks = await taskService.getAll();
      
      return response.data.map(list => ({
        Id: list.Id,
        name: list.Name || '',
        color: list.color_c || '#6366F1',
        icon: list.icon_c || 'List',
        order: list.order_c || 0,
        taskCount: tasks.filter(task => task.listId === list.Id.toString() && !task.completed).length,
        tags: list.Tags || '',
        owner: list.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching lists:", error?.response?.data?.message);
      } else {
        console.error("Error fetching lists:", error.message);
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "taskCount_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const list = response.data;
      return {
        Id: list.Id,
        name: list.Name || '',
        color: list.color_c || '#6366F1',
        icon: list.icon_c || 'List',
        order: list.order_c || 0,
        taskCount: list.taskCount_c || 0,
        tags: list.Tags || '',
        owner: list.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching list with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching list with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(listData) {
    try {
      const params = {
        records: [{
          Name: listData.name,
          Tags: listData.tags || '',
          color_c: listData.color || '#6366F1',
          icon_c: listData.icon || 'List',
          order_c: listData.order || 0,
          taskCount_c: listData.taskCount || 0
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
          const list = successfulRecords[0].data;
          return {
            Id: list.Id,
            name: list.Name || '',
            color: list.color_c || '#6366F1',
            icon: list.icon_c || 'List',
            order: list.order_c || 0,
            taskCount: list.taskCount_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating list:", error?.response?.data?.message);
      } else {
        console.error("Error creating list:", error.message);
      }
      return null;
    }
  }

  async update(id, listData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (listData.name !== undefined) updateData.Name = listData.name;
      if (listData.color !== undefined) updateData.color_c = listData.color;
      if (listData.icon !== undefined) updateData.icon_c = listData.icon;
      if (listData.order !== undefined) updateData.order_c = listData.order;
      if (listData.taskCount !== undefined) updateData.taskCount_c = listData.taskCount;
      if (listData.tags !== undefined) updateData.Tags = listData.tags;

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
          const list = successfulUpdates[0].data;
          return {
            Id: list.Id,
            name: list.Name || '',
            color: list.color_c || '#6366F1',
            icon: list.icon_c || 'List',
            order: list.order_c || 0,
            taskCount: list.taskCount_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating list:", error?.response?.data?.message);
      } else {
        console.error("Error updating list:", error.message);
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
        console.error("Error deleting list:", error?.response?.data?.message);
      } else {
        console.error("Error deleting list:", error.message);
      }
      return false;
    }
  }
}

export default new ListService();