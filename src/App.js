import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header'

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="Header">
          <Header/>
      </div>
        <header className="App-header">
            Get a ride easily
        </header>
      </div>
    );
  }
}

export default App;
