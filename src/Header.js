import React, { Component } from 'react';

class Header extends Component {
  render() {
    var headerStyle ={
      backgroundColor: "black",
      height: "10%",
      width: "100%",
      fontSize: "xx-large",
      color: "white"
    }
    return (
      <div style={headerStyle} className="Header">
          Hitchhiker app
      </div>
    );
  }
}

export default Header;
