import ReadMoreAndLess from 'react-read-more-less';
import React, { Component } from 'react';


export default class ExpandableText extends Component {
    render() {
        return (
            <ReadMoreAndLess
                ref={this.ReadMore}
                className="read-more-content"
                charLimit={600}
                readMoreText="Read more"
                readLessText=" See less"
            >   
              {this.props.text}
            </ReadMoreAndLess>
        );
    }
}