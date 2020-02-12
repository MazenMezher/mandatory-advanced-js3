import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom"
import './App.css';
import Registration from './Components/Registration';
import Main from "./Components/Main"
import AddTodo from './Components/AddTodo';
import Todo from './Components/Todo';

function App() {
  return (
    <div className="App">
        <Router>
          <Route exact path="/" component={Main}/>
          <Route path="/registration" component={Registration}/>
          <Route path="/todo" component={Todo}/>
        </Router>
    </div>
  );
}

export default App;
