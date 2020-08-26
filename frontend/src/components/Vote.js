import React, { Component } from 'react';
import '../App.css';
import EntryTeams from './EntryTeams'
import {Redirect} from 'react-router-dom'

export default class Vote extends Component{

  state = {
        entry1: null,
        entry2: null,
        voterTeam1: '',
        voterTeam2: '',
        topic: '',
        loadingOne: true,
    }


  componentDidMount =() =>{
    document.title = 'Marina | Vote'
    this.fetchVotingEntries()
    this.fetchVotingTeams()
  }
  
  fetchVotingEntries = () => {
    fetch('https://www.marina.social/api/voting-entries-list/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        entry1:data[0],
        entry2:data[1],
        loadingOne: false,
      })
      )
      
      this.setState({
        loadingOne: false,
      })
  }

  fetchVotingTeams = () => {
    fetch('https://www.marina.social/api/voting-teams-list/')
    .then(response => response.json())
    .then(data => {
      this.setState({
        voterTeam1:data[0],
        voterTeam2:data[1],
      })
    })
    .then(dummy =>{
      this.fetchTopic()
    })
   }

  fetchTopic = () => {
    fetch('https://www.marina.social/api/topic-detail/')
    .then(response => response.json())
    .then(data => {
      this.setState({
        topic:data.string,
      })
    })
   }

  undEntry = (vote, entry) => {
    fetch(`https://www.marina.social/api/${vote}/${entry.id}/`)
    .then( data => {
      this.fetchVotingEntries()
    }
    )

  }

  render(){
    var voterTeam1 = this.state.voterTeam1
    var voterTeam2 = this.state.voterTeam2

    var entry1 = this.state.entry1
    var entry2 = this.state.entry2

    var topic = this.state.topic

    var color1Up = ""
    var color1Down = ""
    var color2Up = ""
    var color2Down = ""

    var text1Up = ""
    var text1Down = ""
    var text2Up = ""
    var text2Down = ""

    if(entry1 != null){
      if(entry1.currUserVoteField == 1){
        color1Up = "#0077ff"
        text1Up = "#fff"
      }
      else if(entry1.currUserVoteField==-1){
        color1Down = "#0077ff"
        text1Down = "#fff"
      }

      if(entry2.currUserVoteField == 1){
        color2Up = "#0077ff"
        text2Up = "#fff"        
      }
      else if(entry2.currUserVoteField == -1){
        color2Down = "#0077ff"
        text2Down = "#fff"
      }

    }

    var self = this

    if(this.props.loading || this.state.loadingOne){
      return(
        <div>
         <div id="welcome-container">
          <div id="list-wrapper">
            <div class = "welcome-wrapper flex-wrapper">
              <div style={{flex:1}}>
                <h1>

                </h1>
               </div>
            </div>
          </div>
        </div>        
      </div>
        )
    }
    if (!this.props.loading && !this.props.loggedIn){
      return(
        <div>
            <Redirect to = '/home/'/>
        </div>
        )
    }
    if(!this.state.loadingOne && this.state.entry1 === null){
      return(
         <div id="welcome-container">
          <div id="list-wrapper">
            <div class = "welcome-wrapper flex-wrapper">
              <div style={{flex:1}}>
                <h1>
                  Voting will start on Friday 8/28 10pm ET.<br/>Check back in then to start voting!
                </h1>
               </div>
            </div>
          </div>
        </div>
        )
    }
    return(
      <div>
              <div id="welcome-container">
                <div id="list-wrapper">
                  <div class = "welcome-wrapper flex-wrapper">
                    <div style={{flex:1}}>
                      <h1>
                        Voting will end on Friday 9/4 10pm ET.
                      </h1>
                     </div>
                  </div>
                </div>
              </div>

              <div id="entry-container-center">
                <div id="list-wrapper">
                  <div class = "section-column flex-wrapper">
                        <div style={{flex:1}}>
                          <span style={{color: "#36D9B6"}}>Topic </span>
                          <span>{topic}</span>
                        </div>
                        <div style={{flex:1}}>
                          <span style={{color: "#36D9B6"}}>Voters </span>
                          <span>Team {voterTeam1.name}, Team {voterTeam2.name}</span>
                        </div>   
                      </div>   
                  </div>
              </div>

              <div id="parent">

              <div id="entry-container-marginalized">
              <div id="left">
                <div class = "section-flat">
                    <div style={{flex:1}}>
                      <span style={{color: "#36D9B6"}}>Author </span>
                      <EntryTeams entry={entry1}/>
                    </div>
                </div>

                <hr/>

                  <div style={{flex:1, marginBottom:"10px"}}>
                      <span>{entry1.string}</span>
                  </div>

                <hr/>

                            <div style={{flex:1}}>
                                <button style={{backgroundColor:color1Up, color:text1Up}} onClick={()=> self.undEntry(1, entry1)} className="btn btn-sl btn-outline-primary">Upvote</button>                        
                            </div>   
                                                  <div style={{flex:1, fontSize:"x-large"}}>
                          <span>{entry1.und_score}</span>
                      </div>
                            <div style={{flex:1}}>
                                <button style={{backgroundColor:color1Down, color:text1Down}} onClick={()=> self.undEntry(2, entry1)} className="btn btn-sl btn-outline-primary">Downvote</button>                        
                            </div>    
                        </div>                     

                  </div>


                <div id="entry-container-marginalized">
                  <div id="right">
                  <div class = "section-flat">
                    <div style={{flex:1}}>
                      <span style={{color: "#36D9B6"}}>Author </span>
                      <EntryTeams entry={entry2}/>
                    </div>
                  </div>

                  <hr/>

                  <div style={{flex:1}}>
                      <span>{entry2.string}</span>
                  </div>

                  <hr/>                 



                            <div style={{flex:1}}>
                                <button style={{backgroundColor:color2Up, color:text2Up}} onClick={()=> self.undEntry(1, entry2)} className="btn btn-sl btn-outline-primary">Upvote</button>                        
                            </div>   
                      <div style={{flex:1, fontSize:"x-large"}}>
                          <span>{entry2.und_score}</span>
                      </div>                            
                            <div style={{flex:1}}>
                                <button style={{backgroundColor:color2Down, color:text2Down}} onClick={()=> self.undEntry(2, entry2)} className="btn btn-sl btn-outline-primary">Downvote</button>                        
                            </div>                          
                        </div>          
                </div> 
                </div>
        </div>             
      )
  }
}