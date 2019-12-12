import React from 'react';
import { Row, Col, Spin } from 'antd';

import style from './autoCarousel.style.css';

export default class AutoCarousel extends React.Component {
    
    constructor(){
        super();
        this.state = {
            currentIndex:0,
            isLoading:true,
            images:[]
        }
    }

    _fetchImg(url){
        return new Promise((resolve,reject)=>{
            fetch(url,{method:'get',responseType: 'blob'})
                .then(response=>response.blob())
                .then(blob=>{
                    //console.log(blob);
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
    
    _fetchAllImages(fetchImages, resolve){
        var allPromises = fetchImages.map(url=>{
            return this._fetchImg(url);
        });
        Promise.all(allPromises)
            .then(readableImgs=>{
                var images = [],readPromises=[];
                for(var i=0,len=readableImgs.length;i<len;i++){
                   (function(i,readImg){
                        var promise = new Promise((resolve,reject)=>{
                            readImg(readableImgs[i],resolve);
                        });
                        readPromises.push(promise);
                   })(i,this._readImgAsDataURL)
                }
                Promise.all(readPromises)
                    .then(images=>{
                        resolve(images);
                    })

            })
    }
    

    componentDidMount(){
        var { count } = this.props;      
        var typeArr = ['shehui','guonei','guoji','yule','keji'];
        var type = typeArr[Math.floor(Math.random()*(typeArr.length))];
        fetch(`/api/article/getArticleList?type=${type}&count=${count}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data, fetchImages = [];
                var container = this.container;
                if (container){
                    var width = (container.offsetWidth)/count   
                }
                for(var i=0,len=data.length;i<len;i++){
                    fetchImages.push(data[i].thumbnails[0]);
                }
                var promise = new Promise((resolve,reject)=>{
                    this._fetchAllImages(fetchImages,resolve);
                })
                promise.then(imgBlob=>{
                    data = data.map((item,index)=>{
                        item.thumbnails[0] = imgBlob[index]
                        return item;
                    })
                    this.setState({images:data,isLoading:false});
                    //this._setTimer();
                })
                
            })
    }

    handleClick(id){
        var { history } = this.props;
        if (history){
            history.push(`/details/${id}`);
        }
    }

    _setTimer(){
        var { count } = this.props;
        this.timer = setInterval(()=>{
                var { currentIndex } = this.state;
                ++currentIndex;
                if ( currentIndex < count ) {                   
                    this.setState({currentIndex:currentIndex})
                } else {
                    this.setState({currentIndex:0})
                }
            },3000)
    }

    handleMouseOver(index,e){
        var inner = e.toElement || e.relatedTarget;
        clearInterval(this.timer);        
        //this.setState({currentIndex:index});
        
    }

    handleMouseOut(e){
        //this._setTimer()
    }

    componentWillUnmount(){
        if (this.timer) {
            clearInterval(this.timer);
        }
        
    }
   
    render() {
        var { currentIndex, isLoading, images } = this.state;
        var { size } = this.props;
        return(

            <div ref={container=>this.container = container} className={style['auto-carousel']}>
                {
                    isLoading
                    ?
                    <Spin />
                    :
                    <div className={style.bg} onClick={this.handleClick.bind(this,images[currentIndex].articleId)} style={{backgroundImage:`url(${images[currentIndex].thumbnails[0]})`}}>
                        {
                            size == 'small'
                            ?
                            <div className={style['dot-container']}>
                                {
                                    images.map((item,index)=>(
                                        <span key={index} className={currentIndex==index?style.dot+' '+style.selected : style.dot}></span>
                                    ))
                                }
                            </div>
                            :
                            <div className={style["img-container"]}>
                                {
                                    images.map((item,index)=>(
                                        <div 
                                            style={{backgroundImage:`url(${item.thumbnails[0]})`}}
                                            className={currentIndex==index?style['selected']:''}
                                            onClick={this.handleClick.bind(this,item._id)}    
                                            onMouseOver={this.handleMouseOver.bind(this,index)}
                                            onMouseOut={this.handleMouseOut.bind(this)}
                                            key={index} 
                                            
                                        >
                                            <span className={style['text-container']}><span className={style.text}>{item.title}</span></span>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                        
                    </div>
                    
                }
                
                
            </div>
        )
    }
}


