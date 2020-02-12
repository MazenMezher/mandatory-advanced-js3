import React, { Component } from 'react'
import Links from './Links'
import axios from "axios"
import { Redirect } from "react-router-dom"
import { updateToken } from "./TokenStore";
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom";


class Main extends Component {
        constructor(props) {
            super(props)
        
            this.state = {
                email: "",
                password: "",
                loggedIn: false,

                error: false,
                errorMsg: "",

                tokenValid: false,
            }
        }
        
        onEmailChange = (e) => {
            this.setState({email: e.target.value})
            
        }
    
        onPasswordChange = (e) => {
            this.setState({password: e.target.value})
        }

        loginAuth = () => {
            let { email, password} = this.state;

            const api = "http://3.120.96.16:3002";

            

            let emailValidator = /^([A-Z\d.-]+)@([A-Z\d-]+).([A-Z]{2,8})(.[A-Z]{2,8})?$/i.test(email);
            let passValidator = /^[A-Za-z]?\w{2,16}?$/i.test(password);

            if (!emailValidator) {
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

            axios.post(`${api}/auth`, data)
            .then(res => {
                let profile = res.data.token;
                this.setState({loggedIn: true});
                updateToken(profile)
            })
            .catch(err => {
                console.log(err)
                this.setState({ error: true})
                

                if(this.state.error) {
                        this.setState({
                            errorMsg: "Invalid Login!"
                        })
                
                } else {
                        this.setState({errorMsg: ""})
                    
                }
                updateToken(null)
            })
        }
        }

    render() {

        const { email, password, loggedIn} = this.state;


        if(loggedIn){
            return (
                <Redirect to="/todo" />
            )
        }
        return (

            <div>
                <Helmet><title>Login-Page</title></Helmet>

                <form onSubmit={event => event.preventDefault()}>
                    <label>
                        Email 
                        <input type="email" placeholder="Example@hotmail.com" value={email} onChange={this.onEmailChange}/>
                    </label>

                    <label>
                        Password
                        <input type="password" placeholder="Password" value={password} onChange={this.onPasswordChange}/>
                    </label>
                    <button onClick={this.loginAuth}>Login</button>
                    <p>{this.state.errorMsg}</p>
                </form>
                <Link to=".registartion"><p>Register here</p></Link>
            </div>
        )
    }
}

export default Main

