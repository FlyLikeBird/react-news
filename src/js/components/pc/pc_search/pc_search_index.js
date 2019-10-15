import React from 'react';

import PCHeader from '../pc_header';
import PCFooter from '../pc_footer';

import PCSearchContainer from './pc_search_container';

export default class PCSearchIndex extends React.Component{
  constructor(){
    super();
  
  }

  

  render(){

    return(
      <div>
        
        <PCSearchContainer {...this.props}/>
        <PCFooter/>
                
                
      </div>
    )
  }
}


