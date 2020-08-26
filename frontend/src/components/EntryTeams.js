import React, { Component } from 'react';
import '../App.css';

export default class EntryTeams extends Component{

  state = {
    team: ''
  }

  componentDidMount =() =>{
    this.fetchEntryTeams()
  }
  

  fetchEntryTeams = ()=>{

      console.log(this.props.entry)

      fetch(`https://www.marina.social/api/team-of-entry/${this.props.entry.id}/`)
      .then(response => response.json())
      .then(data => {
        this.setState({
        team:data,
      })
        })

  }

  render(){

    return(
<span>Team {this.state.team.name}
</span>
      )
  }
}