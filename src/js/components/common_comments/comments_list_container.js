import React from 'react';
import { findDOMNode } from 'react-dom';
import { Pagination, Select, Spin } from 'antd';
import CommentsList  from './comments_list';
import CommentsInput from './comments_input';
import ShareModal from './comment_share_modal';

import { formatContent } from '../../../utils/translateDate';

const { Option, OptGroup } = Select;

export default class CommentsListContainer extends React.Component{
  constructor(){
    super();
    this.state={
      comments:[],
      order:'time',
      total:0,
      value:'time',
      visible:false,
      text:'',
      translateData:[],
      currentPageNum:1,
      isLoad:true,
      forTrack:false    
    }
  }

  componentDidMount(){
    this._loadComments()
  }

  _loadComments(num=1,order='time'){
    //console.log(order);
    var { uniquekey, location } = this.props;
    var finalPageNum = num;
    var forTrack = false;
    if (location.state && location.state.pageNum){
        var { pageNum } = location.state;
        finalPageNum = pageNum;
        forTrack = location.state.forTrack;
    }
    var username = localStorage.getItem('username');
    //console.log(uniquekey);
    if (uniquekey){
      
      fetch(`/comment/getcomments?uniquekey=${uniquekey}&pageNum=${finalPageNum}&orderBy=${order}`)
      .then(response=>response.json())
      .then(json=>{
        var data = json.data;
        var { comments, total } = data; 
        var commentid = '',parentcommentid = '';
        if (location.state){
            commentid = location.state.commentid;
            parentcommentid = location.state.parentcommentid;
        } 
        comments = comments.map(item=>{
            item['owncomment'] = username === item.username ? true : false;
            item['selected'] = item._id == commentid ? true : false;
            item.replies = item.replies.map(reply=>{
              reply['owncomment'] = reply.fromUser === username ? true : false;
              return reply;
            })
            return item;
        })
        
        this.setState({comments,total,isLoad:false,currentPageNum:finalPageNum,forTrack});
        location.state = null;
      })
    }
    
    
 }

handlePageChange(num){
    this.setState({isLoad:true,currentPageNum:num});
    this._loadComments(num,this.state.order);
}


handleSelectChange(value){
  //console.log(value);
  this.setState({order:value,isLoad:true});
  this.setState((state)=>{
    this._loadComments(1,state.order);
  })
 
}

handleAddComment(list){
  this.setState({comments:list,total:list.length})
}

handleShareVisible(boolean,commentid,parentcommentid){
    if (boolean === true){
      fetch(`/comment/getCommentInfo?commentid=${commentid}&parentcommentid=${parentcommentid?parentcommentid:''}`)
      .then(response=>response.json())
      .then(json=>{   
          var str = json.data;      
          var data = formatContent(/(.*?)@([^@|\s|:]+:*)/g,str);      
          this.setState({visible:boolean,text:str,translateData:data})
      })    
    } else {
      this.setState({visible:boolean})
    }
}

render(){
  var { socket, uniquekey, hasCommentInput, text, shareType, item, commentType, history, setScrollTop } = this.props;
  var { comments, total, value, visible, text, translateData, isLoad, currentPageNum, forTrack } = this.state;
  
  const dropdownStyle = {
    width:'160px',
    fontSize:'12px'
  }

  return (
      <div style={{paddingTop:'40px'}}>
        <div>            
            {
                comments.length 
                ?
                <div>
                    <span style={{fontSize:'12px'}}>{`共${total}条评论`}</span>
                    <Select className="filter" onChange={this.handleSelectChange.bind(this)} dropdownStyle={dropdownStyle} size="small" defaultValue={value}  dropdownMatchSelectWidth={false}>
                      <OptGroup label="按时间">
                        <Option value="time">从近到远</Option>
                        <Option value="timeInvert">从远到近</Option>
                      </OptGroup>
                      <OptGroup label="按热度">
                        <Option value="hot">从高到低</Option>
                        <Option value="hotInvert">从低到高</Option>
                      </OptGroup>
                    </Select> 
                </div>     
                :
                null
            }     
        </div>
        

        {
          hasCommentInput
          ?
          <CommentsInput isAddComment socket={socket} commentType={commentType} uniquekey={uniquekey} onAddComment={this.handleAddComment.bind(this)}/>
          :
          null
        }
        {
           isLoad
           ?
           <Spin/>
           :
           <CommentsList 
              isSub={false}  
              socket={socket} 
              history={history} 
              comments={comments}
              commentType={commentType} 
              onVisible={this.handleShareVisible.bind(this)}
              forTrack={forTrack}
              setScrollTop={setScrollTop} 
              text="还没有用户评论呢!快来抢沙发吧～" />
        }  
        
         
        {
          comments.length
          ?
          <Pagination style={{padding:'20px 0'}} size="small" showQuickJumper current={currentPageNum} defaultPageSize={10} total={total} onChange={this.handlePageChange.bind(this)} hideOnSinglePage={true}/>
          :
          null
        }
        
        {
          visible
          ?
          <ShareModal 
              visible={visible} 
              toId={uniquekey}         
              onVisible={this.handleShareVisible.bind(this)} 
              text={text}
              item={item}
              data={translateData}
              shareType={shareType}
          />
          :
          null
        }
        
          
        
      </div>
      
      
    )
     
  }

}



