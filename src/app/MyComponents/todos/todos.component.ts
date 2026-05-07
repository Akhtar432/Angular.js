import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  newTodo = '';
  filter: 'all' | 'active' | 'completed' = 'all';

  ngOnInit() {
    this.loadTodos();
  }

  addTodo() {
    const title = this.newTodo.trim();
    if (!title) {
      return;
    }

    this.todos = [{ id: Date.now(), title, completed: false }, ...this.todos];
    this.newTodo = '';
    this.saveTodos();
  }

  toggleTodo(todo: Todo) {
    this.todos = this.todos.map((item) =>
      item.id === todo.id ? { ...item, completed: !item.completed } : item
    );
    this.saveTodos();
  }

  removeTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveTodos();
  }

  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.saveTodos();
  }

  get visibleTodos() {
    return this.todos.filter((todo) =>
      this.filter === 'all' ||
      (this.filter === 'active' && !todo.completed) ||
      (this.filter === 'completed' && todo.completed)
    );
  }

  get remaining() {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  get completedCount() {
    return this.todos.filter((todo) => todo.completed).length;
  }

  private saveTodos() {
    if (!this.canUseLocalStorage()) {
      return;
    }
    localStorage.setItem('todo-list-items', JSON.stringify(this.todos));
  }

  private loadTodos() {
    if (!this.canUseLocalStorage()) {
      return;
    }

    const stored = localStorage.getItem('todo-list-items');
    if (stored) {
      try {
        this.todos = JSON.parse(stored) ?? [];
      } catch {
        this.todos = [];
      }
    }
  }

  private canUseLocalStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
