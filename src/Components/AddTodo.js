import React, { Component } from 'react'
import axios from "axios"
import { token$ } from "./TokenStore";
import Todo from "../Components/Todo"

class AddTodo extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            content: '',
            clearField: "",
            errAddTodoMsg: false,

            todoList: [],
            token: token$.value,


        }
    }

    componentDidMount() {
        this.subscription = token$.subscribe((token) => this.setState({ token }));
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }
    
    addTodo = () => {
        let { content } = this.state;
        const api = 'http://3.120.96.16:3002/';

        if (content === "") {
            return null;
        }
        else {

        this.subscription = token$.subscribe(token => {
            console.log(token);

            let item = {
                content: content
            }

            let options = {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            };

            axios
                .post(`${api}todos`, item, options)
            .then (res => {

                let todo = res.data.todo;
                let newTodo = this.state.todoList;
                newTodo.push(todo);

                this.setState({ todoList: newTodo });
            })
            .catch(err => {
                console.log(err);
                this.setState({ errAddTodo: true });

                if (this.state.errAddTodo) {
                    this.setState({ errAddTodoMsg: "Ooopss!! There's a server error right now, we are trying to fix it...  Try to logout and then login and se if your todo works :)" });
                } else {
                    this.setState({ errAddTodoMsg: '' });
                }
            })
        })
    }
    }

    onNewItem = (e) => {
        this.setState({content: e.target.value})
    }

    clearInput = (e) => {
        e.preventDefault();

        this.setState({clearField: this.state.content, content: ""})
    }

    deleteTodo = (id) => {
        const api = "http://3.120.96.16:3002/";

        this.subscription = token$.subscribe(token => {
        axios.delete(`${api}todos/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            const list = [...this.state.todoList];

            const updatedTodos = list.filter(item => item.id !== id);

            this.setState({ todoList: updatedTodos})
        })
    })
    }


    render() {
        const { content, todoList } = this.state;

        let addTodos = todoList.map(todo => {
            return (
                <div key={todo.id}>
                    <p> {todo.content}</p>
                    <button onClick={() => this.deleteTodo(todo.id)}>Delete</button>
                </div>
            )
        })

        return (
            
            <div>
                <form onSubmit={this.clearInput}>
                    <label>
                        Todos <input type="text" value={content} onChange={this.onNewItem} placeholder="Add todos"/>
                    </label>
                    <button onClick={this.addTodo}>Add a todo</button>
                </form>
                {this.props.renderTodo}
                {addTodos}
            </div>
        )
    }
}

export default AddTodo
