import React, { Component } from 'react';
import '../App.css';

export default class Welcome extends Component{

  render(){

  if(this.props.loading){
    return(
        <p>

        </p>
      )
  }
  if (!this.props.loading && !this.props.loggedIn){
    return(
        <p>
            Sign up to create an account and join a team. Then create an entry to start competing.
        </p>
      )
  }
    return(
        <p style={{fontSize: "x-large"}}>
            Click on the Vote tab to vote on other teams' entries and the Entries tab to decide on an entry for your team.
        </p>
      )
  }
}