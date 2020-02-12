import React, { Component, Profiler } from 'react'
import axios from "axios";
import { token$, updateToken } from "./TokenStore"
import jwt from "jsonwebtoken"
import AddTodo from './AddTodo';

import { Redirect } from 'react-router-dom';


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

            tokenDead: false,
            currentTime: null,
            tokenLife: null,
            // token: token$.value,
        }
    }
    
    componentDidMount() {

        this.interval = setInterval( () => {
            this.setState({
                currentTime : new Date().getTime() / 1000
            })
        }, 1000)

        const api = "http://3.120.96.16:3002";
        
        this.subscription = token$.subscribe(token => {

            const decoded = jwt.decode(token);
            
            if(decoded){
                this.setState({tokenLife: decoded.exp});
            } 
            else {
                return null;
            }

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
            console.log(err);
            this.setState({error: true})
            updateToken(null);
        })
    })
    }

    componentDidUpdate() {
        let { currentTime, tokenLife } = this.state;

        if (currentTime > tokenLife){
            updateToken(null)
            this.setState({tokenDead: true})
        }
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
    componentWillUnmount() {
        this.subscription.unsubscribe();
        clearInterval(this.interval)
    }

    render() {
        const { error, todoList, tokenDead } = this.state;

        if(tokenDead){
            return (
                <Redirect to="/" />
            )
        }

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

