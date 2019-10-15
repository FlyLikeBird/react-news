import React from 'react';

import { Upload, Form, Button, Input, Select, Radio, Icon, Modal, Card  } from 'antd';
import CommentsListContainer from '../common_comments/comments_list_container';

const { Meta } = Card;

export default class TopicItemContent extends React.Component {



    render(){
        
       var { uniquekey } = this.props;

        return(

            
            <CommentsListContainer socket={this.props.socket} uniquekey={uniquekey} hasCommentInput={false}/>                 

            
        )
    }
}




