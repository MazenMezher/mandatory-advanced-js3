import React, { Component, Profiler } from 'react'
import axios from "axios";
import { token$, updateToken } from "./TokenStore"
import jwt from "jsonwebtoken"
import AddTodo from './AddTodo';


class Todo extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            content: "",
            emailFromToken: null,
            timeFromToken: null,
            todoList: [],
            error: false,
            clearField: "",
            // token: token$.value,
        }
    }
    
    componentDidMount() {
        const api = "http://3.120.96.16:3002";
        
        this.subscription = token$.subscribe(token => {
        

        axios(`${api}/todos`, {
            headers: {
                Authorization: "Bearer " + token
            },
        })
        .then(res => {
            console.log(res)
            let todos = res.data.todos;
            this.setState({todoList: todos})
            console.log(todos)
        })
        .catch(err => {
            this.setState({error: true})
            updateToken(null)
        })
    })
    }


    deleteTodo = (id) => {
        const api = "http://3.120.96.16:3002";

        this.subscription = token$.subscribe(token => {

        axios.delete(`${api}/todos/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        } )
        .then(() => {
            const list = [...this.state.todoList];

            const updatedTodos = list.filter(item => item.id !== id);

            this.setState({ todoList: updatedTodos})
        })
    })
    }

    render() {
        const { error, todoList } = this.state;
        if(error){
            return (
                <p>Something went wrong please refresh the page</p>
            )
        }

        let renderTodos = todoList.map(todos => {
            return (
                <div key={todos.id}>
                    <p key={todos.id}>{todos.content} </p>
                    <button onClick={() => this.deleteTodo(todos.id)}>Delete</button>
                </div>
                
            )
        })

        return (
            <div>
                <h1>My Todos</h1>
                <AddTodo renderTodo={renderTodos} />
            </div>
        )
    }
}

export default Todo

