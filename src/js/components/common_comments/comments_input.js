import React from 'react';
import { Form, Input, Button ,Select, Icon, Upload } from 'antd';

import { formatContent } from '../../../utils/translateDate';
import  CommentUserSelect from './comments_user_select';
const FormItem = Form.Item;
const { TextArea } = Input;

function sendActionMsg(content, userid, commentid, socket){
    var data = formatContent(content);
    if (data.length){
        //  去除user为null值的情况
        data = data.filter(item=>item.user);     
        var users = data.map(item=>item.user);       
        socket.emit('send@Msg', userid, users, commentid);
    }          
}

class CommentsInput extends React.Component{
    constructor(){
        super();
        this.state= {
            showSelect:false, 
            leftPosition:0,                    
            listContent:[],
            fileList:[],
            searchContent:[],
            value:''
        }
    }

    handleSubmit(e){
        e.preventDefault();
        var { form, onCheckLogin } = this.props;
        var { validateFields, setFieldsValue } = form;    
        var { fileList } = this.state;
        var userid = onCheckLogin();
        if (userid){
            validateFields(['comments'],(errs,values)=>{
                var { socket, commentType, uniquekey, isAddComment, onAddComment, onUpdateFromSub, onUpdateReplies, onCloseReply } = this.props;
                if(!errs){
                    var  { comments } = values;
                    //  生成一条新评论逻辑
                    if (isAddComment){
                        var formData = new FormData();
                        for(var i=0,len=fileList.length;i<len;i++){
                            formData.append('images',fileList[i].originFileObj);
                        }
                        formData.append('userid', userid);
                        formData.append('content',comments);
                        formData.append('commentType',commentType);
                        formData.append('uniquekey',uniquekey)                    
                        fetch('/api/comment/addcomment',{
                            method:'post',
                            body:formData
                        })
                        .then(response=>response.json())
                        .then(json=>{
                            var data = json.data;
                            var { comments, commentid } = data;                       
                            if(onAddComment) onAddComment(comments);
                            sendActionMsg(values['comments'], userid, commentid, socket);                                         
                        })
                    } else {
                        //  回复评论逻辑
                        var { isSub, commentType, uniquekey, parentcommentid, commentid } = this.props;
                        var formData = new FormData();
                        for(var i=0,len=fileList.length;i<len;i++){
                            formData.append('images',fileList[i].originFileObj);
                        }
                        formData.append('fromUser',userid);
                        formData.append('content',comments);
                        formData.append('replyTo',commentid);
                        formData.append('commentType', commentType);
                        formData.append('parentcommentid', isSub? parentcommentid:commentid);
                        formData.append('isSub',isSub?true:'');
                        formData.append('uniquekey',uniquekey)        
                        fetch(`/api/comment/addreplycomment`,{
                            method:'post',
                            body:formData
                        })
                        .then(response=>response.json())
                        .then(json=>{
                            var data = json.data;
                            var { commentid, replies } = data;  
                            if (isSub){
                                if (onUpdateFromSub) onUpdateFromSub(replies);
                            } else {
                                if (onUpdateReplies) onUpdateReplies(replies);
                            }
                            if (onCloseReply) onCloseReply();
                            sendActionMsg(values['comments'], userid, commentid, socket);
                        })        
                    }
                    setFieldsValue({'comments':''});
                    this.setState({fileList:[]})
                }
            })
        }

    }

    checkComments(rule,value,callback){
      
      if (value && value.match(/^\s+$/)){
        callback('请输入正常的评论内容！');
      } else {
        callback();       
      }    
    }
    
    handleKeyDown(e){        
        if(e.keyCode === 50 && e.shiftKey){
            if(this.textArea && this.textArea.textAreaRef){
                var textarea = this.textArea.textAreaRef;
                var start = textarea.selectionStart;  
                var leftPosition = start * 8 + 'px';   
                setTimeout(()=>{
                    this.setState({showSelect:true,leftPosition});
                },100)                      
                              
            }
            
        }
    }
    
    handleCloseUserSelect(){
        this.setState({showSelect:false})
    }

    handleBeforeUpload(file){
        //console.log(file);
        const isJPG = file.type === 'image/jpeg';
        const isJPEG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        if (!(isJPG || isJPEG || isGIF || isPNG)) {
          Modal.error({
            title: '只能上传JPG 、JPEG 、GIF、 PNG格式的图片~',
          });
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          Modal.error({
            title: '超过5M限制，不允许上传~',
          });
          return false;
        }
        return false;
    }

    getBase64(file){
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {file.thumbUrl=reader.result;resolve(reader.result)};
        reader.onerror = error => reject(error);
      });
    }
    
    handlePreview(file){    
        if (!file.url && !file.preview) {            
          var promise = getBase64(file.originFileObj);
          promise.then(data=>{
            file.preview = data;
            this.setState({
                previewImage: file.url || file.preview,
                previewVisible: true,
            });
          })
        } else {
            this.setState({
                previewImage: file.url || file.preview,
                previewVisible: true,
            });
        }         
    }   
        
    handleChange({ fileList }){
        this.setState({ fileList });
    } 

    setTextareaValue(value){
        var { form } = this.props;
        var result = '';
        var { getFieldValue, setFieldsValue } = form;
        var prevValue = getFieldValue('comments');
        if (value){
            prevValue = prevValue.substring(0,prevValue.length-1);
            result = prevValue + value;
        } else {
            
            result = prevValue;
        }        
        setFieldsValue({'comments':result});
        if(this.textArea && this.textArea.textAreaRef){
            var textarea = this.textArea.textAreaRef;
            textarea.focus();
        }
    }

    render(){
        
        var  {getFieldDecorator} = this.props.form;
        var { leftPosition, showSelect, fileList, value } = this.state;
        const selectStyle = {
            display:'none',
            width:'180px',
            position:'absolute',
            left:'0',           
            top:'0'

        }
        
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        
        return(
            <div style={{position:'relative',margin:'10px 0'}}>        
                <Form className="comment-form" onSubmit={this.handleSubmit.bind(this)} >
                    <FormItem>
                        {getFieldDecorator('comments',{
                            rules:[{
                                required:true,
                                message:'评论不能为空！'
                            },{
                                validator:this.checkComments
                            }]
                        })(
                          <TextArea 
                                rows={3}
                                style={{fontSize:'12px'}} 
                                ref={textArea=>this.textArea = textArea} 
                                //onKeyDown={this.handleKeyDown.bind(this)} 
                                onKeyDown={this.handleKeyDown.bind(this)}
                                placeholder="发表你的看法吧~输入@可通知其他用户" 
                            /> 
                        )}
                    </FormItem>
                    <FormItem>
                            {
                                getFieldDecorator('images')(
                                    <Upload
                                       className="user"
                                       headers={
                                         {'Access-Control-Allow-Origin':'*'}
                                       }      
                                       listType="picture-card"
                                       
                                       fileList={fileList}
                                       beforeUpload={this.handleBeforeUpload.bind(this)}
                                       onPreview={this.handlePreview.bind(this)}
                                       onChange={this.handleChange.bind(this)}
                                      >
                                       {fileList.length >= 6 ? null : uploadButton}
                                      </Upload>
                                )
                            }
                    </FormItem>
                    <Button type="primary" style={{margin:'0 2px'}} size="small" htmlType="submit">评论</Button>
                </Form>
                {
                    showSelect
                    ?
                    <CommentUserSelect 
                        leftPosition={leftPosition} 
                        onSelect={this.setTextareaValue.bind(this)}
                        onClose={this.handleCloseUserSelect.bind(this)} 
                    />
                    :
                    null
                }               
            </div>                   
            
        )
        
    }
}


export default CommentsInput = Form.create()(CommentsInput);
