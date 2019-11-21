import React from 'react';
import { Collapse, Button, Modal, Input, Badge } from 'antd';


export default class ActionMessageItem extends React.Component{
    constructor(){
        super();
        this.state={
            visible:false,
            deleteVisible:false,
            deleteId:'',
            toId:'',
            toUser:''
        }
    }
    
   
    render(){
        var { data } = this.props;
          
        
        return(
            
            <div>
                hello
            </div>
        )
    }
}


