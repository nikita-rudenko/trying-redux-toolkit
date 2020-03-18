import {
  createSlice,
  configureStore,
  getDefaultMiddleware,
  PayloadAction
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { v1 as uuid } from "uuid";

import { Todo } from "./type";

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false
  }
];

const todosSlice = createSlice({
  name: "todos",
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        {
          payload
        }: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false
        }
      })
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todoToEdit = state.find(todo => todo.id === payload.id);

      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }
    },
    toggle: (
      state,
      { payload }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const todoToToggle = state.find(todo => todo.id === payload.id);

      if (todoToToggle) {
        todoToToggle.isComplete = payload.isComplete;
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(todo => todo.id === payload.id);

      if (index !== 1) {
        state.splice(index, 1);
      }
    }
  }
});

const selectedTodoSlice = createSlice({
  name: "selectedTodo",
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id
  }
});

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: state => state + 1,
    [todosSlice.actions.edit.type]: state => state + 1,
    [todosSlice.actions.remove.type]: state => state + 1,
    [todosSlice.actions.toggle.type]: state => state + 1
  }
});

// const reducer = combineReducers({
//   todos: todosSlice.reducer,
//   selected: selectedTodosSlice.reducer,
//   counter: counterSlice.reducer
// })

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer
};

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: removeTodoActionCreator
} = todosSlice.actions;
export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const middleware = [...getDefaultMiddleware(), logger];

export default configureStore({
  reducer,
  middleware
  // devTools: process.env.NODE_ENV !== 'production'
});
