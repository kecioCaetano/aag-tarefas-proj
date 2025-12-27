import "./style.css"


class Model{
    constructor(){
        this.todos = JSON.parse(localStorage.getItem('todos')) || []
    }

    bindTodoListChanged(callback){
        this.onTodoListChanged = callback
    }

    add(todoText, description, dueDate, priority){

        const todo = {
            id: this.#getNextID(),
            text: todoText,
            description: description,
            dueDate: dueDate,
            priority: priority,
            complete: false
        }

        this.todos.push(todo)
        this.#commit()
    }

    delete(id){
        this.todos = this.todos.filter(item => item.id !== id)
        this.#commit()
    }

    #getNextID(){

        return this.todos.length === 0 ? 1 : this.todos[this.todos.length - 1].id + 1
        
    }

    #commit(){
        this.onTodoListChanged(this.todos)
        localStorage.setItem('todos', JSON.stringify(this.todos))
    }

    clean(){
        localStorage.removeItem('todos')
    }

    get getTodos(){
        return this.todos
    }

    edit(id, text, description, dueDate, priority){
        this.todos =
            this.todos.map(
                todo => todo.id === id ?
                    {id: id,
                    text: text,
                    description: description,
                    dueDate: dueDate,
                    priority: priority,
                    complete: todo.complete} : todo
            ) 
        this.#commit()
    }

    toggleTodo(id){
        this.todos = 
            this.todos.map(
                todo => todo.id === id ?
                    {id: todo.id,
                    text: todo.text,
                    description: todo.description,
                    dueDate: todo.dueDate,
                    priority: todo.priority,
                    complete: !todo.complete} : todo
        )
        
        this.#commit()
    }
}

class View {

    constructor(){
        this.app = this.#getElement('#root')
        this.form = this.#setElement('form')

        this.input = this.#setElement('input')
        this.input.type = 'text';
        this.input.placeHolder = 'Add todo here'
        this.input.name = 'todo'

        this.submitButton = this.#setElement('button')
        this.submitButton.textContent = 'Submit'

        this.form.append(this.input, this.submitButton)

        this.tittle = this.#setElement('h1')
        this.tittle.textContent = 'Todos'

        this.todoList = this.#setElement('ul', 'todo-list')

        this.app.append(this.tittle, this.form, this.todoList)

        this._temporaryTodoText = ''
        this._initLocalListeners()
    }

    #deleteNodes(){
        while(this.todoList.firstChild){
            this.todoList.removeChild(this.todoList.firstChild)
        }
    }

    bindEditTodo(handler){
        this.todoList.addEventListener('focusout', event => {
            if(this._temporaryTodoText){
                handler(+event.target.parentElement.id, this._temporaryTodoText)
                this._temporaryTodoText = ''
            }
        })
    }

    bindToggleTodo(handler){
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox'){
                handler(+event.target.parentElement.id)
            }
        })
    }

    bindDeleteTodo(handler){
        this.todoList.addEventListener('click', event => {
            if(event.target.className === 'delete'){
                handler(+event.target.parentElement.id)
            }
        })
    }

    bindAddTodos(handler){
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this.#getTodoText){
                handler(this.#getTodoText,'Description a', new Date(), 99)
                this.setTodoText()
            }
        })
    }
    get #getTodoText(){
        return  this.input.value
    }

    setTodoText(){
        this.input.value = ''
    }

    displayTodos(todos){

        this.#deleteNodes()
        
        if (todos.length === 0){
            const p = this.#setElement('p');
            p.textContent = 'Nothing to do! Add a task?'
            this.todoList.append(p);
        }else{

            todos.forEach( todo => {
                const li = this.#setElement('li')
                li.id = todo.id

                const checkbox = this.#setElement('input')
                checkbox.type = 'checkbox'
                checkbox.checked = todo.complete

                const span = this.#setElement('span', 'editable')
                span.contentEditable = true

                if (todo.complete){
                    const strike = this.#setElement('s')
                    strike.textContent = todo.text
                    span.append(strike)
                }else{
                    span.textContent = todo.text
                }

                const deleteButton = this.#setElement('button','delete')
                deleteButton.textContent = 'Delete'

                li.append(checkbox, span, deleteButton)
                this.todoList.append(li)
            })
            
        }
    }
    _initLocalListeners(){
        this.todoList.addEventListener('input', event => {
            if (event.target.className === 'editable'){
                this._temporaryTodoText = event.target.innerText
            }
        })
    }

    #setElement (tagName, className){

        
        const element = document.createElement(tagName)
        
        if(className) element.classList.add(className)

        return element
    }

    #getElement (selector){
        const element = document.querySelector(selector)

        return element
    }
}

class Controller{
    constructor(model, view){
        this.model = model
        this.view = view

        this.model.bindTodoListChanged(this.onTodoListChanged)
        this.view.bindAddTodos(this.handleAddTodo)
        this.view.bindDeleteTodo(this.handleDeleteTodo)
        this.view.bindToggleTodo(this.handleToggle)
        this.view.bindEditTodo(this.handleEdit)

        // this.onTodoListChanged(this.model.todos)
        this.onTodoListChanged(this.model.todos)
    }

    onTodoListChanged = todos => {
        this.view.displayTodos(todos)
    }

    handleAddTodo = (todoText, description, dueDate, priority) => {
        this.model.add(todoText, description, dueDate, priority)
    }

    handleDeleteTodo = id => {
        this.model.delete(id)
    }

    handleToggle = id => {
        this.model.toggleTodo(id)
    }

    handleEdit = (id, todoText) => {
        this.model.edit(id, todoText, 'aaaaaa', new Date(), 999)
    }
}

const app = new Controller(new Model(), new View())

// const objModel = new Model()
// console.dir(objModel.getTodos)

// objModel.add('dishwashing', 'Cleaning the dinning dishes', new Date(), 0)
// objModel.add('laundry', 'white clothes', new Date(), 1)
// objModel.clean()

// function handleClick(event){
//     console.log('button click', event)
//     console.log('The element is: ', this)
// }

// const btn = document.getElementById('myButton')
// btn.addEventListener('click', handleClick)

// const saveMessage = 'Your work has been saved'
// const deleteMessage = 'The item has been deleted'

// function updateMessage(actionType, event){
//     console.log(`action---> ${actionType}`)
//     console.log('Event details---->', event)
// }

// document.getElementById("saveButton").addEventListener("click", () => {
//         updateMessage(saveMessage, event) // Call your function inside the wrapper
// })

// document.getElementById('deleteButton').addEventListener('click', function (event){
//     updateMessage(deleteMessage, event)   
// })
// const userNameText = document.querySelector(".userName")
// const userAgeText = document.querySelector(".userAge")

// const saveNameButton = document.querySelector(".saveNameBtn")
// const saveAgeButton = document.querySelector(".saveAgeBtn")

// saveNameButton.addEventListener("click", () => {
//     const userName = document.querySelector('.name').value
//     userNameText.textContent = userName
//     localStorage.setItem("name", userName)

// })

// function displayUserName(){
//     const nameFromLocalStorage = localStorage.getItem("name")

//     if (nameFromLocalStorage){
//         userNameText.textContent = nameFromLocalStorage
//     }else{
//         userNameText.textContent = 'No name data in local storage'
//     }
// }

// displayUserName()

// saveAgeButton.addEventListener('click', () => {
//     const userAge = document.querySelector('.age').value
//     userAgeText.textContent = userAge
//     sessionStorage.setItem('age', userAge)
// })

// function displayUserAge(){
//     const ageFromSessionStorage = sessionStorage.getItem('age')

//     if (ageFromSessionStorage){
//         userAgeText.textContent = ageFromSessionStorage
//     }else{
//         userAgeText.textContent = "No age data in session storage"
//     }
// }

// displayUserAge()
