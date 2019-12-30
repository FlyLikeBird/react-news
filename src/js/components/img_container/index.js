import React from 'react';
import { Icon, Modal } from 'antd';
import style from './style.css';

export default class ImgContainer extends React.Component{
    
    constructor(){
        super();
        this.state = {
            dataURL:'',
            visible:false
        }
    }

    _fetchImg(url){
        return new Promise((resolve,reject)=>{
            fetch(url,{method:'get',responseType: 'blob'})
                .then(response=>response.blob())
                .then(blob=>{
                    resolve(blob);
                })
        })
    }

    _readImgAsDataURL(blob,resolve){
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function(){
            resolve(reader.result);
        }
    }

    _createImgDataURL(resolve){
        var { bg } = this.props;
        var promise = this._fetchImg(bg);
        promise.then(blob=>{
            var promise = new Promise((resolve, reject)=>{
                this._readImgAsDataURL(blob, resolve);
            });
            promise.then(dataURL=>{
                if (resolve){
                    resolve(dataURL);
                    this.setState({dataURL});
                } else {
                    this.setState({dataURL, visible:true});
                }
            })
        })
    }

    componentWillReceiveProps(newProps){
        var { single } = this.props;
        if (single){
            this.setState({img:newProps.bg});
            return;
        } 
        if (this.props.bg != newProps.bg){
            this.setState({img:newProps.bg});
        }

    }

    handleMouseOver(e){
        var target = e.currentTarget;
        var inner = e.fromElement || e.relatedTarget;
        if (!target.contains(inner)){
            if (target.style.opacity == 0) {
                target.style.opacity = 1;
            } else {
                target.style.opacity = 0;
            }
        }   
    }

    handleMouseOut(e){
        var target = e.currentTarget;
        var inner = e.toElement || e.relatedTarget;
        if (!target.contains(inner)){
            if (target.style.opacity == 0) {
                target.style.opacity = 1;
            } else {
                target.style.opacity = 0;
            }
        }   
    }

    handlePreview(){
        this._createImgDataURL();
    }

    _createDownloadLink(url){
        var a = document.createElement('a');
        var event = new MouseEvent('click');
        a.download = url;
        a.href = url;
        a.dispatchEvent(event);
    }

    handleDownload(){
        var { dataURL } = this.state;
        if (!dataURL){
            var promise = new Promise((resolve, reject)=>{
                this._createImgDataURL(resolve);
            });
            promise.then(url=>{
                this._createDownloadLink(url);
            })
        } else {
            this._createDownloadLink(dataURL);
        }
        
    }

    render(){
        var { single, bg } = this.props;
        var { visible, dataURL } = this.state;
        return (
            <div className={ single ? `${style.container} ${style.single}` : style.container}>
                <div className={style['img-container']} style={{backgroundImage:`url(${bg})`}}>
                    <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}  className={style['modal-container']}>
                        <Icon type="eye" onClick={this.handlePreview.bind(this,true)}/>
                        <Icon type="download" onClick={this.handleDownload.bind(this)}/>
                    </div>
                </div>
                {
                    visible
                    ?
                    <Modal visible={visible} className="user-preview" footer={null} onCancel={()=>this.setState({visible:false})}>
                        <img src={dataURL} />
                    </Modal>
                    :
                    null
                }
            </div>
        )
    }
    
}



