import React, { Component } from 'react'
import axios from "axios"
import { Redirect } from "react-router-dom"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom";

class Registration extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            email: "",
            password: "",
            register: false,

            alrdyExists: false,
            errorMessage: "",
        }
    }

    onEmailChange = (e) => {
        this.setState({email: e.target.value})
        
    }

    onPasswordChange = (e) => {
        this.setState({password: e.target.value})
    }

    createAccount = () => {
        let { email, password } = this.state;
        const api = "http://3.120.96.16:3002";


        let emailValidator = /^([A-Z\d.-]+)@([A-Z\d-]+).([A-Z]{2,8})(.[A-Z]{2,8})?$/i.test(email);
        let passValidator = /^[A-Za-z]?\w{2,16}?$/i.test(password);

        if(!emailValidator){
            return null
        }
        else if (!passValidator){
            return null
        }
        else {

        
        let data = {
            email: email,
            password: password,
        }

        axios.post(`${api}/register`,data)
        .then(res => {
            console.log(res)
            this.setState({register: true})
        })
        .catch(err => {
            this.setState({alrdyExists: true});

            if(this.state.alrdyExists){
                this.setState({ errorMessage: "Email is in use! Choose another"})
            } else {
                this.setState({ errorMessage: ""})
            }
        })
    }
    }

    render() {
        const { email, password, register, errorMessage } = this.state;

        

        if(register){
            return (
                <Redirect to="/" />
            )
        }
        return (
            <div>
                  <Helmet><title>Register-Page</title></Helmet>
                <form onSubmit={event => event.preventDefault()}>
                    <label>
                        Email 
                        <input type="email" placeholder="Example@hotmail.com" value={email} onChange={this.onEmailChange}/>
                    </label>

                    <label>
                        Password
                        <input type="password" placeholder="Password" value={password} onChange={this.onPasswordChange}/>
                    </label>
                    <button onClick={this.createAccount}>Register</button>
                    <p> {errorMessage} </p>
                    <Link to="/">Return to main page</Link>
                </form>
            </div>
        )
    }
}

export default Registration
