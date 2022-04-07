import { createAddTodoAction } from "../flux/index.js";
import store from "../store.js";

class TodoForm {
  constructor() {
    this.button = document.querySelector(".todo-form__submit");
    this.form = document.querySelector(".todo-form__input");

    this.button.addEventListener('click', (event)=>{
      event.preventDefault();
      console.log('clicked!');
      const todoName = this.form.value;
      const addTodoAction = createAddTodoAction(todoName);
      console.log(addTodoAction);
      store.dispatch(addTodoAction);
    }, false);

    
  }

  mount() {
    // TODO:
    // ここに 作成ボタンが押されたら todo を作成するような処理を追記する
  }
}

export default TodoForm;
