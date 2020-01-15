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
            value:'',
            uploadToken:''
        }
    }

    _uploadToQiniu(file, uploadToken){
        var formData = new FormData();
        formData.append('file',file.originFileObj);
        formData.append('token',uploadToken);
        return new Promise((resolve,reject)=>{
            fetch('http://upload-z2.qiniup.com',{
              method:'post',
              body:formData
            }).then(response=>response.json())
              .then(data=>{
                  resolve(data.hash);
              })
        })
    }

    _resetFormFields(){
        var { form } = this.props;
        var { setFieldsValue } = form;
        setFieldsValue('comments','');
        this.setState({fileList:[]});
    }

    _fetchOwnServer(images){
        var { socket, commentType, uniquekey, isSub, commentid, parentcommentid, isAddComment, onAddComment, onUpdateFromSub, onUpdateReplies, onCloseReply } = this.props;
        var comments = this.props.form.getFieldValue('comments');
        var userid = localStorage.getItem('userid');
        var params = [], fetchParams = '';
        if (images && images.length){
            images.forEach(item=>{
                params.push({key:'images[]',value:item});
            })
        }
        params.push({key:'userid', value:userid});
        params.push({key:'content', value:comments});
        params.push({key:'uniquekey', value:uniquekey});
        params.push({key:'commentType', value:commentType});
        //  生成一条新评论逻辑
        if (isAddComment){
            for(var i=0,len=params.length;i<len;i++){
                fetchParams+=`${params[i].key}=${params[i].value}&`
            }          
            fetch(`/api/comment/addcomment?${fetchParams}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    var { commentid } = data;                       
                    if(onAddComment) onAddComment(data);
                    sendActionMsg(comments, userid, commentid, socket); 
                    this._resetFormFields();                                        
                })
        } else {
            //  回复评论逻辑
            params.push({key:'replyTo', value:commentid});
            params.push({key:'parentcommentid', value:isSub? parentcommentid:commentid});
            params.push({key:'isSub', value:isSub?true:''});   
            for(var i=0,len=params.length;i<len;i++){
                fetchParams+=`${params[i].key}=${params[i].value}&`
            }     
            fetch(`/api/comment/addreplycomment?${fetchParams}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    var { commentid } = data;  
                    if (isSub){
                        if (onUpdateFromSub) onUpdateFromSub(data);
                    } else {
                        if (onUpdateReplies) onUpdateReplies(data);
                    }
                    if (onCloseReply) onCloseReply();
                    sendActionMsg(comments, userid, commentid, socket);
                    this._resetFormFields();
                })        
        }
    }

    handleSubmit(e){
        e.preventDefault();
        var { form, onCheckLogin } = this.props;
        var { validateFields } = form;    
        var { fileList, uploadToken } = this.state;
        var userid = onCheckLogin();
        if (userid){
            validateFields(['comments'],(errs,values)=>{
                if(!errs){
                    var  { comments } = values;
                    if ( uploadToken && fileList && fileList.length){
                        var uploadPromise = [];
                        fileList.forEach(file=>{
                           var promise = this._uploadToQiniu(file, uploadToken);
                           uploadPromise.push(promise);
                        });
                        Promise.all(uploadPromise)
                            .then(([...uploadImg])=>{
                                var images = uploadImg.map(item=>`http://image.renshanhang.site/${item}`);                           
                                this._fetchOwnServer(images);
                            })           
                    } else {
                        this._fetchOwnServer();
                    }
                    
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
        fetch('/api/token')
            .then(response=>response.json())
            .then(json=>{
                this.setState({fileList, uploadToken:json.data});
            })
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
        var { leftPosition, showSelect, fileList } = this.state;
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
