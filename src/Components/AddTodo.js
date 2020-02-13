import React, { Component } from 'react'
import axios from "axios"
import { token$, updateToken } from "./TokenStore";
import { Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom";


class AddTodo extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            todoList: [],
            content: "",
            clearField: "",

            errAddTodoMsg: false,
            signOut: false,
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

    logOut = () => {
        localStorage.removeItem("token");

        this.setState({signOut: true})
        updateToken(null);

    }
    
    

    render() {
        const { content, todoList, signOut} = this.state;

        if(signOut){
            return (
                <Redirect to="/" />
            )
        }

        let addTodos = todoList.map(todo => {
            return (
                
                <div key={todo.id} >
                    <p className="todoContainer"> {todo.content}
                    <button onClick={() => this.deleteTodo(todo.id)} className="glow-on-hover">Delete</button>
                    </p>
                </div>
            )
        })

        return (
            
            <div className="todoBox">
                <Helmet><title>Todo-Page</title></Helmet>
                
                <div className="extra">
                <Link to="/registration" className="newMember" onClick={this.logOut}><p>Register new member</p> </Link>
                <Link to="/" onClick={this.logOut}><p>Return to main page</p></Link>
                </div>
                <form onSubmit={this.clearInput}>
                    <label>
                        Create your todo:  <input type="text" value={content} onChange={this.onNewItem} placeholder="Add todos"/>
                        
                    </label>
                    <button onClick={this.addTodo}>Add a todo</button>
                    <button onClick={this.logOut}>Log Out</button>
                    
                </form>
                {this.props.renderTodo}
                {addTodos}
            </div>
        )
    }
}

export default AddTodo
