import React from 'react';

import { Upload, Form, Button, Input, Select, Radio, Icon, Modal, Card, message  } from 'antd';
import TopicListItem  from '../topic_list/topic_list_item';

const { Meta } = Card;
const { Option } = Select;
const { TextArea } = Input;

function getBase64(file){
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=>resolve(reader.result);
        reader.onerror = error => reject(error);
      });
}

function checkRepeatTags(tag,tags){
    var result = false;
    
    tags.map(item=>{
        if(item === tag){
            result = true;
        }
    })
    return result;
}

class TopicForm extends React.Component{
    constructor(){
        super();
        this.state={
            allTags:[],
            fileList:[],
            radioValue:0,
            previewVisible:false,
            previewImage:'',
            topicPreview:false,
            previewItem:{},
            prevImages:[],
            deleteImages:[]          
        }
    }

    _editTopic(props){
        var { item, form } = props;
        var { allTags } = this.state;
        var { setFieldsValue } = form;
        var { description, title, images, privacy, tags ,title, _id } = item;
        var selectedTags = tags.map(item=>item._id);
        setFieldsValue({
                'title':title,
                'description':description,
                'tag':selectedTags
                
            })
            
        this.setState({radioValue:privacy,prevImages:images})
    }

    componentDidMount(){
        var { forEdit } = this.props;
        fetch(`/api/tag/getAllTags`)
            .then(response=>response.json())
            .then(json=>{
                var tags = json.data;
                this.setState({allTags:tags});
                if (forEdit){
                    this._editTopic(this.props);
                }
        })        
    }

    _validateFields(isEdit,topicId){
        var { onUpdate, onVisible, onEditTopicItem, form, forAction } = this.props;
        var { validateFields, setFieldsValue } = form;        
        validateFields(['title','description','tag'],{force:true},(errors,values)=>{
            //console.log(errors);
            if(!errors){                
                var formData = new FormData();
                var { fileList, deleteImages, radioValue } = this.state;
                var { title, description, tag } = values;
                var userid = localStorage.getItem('userid'),username = localStorage.getItem('username');

                fileList.forEach(file=>{
                    formData.append('images',file.originFileObj)
                })
                if (tag && tag.length){
                    for(var i=0,len=tag.length;i<len;i++){
                        formData.append('tags',tag[i])
                    }
                }                
                if ( isEdit ){
                    for(var i=0,len=deleteImages.length;i<len;i++){
                        formData.append('deleteImage',deleteImages[i])
                    }
                    formData.append('topicId',topicId);
                    
                }                
                formData.append('title',title);
                formData.append('description',description);
                formData.append('privacy',radioValue);
                formData.append('userid',userid);
                if ( isEdit ){
                    fetch('/api/topic/edit',{method:'post',body:formData})
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;
                        if (onEditTopicItem) onEditTopicItem(data[0]);
                    })
                } else if ( forAction ) {
                    fetch(`/api/action/create`,{method:'post',body:formData})
                        .then(response=>response.json())
                        .then(json=>{
                            var data = json.data;
                            if ( onUpdate ) onUpdate(data);
                        })
                }  else {
                    fetch('/api/topic/upload',{method:'post',body:formData})                    
                    .then(response=>response.json())
                    .then(json=>{
                        var data = json.data;                           
                        if ( onUpdate ) onUpdate(data);
                    })
                }
                setFieldsValue({'title':''});
                setFieldsValue({'description':''});
                setFieldsValue({'tags':[]}); 
                this.setState({fileList:[]});
                if ( onVisible ) onVisible(false);
            }
        })
    }

    handleSubmit(e){
        e.preventDefault();
        this._validateFields(false);
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
 
    handleImgPreview(file){    
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
        var { forEdit } = this.props;
        if (forEdit){
            //  编辑表单页面多了验证配图重复性的逻辑
            var { prevImages } = this.state;
            if ( fileList && fileList.length ) {
                var currentImage = fileList[0].name;
                var exist = false;            
                for(var i=0,len=prevImages.length;i<len;i++){
                    if ( prevImages[i].originalname == currentImage){
                        exist = true;
                        break;
                    }
                }
                if (exist){
                    message.error('已经存在该配图了!')
                    
                } else {
                    this.setState({fileList})
                }
            } else {
                //  删除预览图逻辑
                this.setState({fileList})
            }
            
        } else {
            this.setState({ fileList });
        }
        
    } 

    handleSelect(value,e){
        var { setFields, getFieldValue } = this.props.form;
        var { tags } = this.state;
        tags = tags.map(item=>item.tag);
        setTimeout(()=>{
            var selectedTags = getFieldValue('tag');
            //console.log(selectedTags);
            if (checkRepeatTags(value,tags)){
                setFields({
                    tag:{
                        value:selectedTags,
                        errors:[new Error('该标签已存在!')]
                    }
                });

                setTimeout(()=>{
                    selectedTags.pop();
                    setFields({
                        tag:{
                            value:selectedTags,
                            errors:null
                        }
                    })
                },1000)
            } else if (selectedTags.length > 5 ) {
                 setFields({
                    tag:{
                        value:selectedTags,
                        errors:[new Error('最多只能选5个标签!')]
                    }
                })
            }

        },0)      
    }
    
    handleDeselect(value){
        var { setFields, getFieldValue } = this.props.form;
        setTimeout(()=>{
            var selectedTags = getFieldValue('tag');
            if (selectedTags.length<=5){
                setFields({
                    tag:{
                        value:selectedTags,
                        errors:null
                    }
                })
            }
        },0)
    }

    checkUserInput(rule,value,callback){
        if (value.match(/^\s+$/)){
            callback('话题标题和内容不能为空!')
        } else {
            callback()
        }
    }

    handleRadioChange(e){
        this.setState({
            radioValue:e.target.value
        })
    }

    handleTopicVisible(boolean){
        this.setState({topicPreview:boolean})
    }

    handleTopicPreview(){
        var { form } = this.props;
        var { getFieldsValue } = form;
        var { title, description,  tag } = getFieldsValue(['title','description','images','tag']);        
        var { fileList, tags, radioValue } = this.state;
        
        var images = [],allPromise = [];
        if (tag) {
            tag = tag.map(item=>{
                var str = '';
                for(var i=0,len=tags.length;i<len;i++){
                    if (item == tags[i]._id){
                        str = tags[i].tag;
                        break;
                    }
                }
                return str;
            });
        } else {
            tag = []
        }
        for(var i=0,len=fileList.length;i<len;i++){
            var promise = getBase64(fileList[i].originFileObj);
            allPromise.push(promise);
        }

        Promise.all(allPromise)
            .then(images=>{
                //console.log(images);
                images = images.map(item=>{return {filename:item}});
                var obj = {
                        title,
                        description,
                        images,
                        tag,
                        sponsor:localStorage.getItem('username'),
                        privacy:radioValue,
                        view:0,
                        follows:[],
                        shareBy:[],
                        content:[]
                };
                this.setState({previewItem:obj,topicPreview:true})
            })
    }

    handleEdit(id){
        var { onCloseModal } = this.props;
        this._validateFields(true,id);
        if (onCloseModal) onCloseModal(false,{});
    }

    handleMouseOver(e){
        var target = e.currentTarget;
        if (target){
            target.childNodes[0].style.opacity = 1;
        }
    }

    handleMouseOut(e){
        var target = e.currentTarget;
        if (target){
            target.childNodes[0].style.opacity = 0;
        }
    }

    handleDeletePrevImages(id){
        var { prevImages, deleteImages } = this.state;
        var newImages = [...prevImages];
        deleteImages.push(id);
        var deleteIndex = 0;
        prevImages.map((item,index)=>{
            if (item._id == id){
                deleteIndex = index
            }
        })
        newImages.splice(deleteIndex,1);
        this.setState({prevImages:newImages,deleteImages});
    }

    render(){
        var { visible, form, forEdit, onVisible, forAction, item, onCloseModal } = this.props;
        var { allTags, fileList, radioValue, previewVisible, previewImage, topicPreview, previewItem, prevImages } = this.state;
        var { getFieldDecorator } = form;

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
        };

        const tailFormItemLayout = {
              wrapperCol: {
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: 20,
                  offset: 4,
                },
              },
        };

        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );

        const tagsContent = allTags.length
                            ?
                            allTags.map((item,index)=>(
                                <Option className="float" key={index} value={item._id}>
                                    <span>{item.tag}</span>
                                </Option>
                            ))
                            :
                            null
        return(

            <div className="topic-form">             
                <div style={{marginTop:'20px',display:visible?'block':'none'}}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit.bind(this)}>
                        {
                            forAction 
                            ?
                            null
                            :
                            <Form.Item label="话题名称">
                                {
                                    getFieldDecorator('title',{
                                        rules:[{
                                            required:true,
                                            message:'话题名称不能为空'
                                        },{
                                            validator:this.checkUserInput.bind(this)
                                        }]
                                    })(
                                        <Input />
                                    )
                                }
                            </Form.Item>
                        }
                        
                        <Form.Item label={ forAction ? '说点什么吧~': '话题描述'}>
                            {
                                getFieldDecorator('description',{
                                    rules:[{
                                        required:true,
                                        message:'内容不能为空'
                                    },{
                                        validator:this.checkUserInput.bind(this)
                                    }]
                                })(
                                    <TextArea rows={4}/>
                                )
                            }
                        </Form.Item>
                        {
                            forEdit
                            ?
                            <Form.Item {...tailFormItemLayout}>                                
                                    <div>
                                        {
                                            prevImages && prevImages.length
                                            ?
                                            <div>
                                                <span>之前的配图:</span>
                                                <div>
                                                    {
                                                        prevImages.map((item,index)=>(
                                                            <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} key={index} className="topic-img-container" style={{backgroundImage:`url(${item['filename']})`}}>
                                                                <div className="topic-form-mask"><Icon type="delete" onClick={this.handleDeletePrevImages.bind(this,item._id)}/></div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            :
                                            null
                                            
                                        }
                                    </div>                                
                            </Form.Item>
                            :
                            null
                        }
                        <Form.Item {...tailFormItemLayout}>
                            {
                                getFieldDecorator('images')(
                                    <Upload
                                       headers={
                                         {'Access-Control-Allow-Origin':'*'}
                                       }      
                                       listType="picture-card"
                                       
                                       fileList={fileList}
                                       beforeUpload={this.handleBeforeUpload.bind(this)}
                                       onPreview={this.handleImgPreview.bind(this)}
                                       onChange={this.handleChange.bind(this)}
                                      >
                                       {fileList.length >= (forEdit?(6-prevImages.length):6) ? null : uploadButton}
                                      </Upload>
                                )
                            }
                        </Form.Item>
                        {
                            forAction
                            ?
                            null
                            :
                            <Form.Item label="话题标签">
                                {
                                    getFieldDecorator('tag')(
                                        <Select onDeselect={this.handleDeselect.bind(this)} onSelect={this.handleSelect.bind(this)} mode="tags" >
                                            { tagsContent }
                                        </Select>
                                    )
                                }                   
                            </Form.Item>
                        }
                        
                        <Form.Item label="隐私设置">
                            
                                
                                    <Radio.Group onChange={this.handleRadioChange.bind(this)} value={radioValue}>
                                        <Radio value={0}>公开的</Radio>
                                        <Radio value={1}>仅对关注的人可见</Radio>
                                        <Radio value={2}>私密的仅自己可见</Radio>
                                    </Radio.Group>
                                
                            
                        </Form.Item>
                        
                        
                        {
                            forEdit
                            ?
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" onClick={this.handleEdit.bind(this,item._id)} style={{marginRight:'4px'}}>修改</Button>
                                <Button type="primary" onClick={this.handleTopicPreview.bind(this)} style={{marginRight:'4px'}}>预览</Button>
                                <Button onClick={()=>onCloseModal(false,{})}>取消</Button>
                            </Form.Item>
                            :
                            <Form.Item {...tailFormItemLayout}>
                                <Button htmlType="submit" type="primary" style={{marginRight:'4px'}}>创建</Button>
                                <Button type="primary" onClick={this.handleTopicPreview.bind(this)} style={{marginRight:'4px'}}>预览</Button>
                                <Button onClick={()=>onVisible(false)}>取消</Button>
                            </Form.Item>

                        }
                    
                       
                    </Form>
                </div>
                <Modal visible={previewVisible} className="no-bg" footer={null} onCancel={()=>this.setState({previewVisible:false})}>
                    <img alt="example"  src={previewImage} />
                </Modal>
                <Modal visible={topicPreview} footer={null} onCancel={()=>this.setState({topicPreview:false})}>
                    <TopicListItem item={previewItem} forPreview={true} />
                </Modal>
            </div>
                       
        )
    }
    

    
}

export default TopicForm = Form.create()(TopicForm);


