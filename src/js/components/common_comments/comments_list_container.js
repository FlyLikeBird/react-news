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
      isLoading:true,
      forTrack:false    
    }
  }

  componentDidMount(){
    this._loadComments()
  }

  _loadComments(num=1,order='time'){
    var { uniquekey, location } = this.props;
    var userid = localStorage.getItem('userid');
    var finalPageNum = num;
    var commentid, parentcommentid, forTrack ;
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
        console.log(params);
        finalPageNum = Number(params.pageNum);
        commentid = params.commentid;
        parentcommentid = params.parentcommentid;
        forTrack = params.forTrack ? true : false;
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
            console.log(comments);
            this.setState({comments,total,isLoading:false,currentPageNum:finalPageNum,forTrack});
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

handleAddComment(list){
  this.setState({comments:list,total:list.length})
}

handleShareVisible(boolean,commentid,parentcommentid,onUpdateShareBy){
    if (boolean === true){
      this.onUpdateShareBy = onUpdateShareBy;
      fetch(`/api/comment/getCommentInfo?commentid=${commentid}&parentcommentid=${parentcommentid}`)
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
  var { socket, uniquekey, warnMsg , item, commentType, history, onSetScrollTop, onCheckLogin } = this.props;
  var { comments, total, value, visible, text, translateData, commentid, isLoading, currentPageNum, forTrack } = this.state;
  const dropdownStyle = {
    width:'160px',
    fontSize:'12px'
  }

  return (
      <div>
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
        <CommentsInput isAddComment socket={socket} commentType={commentType} uniquekey={uniquekey} onAddComment={this.handleAddComment.bind(this)} onCheckLogin={onCheckLogin}/>          
        {
           isLoading
           ?
           <Spin/>
           :
           <div className="commentsContainer" >
              {
                  comments.map((item,key)=>(
                     <CommentComponent 
                         socket={socket} 
                         history={history}
                         
                         onCheckLogin={onCheckLogin}
                         
                         onSetScrollTop={onSetScrollTop} 
                         isSub={false}
                         uniquekey={uniquekey}
                         comment={item}
                         
                      
                         key={key}
                         commentType={commentType}
                         
                     />
                  ))
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
              actionInfo={{
                contentType:commentType
              }}
              item={item}
              data={translateData}
              contentType={commentType}
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



