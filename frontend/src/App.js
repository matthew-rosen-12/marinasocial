import React from 'react';
import './App.css';

import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'

import Home from './components/Home'
import NavBar from './components/NavBar'
import Vote from './components/Vote'
import TeamEntries from './components/TeamEntries'
import Footer from './components/Footer'


class App extends React.Component{



  state = {
      currClient:'',
      loggedIn:true,
      teamClients:[],
      clientsDict:{},
      loading:true,
    }

  componentDidMount =() =>{
     this.fetchClient()
     this.fetchTeamClients()
  }

  fetchClient = () => {
  fetch('https://www.marina.social/api/client-detail/')
  .then(response => {
    console.log(response)
    if(response.redirected){
      this.setState({
        loading:false,
        loggedIn:false,
      })
    }
    return response.json()
  })
  .then(data => {
    {console.log(data)}
    this.setState({
      currClient:data,
      loading: false,
      loggedIn: true,
    })
  })

  }

  fetchTeamClients = () =>{
  var dict={}
  fetch('https://www.marina.social/api/client-team-detail/')
  .then(response => {
    return response.json()
  })
  .then(data => {
    for(var i=0;i<data.length;i++){
      dict[data[i].id]=data[i].name
    }
    this.setState({
      teamClients:data,
      clientsDict:dict,
    })
  })

  }

      

render(){
    return(
    <div>

      <Router>
        <div class="main-container">

            <NavBar loading={this.state.loading} loggedIn={this.state.loggedIn} currClient={this.state.currClient} />

              <Switch>

                  <Route path="/home/" component = {()=> <Home loading={this.state.loading} loggedIn={this.state.loggedIn}/>}/>

                  <Route path="/vote/" component ={()=> <Vote loading={this.state.loading} loggedIn={this.state.loggedIn}/>}/>

                  <Route path="/entries/" component = {()=> <TeamEntries loading={this.state.loading} loggedIn={this.state.loggedIn} currClient={this.state.currClient} clientsDict={this.state.clientsDict} />}/>                  
                   
                  <Route path="/logout/" component = {()=> { 
                         window.location.href="/logout/"
                    }}/>                  

                  <Redirect from='/' to="/home/" />

              </Switch>

              <Footer/>
        </div>
      </Router>


    </div>
    )
}

}

export default App