import React, { Component } from 'react';
import Welcome from './Welcome'
import '../App.css';

export default class Home extends Component{

  state = {
        archives:[],
    }


  componentDidMount =() =>{
    document.title = 'Marina | Home'
    this.fetchArchives()
  }
  
  fetchArchives = () => {
    fetch('https:/www.marina.social/api/archives-list/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        archives:data,
      })
      )
  }

  render(){
    var archives = this.state.archives
    return(

      <div>
        <div id="welcome-container">
          <div id="list-wrapper">
            <div class = "welcome-wrapper flex-wrapper">
                            <div style={{flex:1}}>
                              <h1>
                                  Welcome
                              </h1>
                            </div>
                            <div style={{flex:1}}>
                                  <Welcome loading={this.props.loading} loggedIn={this.props.loggedIn}/>
                            </div>
            </div>
          </div>
        </div>

              <div id="entry-container">

                <div id="list-wrapper">
                    <div class="entry-wrapper" >
                      <div class = "section">
                        <div style={{flex:1, color: "#36D9B6"}}>
                          <span>Past Contests</span>
                        </div>    
                      </div>                
                    </div>
                  {archives.map(function(archive, index){
                    var winner = archive.teamA
                    if(archive.AWon!==true){
                      winner = archive.teamB
                    }
                      return(
                          <div key={index} class="entry-wrapper">
                            <div class="border-item">

                            <div style={{flex:1, color:"black"}}>
                              <span >Topic: {archive.topic}</span>
                            </div>

                            <div style={{flex:1, color:"black"}}>
                              <span>Entry: {archive.entryA}</span>
                            </div>

                            <div style={{flex:1, color:"black"}}>
                              <span>Author: Team {archive.teamA}</span>
                            </div>

                            <div style={{flex:1, color:"black"}}>
                              <span>Entry: Team {archive.entryB}</span>
                            </div>
                            
                            <div style={{flex:1, color:"black"}}>
                              <span>Author: Team {archive.teamB}</span>
                            </div>

                            <div style={{flex:1, color:"black"}}>
                              <span>Winner: Team {winner}</span>
                            </div>
                            </div>
                          </div>
                          )
                      })
                  }
                </div>
              </div>
            </div>
      )
  }
}