import "./style.css"


class Model{
    constructor(){
        this.todos = JSON.parse(localStorage.getItem('todos')) || []
    }

    bindTodoListChanged(callback){
        this.onTodoListChanged = callback
    }

    add(aTodo){
        aTodo.id = this.#getNextID()
        this.todos.push(aTodo)
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

    edit(id, aTodo){

        this.todos =
            this.todos.map(
                todo => todo.id === id ?
                    {id: id,
                    text: aTodo.text,
                    description: aTodo.description,
                    dueDate: aTodo.dueDate,
                    priority: aTodo.priority,
                    complete: aTodo.complete} : todo
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
        this.input.placeholder = 'Add todo here'
        this.input.name = 'todo'

        this.description = this.#setElement('input')
        this.description.type = 'text';
        this.description.placeholder = 'Add todo description'
        this.description.name = 'description'

        this.dueDate = this.#setElement('input')
        this.dueDate.type = 'text';
        this.dueDate.placeholder = new Date()
        this.dueDate.name = 'dueDate'

        this.priority = this.#setElement('input')
        this.priority.type = 'text';
        this.priority.placeholder = 'Priority'
        this.priority.name = 'priority'
        
        this.complete = this.#setElement('input')
        this.complete.type = 'text';
        this.complete.placeholder = 'Complete'
        this.complete.name = 'complete'

        this.submitButton = this.#setElement('button')
        this.submitButton.textContent = 'Submit'

        this.form.append(this.input, this.description, this.dueDate, this.priority, this.complete, this.submitButton)

        this.tittle = this.#setElement('h1')
        this.tittle.textContent = 'Todos'

        this.todoList = this.#setElement('ul', 'todo-list')

        this.app.append(this.tittle, this.form, this.todoList)

        this._temporaryTodoText = ''
        this._temporaryTodo = {id: '', text: '', description: '', dueDate: '', priority: '', complete: ''}

        // this._initLocalListeners()
    }

    #deleteNodes(){
        while(this.todoList.firstChild){
            this.todoList.removeChild(this.todoList.firstChild)
        }
    }

    bindEditTodo(handler){
        this.todoList.addEventListener('focusout', event => {

            // if(this._temporaryTodoText){
                // handler(+event.target.parentElement.id, this._temporaryTodoText)
                // this._temporaryTodoText = ''

              
                // for(const [key] of Object.keys(this._temporaryTodo)){
                //     if (this._temporaryTodo[key] === ''){
                //         this._temporaryTodo[key] = this[key].value
                //      } 
                // }
                handler(+event.target.parentElement.id, this._temporaryTodo)
                // Object.keys(this._temporaryTodo).forEach((key)=>{
                //         this._temporaryTodo[key] = ''
                // })
                // this._temporaryTodo[key] = ''
            // }
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

            if (this.input.value){
                 handler(this.#getTodoObj)
                 this.#clearForm()
            }
        })
    }

    get #getTodoObj(){
        return {
            id: '',
            text: this.input.value,
            description: this.description.value,
            dueDate: this.dueDate.value,
            priority: this.priority.value,
            complete: this.complete.value
        }
    }

    #clearForm(){
        this.input.value = ''
        this.description.value = ''
        this.dueDate.value = ''
        this.priority.value = ''
        this.complete.value = ''
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
                checkbox.name = 'complete'
                
                const spanText = this.#setElement('span', 'editable')
                spanText.contentEditable = true
                spanText.name = 'text'

                // const nbspNode = document.createElement('\u00A0')
                
                const spanDescription = this.#setElement('span', 'editable')
                spanDescription.contentEditable = true
                spanDescription.name = 'description'

                const spanDueDate = this.#setElement('span', 'editable')
                spanDueDate.contentEditable = true
                spanDueDate.name = 'dueDate'

                const spanPriority = this.#setElement('span', 'editable')
                spanPriority.contentEditable = true
                spanPriority.name = 'priority'

                const spanComplete = this.#setElement('span', 'editable')
                spanComplete.contentEditable = true
                spanComplete.name = 'complete'

                if (todo.complete){
                    const strike = this.#setElement('s')
                    strike.textContent = todo.text
                    spanText.append(strike)
                    spanDescription.textContent = todo.description
                    spanDueDate.textContent = todo.dueDate
                    spanPriority.textContent = todo.priority
                    spanComplete.textContent = todo.complete
                    
                }else{
                    spanText.textContent = todo.text
                    spanDescription.textContent = todo.description
                    spanDueDate.textContent = todo.dueDate
                    spanPriority.textContent = todo.priority
                    spanComplete.textContent = todo.complete

                }

                const deleteButton = this.#setElement('button','delete')
                deleteButton.textContent = 'Delete'

                li.append(checkbox, 
                    spanText, 
                    spanDescription,  
                    spanDueDate, 
                    spanPriority, 
                    spanComplete,
                    deleteButton)
                this.todoList.append(li)
            })
            
        }
    }

    _initLocalListeners(){
        this.todoList.addEventListener('input', event => {
            
            // if (event.target.className === 'editable'){
            //     this._temporaryTodoText = event.target.innerText
                
            // }

              Object.keys(this._temporaryTodo).forEach((key)=>{
                    if (key === event.target.name){
                        this._temporaryTodo[key] = event.target.innerText
                    }
                })

         
                        // handler(+event.target.parentElement.id, this._temporaryTodo)
   
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
        // Explicit this binding
        this.model.bindTodoListChanged(this.onTodoListChanged)
        this.view.bindAddTodos(this.handleAddTodo)
        this.view.bindDeleteTodo(this.handleDeleteTodo)
        this.view.bindToggleTodo(this.handleToggle)
        // this.view.bindEditTodo(this.handleEdit)

        // Display initial todos
        this.onTodoListChanged(this.model.todos)
    }

    onTodoListChanged = todos => {
        this.view.displayTodos(todos)
    }

    handleAddTodo = (aTodo) => {
        this.model.add(aTodo)
    }

    handleDeleteTodo = id => {
        this.model.delete(id)
    }

    handleToggle = id => {
        this.model.toggleTodo(id)
    }

    handleEdit = (id, aTodo) => {
        this.model.edit(id, aTodo)
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
