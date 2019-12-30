import React from 'react';
import { Upload, Icon, Modal, Form, Input, message, Button } from 'antd';

const FormItem = Form.Item;


class PicturesWall extends React.Component {
  constructor(){
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      uploadToken:'',
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
    fetch('/api/token')
        .then(response=>response.json())
        .then(json=>{
            this.setState({ fileList, uploadToken:json.data });
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

  handleSubmit(e){

    e.preventDefault();
    var { fileList, uploadToken } = this.state;
    var { onChangeImgUrl, onModalVisible } = this.props;
    var userid = localStorage.getItem('userid');
    var uploadPromise = [];
    if ( uploadToken && fileList && fileList.length){
        fileList.forEach(file=>{
           var promise = this._uploadToQiniu(file, uploadToken);
           uploadPromise.push(promise);
        });
        Promise.all(uploadPromise)
          .then(([...images])=>{
              //console.log(images);
              var imgUrl = images[0];
              fetch(`/api/usr/changeUserAvatar?url=${imgUrl}&userid=${userid}`)
                .then(response=>response.json())
                .then(()=>{
                    if (onChangeImgUrl) onChangeImgUrl(`http://image.renshanhang.site/${imgUrl}`);
                    if (onModalVisible) onModalVisible();
                })

          })
    } else {
        message.error('请先上传图片');
    }
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