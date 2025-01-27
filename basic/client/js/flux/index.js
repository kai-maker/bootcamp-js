/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */
const ADD_TODO_ACTION_TYPE = "Add todo to server";
export const createAddTodoAction = (todoName) => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: todoName
});

const UPDATE_TODO_ACTION_TYPE = "Update todo on server";
export const createUpdateTodoAction = (id, name, done) => ({
  type: UPDATE_TODO_ACTION_TYPE,
  payload: {id, name, done}
});

const DELETE_TODO_ACTION_TYPE = "Delete todo from server";
export const createDeleteTodoAction = (id) => ({
  type: DELETE_TODO_ACTION_TYPE,
  payload: id
})

const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";
export const createFetchTodoListAction = () => ({
  type: FETCH_TODO_ACTION_TYPE,
  paylaod: undefined,
});

const CLEAR_ERROR = "Clear error from state";
export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: undefined,
});

/**
 * Store Creator
 */
const api = "http://localhost:3000/todo";

const defaultState = {
  todoList: [],
  error: null,
};

const headers = {
  "Content-Type": "application/json; charset=utf-8",
};

const reducer = async (prevState, { type, payload }) => {
  switch (type) {
    case ADD_TODO_ACTION_TYPE: {
      console.log("ADD_TODO");
      let newTodoList = [];
      for (const todo of prevState.todoList) {
        newTodoList.push(todo);
      }
      newTodoList.push({id: newTodoList.length, name: payload, done: false});

      const response = await fetch('http://localhost:3000/todo', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: payload, done: false})
      });

      return { ...prevState, todoList: newTodoList, error: null };
    }

    case UPDATE_TODO_ACTION_TYPE: {
      console.log('UPDATE_TODO');
      let newTodoList = [];
      for (const todo of prevState.todoList) {
        newTodoList.push(todo);
      }
      const updateTodo = newTodoList.find(x => x.id == payload.id);
      updateTodo.done = payload.done;

      const response = await fetch(`http://localhost:3000/todo/${payload.id}`, {
        method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: payload.name, done: payload.done})
      });

      return { ...prevState, todoList: newTodoList, error: null };
    }

    case DELETE_TODO_ACTION_TYPE: {
      console.log('DELETE_TODO');
      try {
        const response = await fetch(`http://localhost:3000/todo/${payload}`, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      });
        const resp = await fetch(api).then((d) => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }

    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then((d) => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error("unexpected action type: %o", { type, payload });
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async ({ type, payload }) => {
    console.group(type);
    console.log("prev", state);
    state = await reducer(state, { type, payload });
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe,
  };
}
