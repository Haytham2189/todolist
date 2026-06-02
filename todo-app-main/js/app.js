const form = document.querySelector(".todo-form");
const input = document.querySelector("#todo-input");
const todoContainer = document.querySelector("#todos-container");
const itemsLeft = document.querySelector("#items-left");

const filterButtons = document.querySelectorAll(".filter-btn");
const clearBtn = document.querySelector(".clear-btn");

const themeButton = document.querySelector(".theme-toggle");
const themeIcon = themeButton.querySelector("img");

const todos =
  JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";
let draggedTodoId = null;

/* ====================
   STORAGE
==================== */

function saveTodos() {
  localStorage.setItem(
    "todos",
    JSON.stringify(todos)
  );
}

/* ====================
   THEME
==================== */

function loadTheme() {
  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeIcon.src =
      "./images/icon-moon.svg";
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");

  const isLight =
    document.body.classList.contains("light");

  if (isLight) {
    themeIcon.src =
      "./images/icon-moon.svg";

    localStorage.setItem(
      "theme",
      "light"
    );
  } else {
    themeIcon.src =
      "./images/icon-sun.svg";

    localStorage.setItem(
      "theme",
      "dark"
    );
  }
}

/* ====================
   FILTERS
==================== */

function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter(
        (todo) => !todo.completed
      );

    case "completed":
      return todos.filter(
        (todo) => todo.completed
      );

    default:
      return todos;
  }
}

/* ====================
   COUNTER
==================== */

function updateItemsLeft() {
  const activeTodos =
    todos.filter(
      (todo) => !todo.completed
    );

  itemsLeft.textContent =
    `${activeTodos.length} item${
      activeTodos.length !== 1
        ? "s"
        : ""
    } left`;
}

/* ====================
   DRAG & DROP
==================== */

function handleDrop(targetId) {
  if (
    draggedTodoId === null ||
    draggedTodoId === targetId
  ) {
    return;
  }

  const draggedIndex =
    todos.findIndex(
      (todo) =>
        todo.id === draggedTodoId
    );

  const targetIndex =
    todos.findIndex(
      (todo) =>
        todo.id === targetId
    );

  const [draggedTodo] =
    todos.splice(draggedIndex, 1);

  todos.splice(
    targetIndex,
    0,
    draggedTodo
  );

  saveTodos();
  renderTodos();
}

/* ====================
   RENDER
==================== */

function renderTodos() {
  todoContainer.innerHTML = "";

  const filteredTodos =
    getFilteredTodos();

  filteredTodos.forEach((todo) => {
    const todoElement =
      document.createElement(
        "article"
      );

    todoElement.classList.add(
      "todo-item"
    );

    todoElement.draggable = true;
    todoElement.dataset.id =
      todo.id;

    todoElement.innerHTML = `
      <div
        class="circle todo-checkbox ${
          todo.completed
            ? "checked"
            : ""
        }"
        data-id="${todo.id}"
      ></div>

      <span class="${
        todo.completed
          ? "completed"
          : ""
      }">
        ${todo.text}
      </span>

      <button
        class="delete-btn"
        data-id="${todo.id}"
        aria-label="Delete todo"
      >
        <img
          src="./images/icon-cross.svg"
          alt=""
        >
      </button>
    `;

    todoElement.addEventListener(
      "dragstart",
      () => {
        draggedTodoId = todo.id;
      }
    );

    todoElement.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault();
      }
    );

    todoElement.addEventListener(
      "drop",
      () => {
        handleDrop(todo.id);
      }
    );

    todoContainer.appendChild(
      todoElement
    );
  });

  updateItemsLeft();
}

/* ====================
   EVENTS
==================== */

todoContainer.addEventListener(
  "click",
  (event) => {
    const checkbox =
      event.target.closest(
        ".todo-checkbox"
      );

    const deleteBtn =
      event.target.closest(
        ".delete-btn"
      );

    if (checkbox) {
      const id = Number(
        checkbox.dataset.id
      );

      const todo = todos.find(
        (todo) => todo.id === id
      );

      todo.completed =
        !todo.completed;

      saveTodos();
      renderTodos();
    }

    if (deleteBtn) {
      const id = Number(
        deleteBtn.dataset.id
      );

      const index =
        todos.findIndex(
          (todo) =>
            todo.id === id
        );

      todos.splice(index, 1);

      saveTodos();
      renderTodos();
    }
  }
);

/* ====================
   FORM
==================== */

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const todoText =
      input.value.trim();

    if (!todoText) return;

    todos.push({
      id: Date.now(),
      text: todoText,
      completed: false,
    });

    saveTodos();

    input.value = "";

    renderTodos();
  }
);

/* ====================
   FILTER BUTTONS
==================== */

filterButtons.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      filterButtons.forEach(
        (btn) =>
          btn.classList.remove(
            "active"
          )
      );

      button.classList.add(
        "active"
      );

      currentFilter =
        button.dataset.filter;

      renderTodos();
    }
  );
});

/* ====================
   CLEAR COMPLETED
==================== */

clearBtn.addEventListener(
  "click",
  () => {
    const activeTodos =
      todos.filter(
        (todo) =>
          !todo.completed
      );

    todos.length = 0;

    todos.push(...activeTodos);

    saveTodos();
    renderTodos();
  }
);

/* ====================
   THEME
==================== */

themeButton.addEventListener(
  "click",
  toggleTheme
);

/* ====================
   INIT
==================== */

loadTheme();
renderTodos();