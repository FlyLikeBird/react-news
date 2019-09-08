import React from 'react';

import PCHeader from '../pc_header';
import PCFooter from '../pc_footer';

import PCTagContainer from './pc_tag_container';


export default class PCTagIndex extends React.Component {
    
    constructor(props) {
      super();
      //console.log(props);
      this.state = {
        tag:''
      }
      
    }
    
    componentWillReceiveProps(newProps){
      //console.log('father component');
      var tag = newProps.match.params.tag;
      this.setState({tag})

    }

    componentDidMount(){
      
      var tag = this.props.match.params.tag;
      
      this.setState({tag:tag});
    }

    render() {
        return (
        <div>
          
          <PCTagContainer tag={this.state.tag} {...this.props}/>
          <PCFooter />
        </div>
        )
    }

}











