import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Button } from 'antd';

import CommentsList from '../common_comments/comments_list';
import { parseDate, formatDate } from '../../../utils/translateDate';


const { Meta } = Card;


export default class MyCommentsList extends React.Component{
    constructor(){
        super();
        this.state={
           comments:[]
        }
    }

    
    componentDidMount(){
        var { data } = this.props;
        this.setState({comments:data})
        
    }

    handleDeleteComment(comments){
        this.setState({comments})
    }

    render(){
        var { text } = this.props;
        var  { comments } = this.state;
        
        return(
            <div>
                {
                    comments.length
                    ?
                    <CommentsList comments={comments} isSub={false} forUser={true}  onDelete={this.handleDeleteComment.bind(this)}/>
                    :
                    <div>{text}</div>
                }
            </div>
                   
        )
    }
}


