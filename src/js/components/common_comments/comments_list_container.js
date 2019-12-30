import React from 'react';
import { Pagination, Select, Spin } from 'antd';
import CommentComponent  from './comment_component';
import CommentsInput from './comments_input';
import ShareModal from '../shareModal';

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
      commentid:'',
      currentPageNum:1,
      isLoading:true    
    }
  }

  componentDidMount(){
    this._loadComments()
  }

  _loadComments(num=1,order='time'){
    var { uniquekey, location, onSetReplies } = this.props;
    var userid = localStorage.getItem('userid');
    var finalPageNum = num;
    var commentid, parentcommentid ;
    var isSub = false;
    if ( location && location.search ){
        var pattern = /(\w+)=(.*?)&/g;
        var str = location.search;
        var params = {};
        var result = pattern.exec(str);
        while(result){
            params[result[1]] = result[2];
            result = pattern.exec(str);
        }
        
        finalPageNum = Number(params.pageNum);
        commentid = params.commentid;
        parentcommentid = params.parentcommentid;
        
    }
    //console.log(params);
        
      fetch(`/api/comment/getcomments?uniquekey=${uniquekey}&pageNum=${finalPageNum}&orderBy=${order}`)
          .then(response=>response.json())
          .then(json=>{
            var data = json.data;
            var { comments, total } = data; 
            //  从子评论追踪而来
            if (parentcommentid){
                comments = comments.map(comment=>{
                    if (comment._id == parentcommentid){
                        comment.replies = comment.replies.map(item=>{
                            item['selected'] = item._id == commentid ? true : false;
                            return item;
                        })
                    }
                    return comment;
                })
            }  else {
                    comments = comments.map(item=>{
                    item['selected'] = item._id == commentid ? true : false;
                    return item;
                })
            }    
            this.setState({comments,total,isLoading:false,currentPageNum:finalPageNum});
          })
         
 }

handlePageChange(num){
    this.setState({isLoading:true,currentPageNum:num});
    this._loadComments(num,this.state.order);
}


handleSelectChange(value){
  //console.log(value);
  this.setState({order:value,isLoading:true});
  this.setState((state)=>{
    this._loadComments(1,state.order);
  })
}

_updateTotalNum(total){
    this.setState({total});
}

handleAddComment(data){
    var { onUpdateItemComments } = this.props;
    var { total, comments, doc } = data;
    this.setState({comments, total});
    if ( onUpdateItemComments ) onUpdateItemComments(doc);
    
}

handleShareVisible(boolean, commentid, onUpdateShareBy){
    if (boolean === true){
      this.onUpdateShareBy = onUpdateShareBy;
      fetch(`/api/comment/getCommentInfo?commentid=${commentid}`)
      .then(response=>response.json())
      .then(json=>{   
          var str = json.data;      
          var data = formatContent(str); 
          this.setState({visible:boolean,text:str,translateData:data,commentid})
      })    
    } else {
      
      this.setState({visible:boolean})
    }
}

componentWillUnmount(){
    this.onUpdateShareBy = null;
}

render(){
  var { socket, uniquekey, warnMsg , item, noInput, commentType, history, onSetScrollTop, onUpdateItemComments, onCheckLogin } = this.props;
  var { comments, total, value, visible, text, translateData, commentid, isLoading, currentPageNum } = this.state;
  const dropdownStyle = {
    width:'160px',
    fontSize:'12px'
  }

  return (
      <div>
        {
           noInput
           ?
           null
           :
           <div style={{margin:'30px 0'}}>
              <CommentsInput isAddComment socket={socket} commentType={commentType} uniquekey={uniquekey} onAddComment={this.handleAddComment.bind(this)} onCheckLogin={onCheckLogin}/> 
           </div> 
        }
                         
        {
            comments.length 
            ?
            <div className="comment-select">
                <span><span className="text">全部评论</span><span className="num">{total}</span><span style={{display:'inline-block',transform:'scale(0.8)'}}>条</span></span>
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
                
        {
           isLoading
           ?
           <Spin/>
           :
           <div className="commentsContainer" >
              {
                  comments.length
                  ?
                  comments.map((item,key)=>(
                     <CommentComponent 
                         socket={socket} 
                         history={history}                         
                         onCheckLogin={onCheckLogin}
                         onVisible={this.handleShareVisible.bind(this)}
                         onSetScrollTop={onSetScrollTop}
                         onUpdateTotalNum={this._updateTotalNum.bind(this)}
                         onUpdateItemComments={onUpdateItemComments} 
                         isSub={false}
                         uniquekey={uniquekey}
                         comment={item}                   
                         key={key}
                         commentType={commentType}
                         
                     />
                  ))
                  :
                  <span>{warnMsg}</span>
              }
          </div>
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
              uniquekey={uniquekey}       
              onVisible={this.handleShareVisible.bind(this)} 
              text={text}
              item={item}
              translateData={translateData}
              onModel={commentType}
              onUpdateShareBy={this.onUpdateShareBy}
              commentid={commentid}
          />
          :
          null
        }
        
      </div>
      
      
    )
     
  }

}



