import React, { Component } from 'react'
import { token$, updateToken } from "./TokenStore"
import jwt from "jsonwebtoken"
import { Link } from "react-router-dom";


class ActiveUser extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: null,
            toReg: false,
        }
    }

    componentDidMount() {
        this.subscription = token$.subscribe(token => {
            const decoded = jwt.decode(token);

            if (token && decoded){
                this.setState({ email: decoded.email })
            }
            else {
                this.setState({ email: null });
            }
        })
    }
    render() {
        const { email, toReg } = this.state;


        return (
            <>
                <Link to="/todo"> 
                    <p>{email}</p>
                </Link>
            </>
        )
    }
}

export default ActiveUser
