import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'
import '../App.css';
import Boat from './Boat.png'

export default class NavBar extends Component{

	state = {
        team:'',
    }

  componentDidMount =() =>{
	     this.fetchTeam()
  }


fetchTeam = () => {
  console.log('getting team')
fetch('https://www.marina.social/api/team-detail/')
.then(response => response.json())
.then(data => 
  this.setState({
    team:data,
  })
  )
}

render(){
  var team = this.state.team
	var currClient = this.props.currClient
  if(this.props.loading){
    return(
<nav class="navbar navbar-expand-sm navbar-dark primary-color fixed-top">


            <a class="navbar-brand">
                        <h1>
                          <span ></span>
                        </h1>
                </a>
            </nav>
      )
  }
  if (!this.props.loading && !this.props.loggedIn){
    return(
<nav class="navbar navbar-expand-sm navbar-dark primary-color fixed-top">


            <a class="navbar-brand" style={{display:"flex", flexDirection:"row"}}>
                        <img src={Boat} className="photo" alt="Wave" style = {{marginBottom:"-5px"}}/>
                        <h1>
                          <span>Marina</span>
                        </h1>
                </a>

              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
                aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon-bar top-bar"></span>
                <span class="icon-bar middle-bar"></span>
                <span class="icon-bar bottom-bar"></span>

              </button>

              <div class="collapse navbar-collapse" id="basicExampleNav">

                  <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                          <a class="nav-link logout-container" style = {{color:"#007bff"}} href="/login/">Login</a>
                        </li> 
                        <li class="nav-item">
                          <a class="nav-link logout-container" style = {{color:"#007bff"}} href="/signup/">Sign Up</a>
                        </li> 
                  </ul>
                </div>
            </nav>
      )
  }
  return(

          <nav class="navbar navbar-expand-sm navbar-dark primary-color fixed-top">


            <a class="navbar-brand" style={{display:"flex", flexDirection:"row"}}>
                        <img src={Boat} className="photo" alt="Wave" style = {{marginBottom:"-5px"}}/>
                        <h1>
                          <span>Team {team.name}</span>
                        </h1>
                </a>

              <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#basicExampleNav"
                aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon-bar top-bar"></span>
                <span class="icon-bar middle-bar"></span>
                <span class="icon-bar bottom-bar"></span>

              </button>

              <div class="collapse navbar-collapse" id="basicExampleNav">

                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <a class ="nav-link">
                      <NavLink to="/home/" activeStyle={{color: "#36D9B6", textDecoration: "underline"}}>Home</NavLink>
                      <span class="sr-only">(current)</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class ="nav-link">
                          <NavLink to="/vote/"
                          activeStyle={{
                            color: "#36D9B6", 
                            textDecoration: "underline"
                          }}
                        >
                          Vote
                        </NavLink>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class ="nav-link">
                          <NavLink to="/entries/" activeStyle={{color: "#36D9B6", textDecoration: "underline"}}>Entries</NavLink>
                    </a>               
                  </li>
                    <li class="divider-vertical"></li>
                </ul>

                  <hr class="d-block d-md-none"/> 
                  <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                          <a class ="nav-link">
                              <NavLink to="/my-profile/" activeStyle={{color: "#36D9B6"}} >{currClient.name}</NavLink>
                          </a>               
                        </li>
                        <li class="nav-item">
                          <a class="nav-link">
                              <NavLink to="/logout/" class ="logout-container" style = {{color:"#007bff"}}>Logout</NavLink>
                          </a>
                        </li> 
                  </ul>
                </div>
            </nav>
    )

}
}