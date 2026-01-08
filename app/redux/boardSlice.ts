// src/store/boardSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, Task, Column } from "@/types";
import { v4 as uuidv4 } from "uuid";

const initialState: Board = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Setup Project Repository",
      description: "Initialize the project with Next.js and TypeScript",
      priority: "high",
      createdAt: new Date().toISOString(),
    },
    "task-2": {
      id: "task-2",
      title: "Design UI Components",
      description: "Create reusable components for the task board",
      priority: "medium",
      createdAt: new Date().toISOString(),
    },
    "task-3": {
      id: "task-3",
      title: "Implement Redux Store",
      description: "Setup Redux Toolkit for state management",
      priority: "high",
      createdAt: new Date().toISOString(),
    },
    "task-4": {
      id: "task-4",
      title: "Write Documentation",
      description: "Create README and API documentation",
      priority: "low",
      createdAt: new Date().toISOString(),
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["task-4"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{
        columnId: string;
        task: Omit<Task, "id" | "createdAt">;
      }>
    ) => {
      const taskId = uuidv4();
      const newTask: Task = {
        ...action.payload.task,
        id: taskId,
        createdAt: new Date().toISOString(),
      };
      state.tasks[taskId] = newTask;
      state.columns[action.payload.columnId].taskIds.push(taskId);
    },

    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; updates: Partial<Task> }>
    ) => {
      const { taskId, updates } = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId] = { ...state.tasks[taskId], ...updates };
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      delete state.tasks[taskId];

      Object.values(state.columns).forEach((column) => {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      });
    },

    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        sourceColumnId: string;
        destColumnId: string;
        sourceIndex: number;
        destIndex: number;
      }>
    ) => {
      const { taskId, sourceColumnId, destColumnId, sourceIndex, destIndex } =
        action.payload;

      state.columns[sourceColumnId].taskIds.splice(sourceIndex, 1);
      state.columns[destColumnId].taskIds.splice(destIndex, 0, taskId);
    },

    reorderTask: (
      state,
      action: PayloadAction<{
        columnId: string;
        sourceIndex: number;
        destIndex: number;
      }>
    ) => {
      const { columnId, sourceIndex, destIndex } = action.payload;
      const column = state.columns[columnId];
      const [removed] = column.taskIds.splice(sourceIndex, 1);
      column.taskIds.splice(destIndex, 0, removed);
    },

    addColumn: (state, action: PayloadAction<string>) => {
      const columnId = uuidv4();
      const newColumn: Column = {
        id: columnId,
        title: action.payload,
        taskIds: [],
      };
      state.columns[columnId] = newColumn;
      state.columnOrder.push(columnId);
    },

    updateColumn: (
      state,
      action: PayloadAction<{ columnId: string; title: string }>
    ) => {
      const { columnId, title } = action.payload;
      if (state.columns[columnId]) {
        state.columns[columnId].title = title;
      }
    },

    deleteColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;

      state.columns[columnId].taskIds.forEach((taskId) => {
        delete state.tasks[taskId];
      });

      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTask,
  addColumn,
  updateColumn,
  deleteColumn,
} = boardSlice.actions;

export default boardSlice.reducer;
