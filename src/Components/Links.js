import React from 'react'
import { Link } from "react-router-dom";

function Links() {
    return (
        <div>
            <label>Not a member yet?</label><Link to="/registration"><p>Register here</p> </Link>
            <Link to="/"><p>Return to main page</p></Link>
        </div>
    )
}

export default Links
