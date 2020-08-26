import React, { Component } from 'react';
import '../App.css';
import {Redirect} from 'react-router-dom'
import ExpandableText from './ExpandableText'
import { Prompt } from 'react-router'

export default class TeamEntries extends Component{

	state = {
        entryList:[],
        activeItem:{
          id:null,
          string:'',
          und_score:null,
          client:null,
          currUserVoteField:null,
        },
        editing:false,
        topic: '',
        complete: false,
        entryAID: null,
        entryBID: null,
        loading:true,
        height: '36px'
    }


  getCookie =(name) =>{
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
        }
      return cookieValue;
    }

  componentDidMount =() =>{
    this.fetchEntries()
    this.fetchTopic()
    document.title = 'Marina | Entries'

    window.addEventListener('beforeunload', this.beforeunload.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload.bind(this));
  }

    beforeunload(e) {
    if (this.state.activeItem.string !== '' || this.state.editing==true) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  fetchEntries = () => {
    fetch('https://www.marina.social/api/entries-list/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        entryList:data,
      })
      )
  }

  handleChange = (e) =>{
    var value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        string:value
      }
    })

    this.resize()

  }

  startEdit = (entry) => {
    this.setState({
      activeItem: entry,
      editing:true ,
    })

   fetch('https://www.marina.social/api/topic-detail/')
    .then(response => response.json())
    .then(data => {
      window.scrollTo(0, 0)
      })
    .then(dummy =>{
        this.resize()
      })
  }


  handleSubmit = (e) =>{
    e.preventDefault()
    var csrftoken = this.getCookie('csrftoken');

    var url = 'https://www.marina.social/api/entries-create/'

    var leftBracket = '['
    var rightBracket = ']'

    if(this.state.editing){
      leftBracket=''
      rightBracket=''
      url = `https://www.marina.social/api/entries-update/${this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: leftBracket + JSON.stringify(this.state.activeItem) + rightBracket
    }).then((response) => {
      this.setState({
        activeItem:{
          id:null,
          string:'',
          und_score:null,
          clint:null,
      }
      })
    }).then(dummy =>{
      this.fetchEntries()
    }).then(dummy =>{
      this.resize()
    })
  }


  fetchTopic = () =>{
    fetch('https://www.marina.social/api/topic-detail-teams/')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({
        topic: data.string,
        complete: data.entriesComplete,
        entryAID: data.entryA,
        entryBID: data.entryB,
      })
  })

      this.setState({
        loading: false,
      })
  }

  deleteEntry = (entry) => {
    var csrftoken = this.getCookie('csrftoken')

    if(this.state.activeItem.id==entry.id){
      this.setState({
        activeItem:{
          id:null,
          string:'',
          und_score:null,
          client:null
        },
        editing:false
      })
    }

    fetch(`https://www.marina.social/api/entries-delete/${entry.id}/`,{
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response)=>{
      this.fetchEntries()
    })
    .then(dummy=>{
      this.resize()
    })
  }

  undEntry = (vote, entry) => {
    fetch(`https://www.marina.social/api/${vote}/${entry.id}/`)
    .then((response)=>{
      this.fetchEntries()
    })
  }

  resize = () =>{
    console.log(this.textarea)
    console.log(this.textarea.style.height)
    console.log(this.textarea.scrollHeight)
    this.textarea.style.height = 'inherit'
    this.textarea.style.height = `${this.textarea.scrollHeight}px`
  }

  render(){
    var entries = this.state.entryList
    var currClient = this.props.currClient
    var clientsDict = this.props.clientsDict

    var self = this
    if(this.props.loading || this.state.loading){
      return(
        <div>

              <div id="welcome-container">
                <div id="list-wrapper">
                  <div class = "welcome-wrapper flex-wrapper">
                    <div style={{flex:1}}>
                      <h1 style = {{color: "#36D9B6"}}>
                        Hello New York City!
                      </h1>
                     </div>
                  </div>
                </div>
              </div>
              
              <div id="entry-container-center">
                <div id="list-wrapper">
                  <div class = "section-column flex-wrapper">
                        <div style={{flex:1, marginBottom: "10px"}}>
                          <span style={{color: "#36D9B6"}}>Topic: </span>
                          <span>{this.state.topic}</span>
                        </div>

                          <form onSubmit={this.handleSubmit} id="form">
                            <div className="flex-wrapper">
                              <div style={{flex: 1}}>    

                                  <textarea  onChange={this.handleChange} className="form-control" id="string"  type="text" name ="string"
                                    value={this.state.activeItem.string}
                                    style={{width: "600px", maxHeight:"600px", minHeight:"36px", marginLeft:"auto", marginRight:"auto"}}
                                    placeholder="Add entry here"
                                    ref={c => (this.textarea = c)}
                                    rows={1}
                                  />

                              </div>

                              <div style={{flex: 1}}>
                                <input id="submit" className="btn btn-warning" type="submit" name="Add" value={submitValue}/>
                              </div>
                            </div>
                          </form>
               
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

            <textarea onChange={this.handleChange} className="form-control" id="string"  type="text" name ="string"
                                    style={{width: "400px", maxHeight:"600px", minHeight:"36px"}}
                                    ref={c => (this.textarea = c)}
                                    placeholder="Add entry here"
                                    rows={1}
                                    value={this.state.activeItem.string}
            />
        </div>
        )
    }

    var submitValue = "Submit Entry"
    if (this.state.editing){
      submitValue = "Submit Edit"
    }
    var welcomeMessage = 'Entry with most votes will be submitted on Friday 8/28 10pm ET.'
    if (this.state.complete){
      welcomeMessage = 'Entry has been submitted. Board will reset on Friday 9/4 10pm ET'
    }

    var entryAID = this.state.entryAID
    var entryBID = this.state.entryBID
    return(
      <div> 

            <Prompt
              when={this.state.activeItem.string !== '' || this.state.editing==true}
              message="Are you sure you want to leave? Data you have entered is not saved."
            />

              <div id="welcome-container">
                <div id="list-wrapper">
                  <div class = "welcome-wrapper flex-wrapper">
                    <div style={{flex:1}}>
                      <h1>
                        {welcomeMessage}
                      </h1>
                     </div>
                  </div>
                </div>
              </div>

              <div id="entry-container-center">
                <div id="list-wrapper">
                  <div class = "section-column flex-wrapper">
                        <div style={{flex:1, marginBottom: "10px"}}>
                          <span style={{color: "#36D9B6"}}>Topic: </span>
                          <span>{this.state.topic}</span>
                        </div>

                          <form onSubmit={this.handleSubmit} id="form">
                            <div className="flex-wrapper">
                              <div style={{flex: 1}}>    

                                  <textarea onChange={this.handleChange} className="form-control" id="string"  type="text" name ="string"
                                    value={this.state.activeItem.string}
                                    style={{width: "600px", marginLeft:"auto", marginRight:"auto"}}
                                    placeholder="Add entry here"
                                    ref={c => (this.textarea = c)}
                                    rows={1}
                                  />

                              </div>

                              <div style={{flex: 1}}>
                                <input id="submit" className="btn btn-warning" type="submit" name="Add" value={submitValue}/>
                              </div>
                            </div>
                          </form>
               
                  </div>   
                </div>
              </div>


              <div id="parent-wrap">

                  {entries.map(function(entry, index){
                    var colorUp = ""
                    var colorDown = ""
                    var textUp = ""
                    var textDown = ""

                    var und_score = entry.und_score

                    if(entry.currUserVoteField == 1){
                        colorUp = "#0077ff"
                        textUp = "#fff"
                    }
                    else if(entry.currUserVoteField == -1){
                        colorDown = "#0077ff"
                        textDown = "#fff"
                    }

                    if(entry.id===entryAID || entry.id===entryBID){
                      return(
                        <div id="entry-container-marginalized">
                        <div class = "section-flat">
                          <div style={{flex:1}}>
                            <span style={{color: "#36D9B6"}}>Author </span>
                            <span>{clientsDict[entry.client]}</span>
                          </div>
                        </div>

                        <hr/>

                        <div style={{flex:1, marginBottom:"10px"}}>
                          <ExpandableText text={entry.string} />
                        </div>

                      </div>
                      )
                    }
                    else if(currClient.id===entry.client){
                    return(

                    <div id="entry-container-marginalized">
                        <div class = "section-flat">
                          <div style={{flex:1}}>
                            <span style={{color: "#36D9B6"}}>Author </span>
                            <span>{clientsDict[entry.client]}</span>
                          </div>
                        </div>

                        <hr/>

                        <div style={{flex:1, marginBottom:"10px"}}>
                          <ExpandableText text={entry.string} />
                        </div>

                        <hr/>

                        <div style={{flex:1}}>
                            <button style={{backgroundColor:colorUp, color:textUp}} onClick={()=> self.undEntry(1, entry)} className="btn btn-sl btn-outline-primary">Upvote</button>                        
                        </div>   
                        
                        <div style={{flex:1, fontSize:"x-large"}}>
                            <span>{und_score}</span>
                        </div>
                                
                        <div style={{flex:1}}>
                            <button style={{backgroundColor:colorDown, color:textDown}} onClick={()=> self.undEntry(2, entry)} className="btn btn-sl btn-outline-primary">Downvote</button>                        
                        </div>

                        <hr style={{color: "transparent"}}/>

                        <div style={{flex:1}}>
                            <button onClick={()=> self.startEdit(entry)} className="btn btn-sm btn-outline-info">Edit</button>
                        </div>

                        <div style={{flex:1}}>
                            <button onClick={()=> self.deleteEntry(entry)} className="btn btn-sm btn-outline-dark">Delete</button>                        
                        </div>    

                      </div>
                      )
                    }
                    else{
                      return(
                           <div id="entry-container-marginalized">
                        <div class = "section-flat">
                          <div style={{flex:1}}>
                            <span style={{color: "#36D9B6"}}>Author </span>
                            <span>{clientsDict[entry.client]}</span>
                          </div>
                        </div>

                        <hr/>

                        <div style={{flex:1, marginBottom:"10px"}}>
                          <span>{entry.string}</span>
                        </div>

                        <hr/>

                        <div style={{flex:1}}>
                            <button style={{backgroundColor:colorUp, color:textUp}} onClick={()=> self.undEntry(1, entry)} className="btn btn-sl btn-outline-primary">Upvote</button>                        
                        </div>   
                        
                        <div style={{flex:1, fontSize:"x-large"}}>
                            <span>{und_score}</span>
                        </div>
                                
                        <div style={{flex:1}}>
                            <button style={{backgroundColor:colorDown, color:textDown}} onClick={()=> self.undEntry(2, entry)} className="btn btn-sl btn-outline-primary">Downvote</button>                        
                        </div>

                      </div>
                        )
                      }
                  })}
              </div>
        </div>
      )
  }
}