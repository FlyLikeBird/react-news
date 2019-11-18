import React from 'react';
import { Upload, Icon, Modal, Form, Input, Button } from 'antd';

const FormItem = Form.Item;


class PicturesWall extends React.Component {
  constructor(){
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  }
  
  handleCancel(){
     this.setState({ previewVisible: false });
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

  checkImageWH(){

  }

  getBase64(file){
    return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  }

  handlePreview(file){

    if (!file.url && !file.preview) {
      file.preview = this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }   
    
  handleChange({ fileList }){
    this.setState({ fileList });
  } 

  handleSubmit(e){

    e.preventDefault();
    
    var formData = new FormData();

    var fileData = this.props.form.getFieldsValue();
    
    formData.append('file',fileData.upload.file);
    formData.append('userid',localStorage.getItem('userid'));
    //console.log(fileData.upload.file)
    
    fetch('/usr/upload',{
      method:'post',
      body:formData
    }).then(response=>response.json())
      .then(data=>{
        //console.log(data);
        var imgUrl = data.data.imgUrl;

        if (this.props.onChangeImgUrl) {
          this.props.onChangeImgUrl(imgUrl)
        }

        if(this.props.onModalVisible){
          this.props.onModalVisible()
        }
      })
      

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormItem>
            { getFieldDecorator('upload')(
          
              <Upload
                name="test"
               
               headers={
                 {'Access-Control-Allow-Origin':'*'}
               }      
               listType="picture-card"
               
               fileList={fileList}
               beforeUpload={this.handleBeforeUpload.bind(this)}
               onPreview={this.handlePreview.bind(this)}
               onChange={this.handleChange.bind(this)}
              >
               {fileList.length >= 1 ? null : uploadButton}
              </Upload>
          
            )}
          </FormItem>
          <Button type="primary" htmlType="submit">更换头像</Button>
        </Form>
        
       
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)} okText={'更换图像'}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  } 
}

export default PicturesWall = Form.create()(PicturesWall);