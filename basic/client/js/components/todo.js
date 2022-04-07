import { createUpdateTodoAction, createDeleteTodoAction } from "../flux/index.js";
import store from "../store.js";

class Todo {
  constructor(parent, { id, name, done }) {
    this.parent = parent;
    this.props = { id, name, done };
    this.mounted = false;
  }

  mount() {
    if (this.mounted) return;
    // TODO: ここにTODOの削除ボタンが押されたときの処理を追記
    // TODO: ここにTODOのチェックボックスが押されたときの処理を追記
    const removeButton = this.element.getElementsByClassName('todo-remove-button')[0];
    const checkmark = this.element.getElementsByClassName('todo-toggle__checkmark')[0];
    //const name = this.element.getElementsByClassName('todo-name')[0].innerHTML;

    checkmark.addEventListener('click', (event) => {
      console.log(this.props.name);
      const updateTodoAction = createUpdateTodoAction(this.props.id, this.props.name, !this.props.done); //Doneを反転
      console.log(updateTodoAction);
      store.dispatch(updateTodoAction);
    }, false);

    removeButton.addEventListener('click', (event) => {
      const deleteTodoAction = createDeleteTodoAction(this.props.id);
      store.dispatch(deleteTodoAction);
    });

    //removeButton

    this.mounted = true;
  }

  render() {
    const { id, name, done } = this.props;
    const next = document.createElement("li");
    next.className = "todo-item";
    next.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done ? "checked" : ""}
        />
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${name}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `;
    if (!this.element) {
      this.parent.appendChild(next);
    } else {
      this.parent.replaceChild(this.element, next);
    }
    this.element = next;
    this.mount();
  }
}

export default Todo;
