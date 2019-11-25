import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge, Button } from 'antd';
import CommentComponent from '../../common_comments/comment_component';
import DeleteModal from '../../deleteModal';
import { parseDate, formatDate } from '../../../../utils/translateDate';

class ListContent extends React.Component {
  constructor(){
    super();
    this.state = {
      comments:[],
      visible:false,
      commentid:''
    }
  }

  componentDidMount(){
    var { commentid } = this.props;
    fetch(`/api/comment/getOneComment?commentid=${commentid}`)
      .then(response=>response.json())
      .then(json=>{
          var data = json.data;
          var { comments } = data;
          this.setState({comments});
      })
  }

  handleModalVisible(boolean, commentid){
      this.setState({visible:boolean,commentid})
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
    var { onCheckLogin, socket } = this.props;
    var { comments, visible, commentid, parentcommentid } = this.state;
    return (
        <div>
            {
                <div className="commentsContainer">
                    {
                        comments.length
                        ?
                        comments.map((item,index)=>(
                            <CommentComponent 
                                socket={socket} 
                                history={history}
                                key={index} 
                                isSub={false}
                                comment={item}
                                hasDelete={true}
                                onDelete={this.handleModalVisible.bind(this)}
                                onCheckLogin={onCheckLogin}
                            />
                        ))
                        :
                        null
                    }
                </div>
            }
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
           parentcommentid:'',
        }
    }

    componentDidMount(){
        var userid = localStorage.getItem('userid');
        fetch(`/api/comment/getUserComments?userid=${userid}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                var { comments } = data;
                this.setState({comments,isLoading:false});
            })       
    }

    handleDelete(data){
        var { comments } = data;
        this.setState({comments});
    }

    handleListVisible(boolean,commentid){
        this.setState({listVisible:boolean,commentid})
    }

    handleModalVisible(boolean, commentid, parentcommentid){
        this.setState({visible:boolean,commentid, parentcommentid})
    }

    render(){
        var { text, history, socket, onCheckLogin } = this.props;
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
                    <div  style={{padding:'10px 20px 20px 20px',borderRadius:'4px',backgroundColor:'#f7f7f7'}}>
                        <span style={{display:'inline-block',transform:'scale(0.7)',padding:'4px 0',transformOrigin:'left'}}>{`共发布${comments.length}条评论`}</span>
                        <div className="commentsContainer">
                            {
                                 comments.map((item,index)=>(
                                    <CommentComponent 
                                        socket={socket} 
                                        history={history}
                                        key={index} 
                                        isSub={true}
                                        comment={item}
                                        onShowList={this.handleListVisible.bind(this)}
                                        onDelete={this.handleModalVisible.bind(this)}
                                        onCheckLogin={onCheckLogin}
                                        forUser={true}
                                    />
                                ))
                            }
                        </div>
                    </div>
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
                        onDelete={this.handleDelete.bind(this)}
                        deleteType="comment"
                        parentcommentid={parentcommentid}
                    />
                    :
                    null
                }
                {
                    listVisible
                    ?
                    <Modal visible={listVisible} footer={null} onCancel={()=>this.handleListVisible(false)} destroyOnClose={true}>
                        <ListContent commentid={commentid} onCheckLogin={onCheckLogin} socket={socket}/>
                    </Modal>
                    :
                    null                   
                }
            </div>
                   
        )
    }
}


