import React from 'react';
import { Row, Col, Spin } from 'antd';

import style from './style.css';

export default class AutoCarousel extends React.Component {
    
    constructor(){
        super();
        this.state = {
            width:0,
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
    /*
    componentDidMount(){
        var { data } = this.props;
        var allPromises = data.map(url=>{
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
                        //console.log(images);
                        this.setState({isLoading:false,images})
                    })

            })
        if (data.length){
            var container = this.container;
            if (container){
                var width = (container.offsetWidth)/(data.length)   
                this.setState({width})
            }
            this._setTimer();
            
        }        
    }
    */

    componentDidMount(){
        var { count } = this.props;
        
        var typeArr = ['shehui','guonei','guoji','yule','keji'];
        var type = typeArr[Math.floor(Math.random()*(typeArr.length))];
        fetch(`/api/article/getArticleList?type=${type}&count=${count}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                var container = this.container;
                if (container){
                    var width = (container.offsetWidth)/count   
                }
                this.setState({images:data,width,isLoading:false});
            })
    }

    handleClick(){

    }

    _setTimer(){
        var { data } = this.props;
        this.timer = setInterval(()=>{
                var { currentIndex } = this.state;
                ++currentIndex;
                if ( currentIndex < data.length ) {                   
                    this.setState({currentIndex:currentIndex})
                } else {
                    this.setState({currentIndex:0})
                }
            },3000)
    }

    handleMouseOver(index,e){
        var inner = e.toElement || e.relatedTarget;
        clearInterval(this.timer);        
        this.setState({currentIndex:index});
        
    }

    handleMouseOut(e){
        this._setTimer()
    }

    componentWillUnmount(){
        if (this.timer) {
            clearInterval(this.timer);
        }
        
    }
   
    render() {
        var { width, currentIndex, isLoading, images } = this.state;
        //var { data } = this.props;
        return(

            <div ref={container=>this.container = container} className={style['auto-carousel']}>
                {
                    isLoading
                    ?
                    <Spin />
                    :
                    <div className={style.bg}>
                        <img src={images[currentIndex].thumbnails[0]} />
                        {
                            images.map((item,index)=>(
                                <div 
                                    className={index===currentIndex?style.float+' '+style.selected:style.float}
                                    onClick={this.handleClick.bind(this)}

                                    onMouseOver={this.handleMouseOver.bind(this,index)}
                                    onMouseOut={this.handleMouseOut.bind(this)}
                                    key={index} 
                                    style={{
                                        width:width,
                                        left:index*width
                                    }}
                                >
                                    <img id={`img${index}`} src={item.thumbnails[0]} />
                                    <span className={style.text}>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    
                }
                
                
            </div>
        )
    }
}


