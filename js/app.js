// Global fetch from json-server -w db.json
const BASE_URL = "http://localhost:3000/"

// *** Frameworks functions ***
// Task item to default format
function itemToDefault(item) {
  console.log("data-framework undefined")
  const liElement = document.createElement("li")
  liElement.innerHTML = `
    <p>${item.text}</p>
    <button data-task-id="${item.id}">Eliminar</button>
  `
  return liElement;
}

// Task item to bootstrap format
function itemToBootstrap(item) {
  console.log("data-framework bootstrap")
  const liElement = document.createElement("li")
  liElement.className = "list-group-item"
  liElement.innerHTML = `
    <p>${item.text}</p>
    <button data-task-id="${item.id}">Eliminar</button>
  `
  return liElement;
}

const itemCreator = {
  "null" : itemToDefault,
  "bootstrap" : itemToBootstrap
}

// *** Up ***
// Load list
function loadList(){
  getTaskList()
    .then(createList)
    .catch(console.error)
}

// Create list of task
function createList(listItems) {
  const elementId = 'todo-list'
  const listElement = document.getElementById(elementId)
  for (const item of listItems) {
    const itemElement = createListItem(item)
    listElement.appendChild(itemElement)
  }
}

// Create list item for task list
function createListItem(item) {
  const framework = document.querySelector("ul").getAttribute("data-framework")
  console.log(framework)
  
  const liElement = itemCreator[framework](item)

  liElement.addEventListener('click', removeTask)

  return liElement
}

// Add task to task list
function addTaskToList(task) {
  const listElement = document.getElementById('todo-list')
  const taskItem = createListItem(task)
  listElement.append(taskItem)
  // Visual clear of text box
  document.getElementById('enter-task-area').value = ''
}

// Remove task from trask list
function removeTaskFromList(listItem) {
  const list = listItem.parentNode
  list.removeChild(listItem)
}

// *** Subscribe function to the service
// Subscribe text area to submit event
function suscribeToFormAddTaskSubmit() {
  const form = document.getElementById("add-task")
  form.addEventListener("submit", onSubmitFormAddTask)
}

// *** Event listener callbacks ***
// Submit from add task
function onSubmitFormAddTask(event) {
  event.preventDefault()
  createTask()
}

// *** Base functionality of the list management
// Create task
function createTask() {
  const text = document.getElementById("enter-task-area").value
  const task = { "text": text }
  saveTask(task)
    .then(addTaskToList)
    .catch(console.error)
}

// Remove task
function removeTask(event) {
  const button = event.target
  const { taskId } = button.dataset
  deleteTask(taskId)
    .then(() => button.parentNode)
    .then(removeTaskFromList)
}

// *** Database management functions ***
// Get task list from database
function getTaskList() {
  return fetch(`${BASE_URL}items`)
    .then(response => response.json())
}

// Save task in database
function saveTask(task) {
  return fetch(`${BASE_URL}items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
    .then(response => response.json())
}

// Delete task in database
function deleteTask(taskId) {
  return fetch(`${BASE_URL}items/${taskId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
}

// *** Main ***
// Beginning of execution point - Load service call when refresh page only
window.addEventListener('load', function(){
  // Receive information from the User and store to DB
  suscribeToFormAddTaskSubmit()
  // Display the information from DB to User
  loadList()
})