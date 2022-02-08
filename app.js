'use strict'

let currentTodos = [
    {id: 1, title: 'HTML', completed: true},
    {id: 2, title: 'CSS', completed: true},
    {id: 3, title: 'JavaScript', completed: true},
    {id: 4, title: 'TypeScript', completed: false},
    {id: 5, title: 'React/Redux', completed: false},
]

const root = document.querySelector('.todoapp');

const newTodoField = root.querySelector('.new-todo');
const itemList = root.querySelector('.todo-list');
const allToggler = root.querySelector('.toggle-all');
const clearCompletedButton = root.querySelector('.clear-completed');
const filter = root.querySelector('.filters');

function todoInit() {
    itemList.innerHTML = `
        ${currentTodos.map(todo => `
            <li 
                class="todo-item ${todo.completed ? 'completed' : ''}"
                data-todo-id="${todo.id}"
            >
                <input
                    id="todo-${todo.id}"
                    class="toggle" 
                    type="checkbox"
                    ${todo.completed ? 'checked' : ''}
                >
                <label for="todo-${todo.id}">${todo.title}</label>
                <button class="destroy"></button>
                </li>
        `).join('')}
    `;

    updateInfo();
}

todoInit(currentTodos)

function updateInfo() {
    const completedTogglers = document.querySelectorAll('.toggle:checked');
    const activeTogglers = document.querySelectorAll('.toggle:not(:checked)');
    const counter = root.querySelector('.todo-count');
    const footer = root.querySelector('.footer');
    const toggleAllWrapper = root.querySelector('.toggle-all-wrapper')

    counter.innerHTML = `${activeTogglers.length} items left`;
    allToggler.checked = activeTogglers.length === 0;
    clearCompletedButton.hidden = completedTogglers.length === 0;

    const hasTodos = completedTogglers.length > 0 || activeTogglers.length > 0;
    toggleAllWrapper.hidden = !hasTodos;
    footer.hidden = !hasTodos;
    counter.hidden = activeTogglers.length === 0;

    console.log(currentTodos);
}

// Add todo
newTodoField.addEventListener('keydown', event => {
    if (event.code !== 'Enter') {
        return;
    }

    if (!newTodoField.value) {
        return;
    }

    const id = +new Date();
    currentTodos.push({
        id: id,
        title: newTodoField.value,
        completed: false,
    });

    todoInit();

    newTodoField.value = '';

    updateInfo();
});

// Remove todo
itemList.addEventListener('click', event => {
    if (!event.target.matches('.destroy')) {
        return;
    }

    const item = event.target.closest('.todo-item');
    currentTodos = currentTodos.filter(todo => todo.id !== +item.dataset.todoId);

    todoInit();
    updateInfo();
}) 

// Toggle todo status
itemList.addEventListener('change', event => {
    if (!event.target.matches('.toggle')) {
        return;
    };

    const item = event.target.closest('.todo-item');
    const selectedTodo = currentTodos.find(todo => todo.id === +item.dataset.todoId);
    selectedTodo.completed = event.target.checked;

    todoInit();
    updateInfo();
}) 

// Filter todos
filter.addEventListener('click', event => {
    if (!event.target.dataset.filter) {
        return;
    }

    const filterButtons = filter.querySelectorAll('[data-filter]');

    filterButtons.forEach(button => {
        button.classList.toggle('selected', event.target === button);
    });

    const togglers = root.querySelectorAll('.toggle');

    togglers.forEach(toggler => {
        const item = toggler.closest('.todo-item');

        switch (event.target.dataset.filter) {
            case 'all':
                item.hidden = false;
                break;
            case 'active':
                item.hidden = toggler.checked;
                break;
            case 'completed':
                item.hidden = !toggler.checked;
                break;
        }
    })
})

// Clear completed
clearCompletedButton.addEventListener('click', () => {
    currentTodos = currentTodos.filter(todo => !todo.completed);

    todoInit();
    updateInfo();
})

// Toggle all
allToggler.addEventListener('change', () => { 
    currentTodos.forEach(todo => {
        todo.completed = allToggler.checked;
    })

    todoInit();
    updateInfo();
})