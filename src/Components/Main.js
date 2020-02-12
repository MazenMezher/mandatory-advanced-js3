import React, { Component } from 'react'
import Links from './Links'
import axios from "axios"
import { Redirect } from "react-router-dom"
import { updateToken } from "./TokenStore";

class Main extends Component {
        constructor(props) {
            super(props)
        
            this.state = {
                email: "",
                password: "",
                loggedIn: false,
                token: {},

                error: false,
                errorMsg: "",
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

            let data = {
                email: email,
                password: password,
            }

            axios.post(`${api}/auth`, data)
            .then(res => {
                let profile = res.data.token;
                this.setState({loggedIn: true, token: profile});
                updateToken(profile)
            })
            .catch(err => {
                const { error } = this.state;
                this.setState({ error: true})
                

                if(error) {
                    return (
                        this.setState({
                            errorMsg: "Invalid Login!"
                        })
                    )
                }
                updateToken(null)
            })

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
                <Links/>
            </div>
        )
    }
}

export default Main

