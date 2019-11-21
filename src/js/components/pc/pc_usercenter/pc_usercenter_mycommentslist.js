import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Button } from 'antd';
import CommentsList from '../../common_comments/comments_list';
import DeleteModal from '../../deleteModal';
import { parseDate, formatDate } from '../../../../utils/translateDate';
const { Meta } = Card;

class ListContent extends React.Component {
  constructor(){
    super();
    this.state = {
      comments:[],
      visible:false,
      commentid:'',
      parentcommentid:''
    }
  }

  componentDidMount(){
    var { commentid } = this.props;
    fetch(`/api/comment/getOneComment?commentid=${commentid}`)
      .then(response=>response.json())
      .then(json=>{
          var comments = json.data;
          comments = comments.map(item=>{

              var username = localStorage.getItem('username');
              item.replies = item.replies.map(reply=>{
                reply['owncomment'] = reply.fromUser === username ? true : false;
                return reply;
              })
              return item
                    
          })
          this.setState({comments});
      })
  }

  handleModalVisible(boolean, commentid, parentcommentid){
      this.setState({visible:boolean,commentid,parentcommentid})
  }

  handleDelete(){
        var deleteIndex = 0;
        var { comments, commentid } = this.state;
        var data = [...comments];
        var replies = comments[0].replies;
        for(var i=0,len=replies.length;i<len;i++){
            if (replies[i]._id === commentid){
                deleteIndex = i;
                break;
            }
        }
        replies.splice(deleteIndex,1);
        data[0].replies = replies;
        this.setState({comments:data})

  }

  render(){
    var { comments, visible, commentid, parentcommentid } = this.state;
    return (
        <div>
            <CommentsList comments={comments} isSub={false} hasDelete={true} onDelete={this.handleModalVisible.bind(this)}/>
            <DeleteModal 
                visible={visible} 
                onVisible={this.handleModalVisible.bind(this)} 
                deleteId={commentid}
                parentcommentid={parentcommentid} 
                onDelete={this.handleDelete.bind(this)}
                deleteType="comment"
            />
        </div>
        
    )
  }
}


export default class MyCommentsList extends React.Component{
    constructor(){
        super();
        this.state={
           comments:[],
           isLoading:true,
           visible:false,
           listVisible:false,
           commentid:'',
           parentcommentid:''
        }
    }

    componentDidMount(){
        var userid = localStorage.getItem('userid');
        fetch(`/api/usr/getUserComments?userid=${userid}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({comments:data,isLoading:false});
            })       
    }

    handleDelete(){
        var { commentid, comments } = this.state;
        var data = [...comments];
        var deleteIndex = 0;
        for(var i=0,len=comments.length;i<len;i++){
            if(comments[i]._id === commentid){
                deleteIndex = i;
                break;
            }
        }
        data.splice(deleteIndex,1)
        this.setState({comments:data})
    }

    handleListVisible(boolean,commentid,parentcommentid){
        this.setState({listVisible:boolean,commentid,parentcommentid})
    }

    handleModalVisible(boolean, commentid, parentcommentid){
        this.setState({visible:boolean,commentid,parentcommentid})
    }

    render(){
        var { text, history } = this.props;
        var  { comments, visible, commentid, parentcommentid, listVisible, isLoading } = this.state;
        
        return(
            <div>
                {
                    isLoading
                    ?
                    <Spin/>
                    :
                    comments.length
                    ?
                    <CommentsList 
                        comments={comments} 
                        isSub={false} 
                        forUser={true}
                        history={history}
                        onDelete={this.handleModalVisible.bind(this)}
                        onShowList={this.handleListVisible.bind(this)}
                    />
                    :
                    <div>{text}</div>
                }
                {
                    visible
                    ?
                    <DeleteModal 
                        visible={visible} 
                        onVisible={this.handleModalVisible.bind(this)} 
                        deleteId={commentid}
                        parentcommentid={parentcommentid} 
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="comment"
                    />
                    :
                    null
                }
                {
                    listVisible
                    ?
                    <Modal visible={listVisible} footer={null} onCancel={()=>this.handleListVisible(false)} destroyOnClose={true}>
                      <ListContent commentid={ parentcommentid ? parentcommentid :commentid }/>
                    </Modal>
                    :
                    null                   
                }
            </div>
                   
        )
    }
}


