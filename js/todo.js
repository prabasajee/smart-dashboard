/**
 * To-Do List module for Smart Dashboard
 * Handles task management with localStorage persistence
 * Developer 2 (Your Friend) - To-Do List Functionality
 */

class TodoManager {
    constructor() {
        this.todos = [];
        this.storageKey = 'smartDashboard_todos';
        this.todoInput = null;
        this.todoList = null;
        this.addButton = null;
        
        this.init();
    }

    init() {
        console.log('✅ Todo Manager initialized!');
        this.bindElements();
        this.loadTodos();
        this.bindEvents();
        this.renderTodos();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.addButton = document.getElementById('addTodoBtn');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.addButton) {
            this.addButton.addEventListener('click', () => this.addTodo());
        }

        if (this.todoInput) {
            this.todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTodo();
                }
            });
        }
    }

    /**
     * Load todos from localStorage
     */
    loadTodos() {
        try {
            const savedTodos = localStorage.getItem(this.storageKey);
            if (savedTodos) {
                this.todos = JSON.parse(savedTodos);
            }
        } catch (error) {
            console.error('Error loading todos:', error);
            this.todos = [];
        }
    }

    /**
     * Save todos to localStorage
     */
    saveTodos() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    }

    /**
     * Add a new todo
     */
    addTodo() {
        if (!this.todoInput) return;

        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo); // Add to beginning of array
        this.saveTodos();
        this.renderTodos();
        this.todoInput.value = '';
        this.todoInput.focus();

        console.log('✅ Todo added:', text);
    }

    /**
     * Toggle todo completion status
     * @param {string} id - Todo ID
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
            console.log('🔄 Todo toggled:', todo.text);
        }
    }

    /**
     * Delete a todo
     * @param {string} id - Todo ID
     */
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodos();
        console.log('🗑️ Todo deleted');
    }

    /**
     * Edit a todo
     * @param {string} id - Todo ID
     * @param {string} newText - New todo text
     */
    editTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo && newText.trim()) {
            todo.text = newText.trim();
            this.saveTodos();
            this.renderTodos();
            console.log('✏️ Todo edited:', newText);
        }
    }

    /**
     * Render todos in the DOM
     */
    renderTodos() {
        if (!this.todoList) return;

        this.todoList.innerHTML = '';

        if (this.todos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'todo-empty';
            emptyMessage.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks yet. Add one above!</p>
                </div>
            `;
            this.todoList.appendChild(emptyMessage);
            return;
        }

        this.todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            this.todoList.appendChild(todoItem);
        });
    }

    /**
     * Create a todo DOM element
     * @param {Object} todo - Todo object
     * @returns {HTMLElement} - Todo list item element
     */
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);

        li.innerHTML = `
            <div class="todo-content">
                <button class="todo-toggle" onclick="window.todoManager.toggleTodo('${todo.id}')">
                    <i class="fas ${todo.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <span class="todo-text" ${!todo.completed ? 'ondblclick="window.todoManager.startEdit(this)"' : ''}>
                    ${this.escapeHtml(todo.text)}
                </span>
                <button class="todo-delete" onclick="window.todoManager.deleteTodo('${todo.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return li;
    }

    /**
     * Start editing a todo
     * @param {HTMLElement} textElement - Todo text element
     */
    startEdit(textElement) {
        const todoItem = textElement.closest('.todo-item');
        const id = todoItem.getAttribute('data-id');
        const currentText = textElement.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'todo-edit-input';

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.editTodo(id, newText);
            } else {
                this.renderTodos();
            }
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });

        input.addEventListener('blur', saveEdit);

        textElement.replaceWith(input);
        input.focus();
        input.select();
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get todo statistics
     * @returns {Object} - Todo statistics
     */
    getStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.renderTodos();
        console.log('🗑️ Completed todos cleared');
    }

    /**
     * Export todos as JSON
     * @returns {string} - JSON string of todos
     */
    exportTodos() {
        return JSON.stringify(this.todos, null, 2);
    }

    /**
     * Import todos from JSON
     * @param {string} jsonString - JSON string of todos
     */
    importTodos(jsonString) {
        try {
            const importedTodos = JSON.parse(jsonString);
            if (Array.isArray(importedTodos)) {
                this.todos = importedTodos;
                this.saveTodos();
                this.renderTodos();
                console.log('📥 Todos imported successfully');
            }
        } catch (error) {
            console.error('Error importing todos:', error);
        }
    }
}

// Initialize todo manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.todoManager = new TodoManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoManager;
}
