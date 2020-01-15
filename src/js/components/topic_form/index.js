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
            uploadToken:'',
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
        setFieldsValue('title','');
        setFieldsValue('description','');
        setFieldsValue('tag',[]);
        this.setState({fileList:[], radioValue:0});
    }
    
    _fetchOwnServer(images){
        var { form, forEdit, forTopic, forAction, onUpdate, onEditTopicItem, item } = this.props;
        var { deleteImages, radioValue } = this.state;
        var { getFieldValue, setFieldsValue } = form;
        var title = getFieldValue('title');
        var description = getFieldValue('description');
        var tag = getFieldValue('tag');
        var userid = localStorage.getItem('userid'),username = localStorage.getItem('username');
        var fetchParams = '',params = [];
        if (tag && tag.length){
            tag.forEach(tag=>{
                params.push({key:'tags[]',value:tag})
            })
        }       
        if (images && images.length){
            for(var i=0,len=images.length;i<len;i++){
                params.push({key:'images[]',value:images[i]});
            } 
        }
              
        if ( forEdit ){
            if ( deleteImages && deleteImages.length){
                deleteImages.map(item=>{
                    params.push({key:'deleteImage[]',value:item});
                })
            }
            params.push({key:'topicId',value:item._id}); 
        }          

        params.push({key:'title',value:title});
        params.push({key:'description',value:description});
        params.push({key:'privacy',value:radioValue});
        params.push({key:'userid',value:userid});
        //console.log(params);
        for(var i=0,len=params.length;i<len;i++){
            fetchParams+=`${params[i].key}=${params[i].value}&`
        } 
        if ( forAction ){             
            fetch(`/api/action/create?${fetchParams}`,)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    if ( onUpdate ) onUpdate(data); 
                    this._resetFormFields();           
                })

        } else if (forTopic){
            fetch(`/api/topic/upload?${fetchParams}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    if (onUpdate) onUpdate(data);
                    this._resetFormFields();
                })
        } else if (forEdit){
            fetch(`/api/topic/edit?${fetchParams}`)
                .then(response=>response.json())
                .then(json=>{
                    var data = json.data;
                    if (onEditTopicItem) onEditTopicItem(data[0]); 
                    this._resetFormFields();
                })
        }
    }

    _validateFields(){
        var { onUpdate, onVisible, onEditTopicItem, form, forAction } = this.props;
        var { uploadToken, fileList } = this.state;
        var { validateFields, setFieldsValue } = form; 
             
        validateFields(['title','description','tag'],{force:true},(errors,values)=>{           
            if(!errors){                    
                //  需要上传图片
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
        fetch('/api/token')
            .then(response=>response.json())
            .then(json=>{
                var token = json.data;
                /*
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
                        this.setState({fileList, uploadToken:token});
                    }
                    */ 
                
                this.setState({fileList, uploadToken:token});
                    
            })
        
    } 

    handleSelect(value,e){
        var { setFields, getFieldValue } = this.props.form;
        var { allTags } = this.state;
        allTags = allTags.map(item=>item.tag);
        setTimeout(()=>{
            var selectedTags = getFieldValue('tag');
            //console.log(selectedTags);
            if (checkRepeatTags(value,allTags)){
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
        var { title, description,  tag } = getFieldsValue(['title','description','tag']);        
        var { fileList, allTags, radioValue } = this.state;      
        var images = [], tags=[], allPromise = [];
        console.log(tag);
        if (tag && tag.length){
            tag.map(item=>{
                for(var i=0,len=allTags.length;i<len;i++){
                    if (allTags[i]._id==item){
                        tags.push({tag:allTags[i].tag});
                        break;
                    }
                }
            })
        } 
        console.log(tags);
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
                        tags,
                        user:{username:localStorage.getItem('username'), userImage:localStorage.getItem('avatar')},
                        privacy:radioValue,
                        view:0,
                        follows:[],
                        shareBy:[],
                        replies:0
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

    handleDeletePrevImages(index){
        var { prevImages, deleteImages } = this.state;
        var newImages = [...prevImages];
        newImages.splice(index,1);
        deleteImages.push(prevImages[index]);
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
                                                            <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} key={index} className="topic-img-container" style={{backgroundImage:`url(${item})`}}>
                                                                <div className="topic-form-mask"><Icon type="delete" onClick={this.handleDeletePrevImages.bind(this,index)}/></div>
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
                    <TopicListItem data={previewItem} forPreview={true} />
                </Modal>
            </div>
                       
        )
    }
    

    
}

export default TopicForm = Form.create()(TopicForm);


