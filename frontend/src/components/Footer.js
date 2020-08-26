import ReadMoreAndLess from 'react-read-more-less';
import React, { Component } from 'react';


export default class Footer extends Component {
    render() {
        return (
            <div style = {{color:"white",  position:"absolute", bottom:"0", width:"100%", textAlign:"center"}}>
              <span style={{textAlign:"center"}}>Send comments and questions to marina.social@protonmail.com</span>
            </div>
        );
    }
}