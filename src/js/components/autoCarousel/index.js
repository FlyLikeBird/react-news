import React from 'react';
import { Row, Col, Spin } from 'antd';
import style from './autoCarousel.style.css';

export default class AutoCarousel extends React.Component {
    
    constructor(){
        super();
        this.bgDom = {};
        this.state = {
            thumbnailIndex:0,
            bgIndex:0,
            prevIndex:0,
            circle:false,
            isLoading:true,
            data:[]
        }
    }

    
    componentDidMount(){
        var { count } = this.props;      
        var typeArr = ['shehui','guonei','guoji','yule','keji'];
        var type = typeArr[Math.floor(Math.random()*(typeArr.length))];
        fetch(`/api/article/getArticleTitle?type=${type}&count=${count}`)
            .then(response=>response.json())
            .then(json=>{
                var data = json.data;
                this.setState({data, isLoading:false});
                this._setTimer();
                
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
        this.autoTimer = setInterval(()=>{
                var { thumbnailIndex, circle } = this.state;
                var prevIndex = thumbnailIndex;
                if (thumbnailIndex < count-1){
                    thumbnailIndex++;
                } else {
                    thumbnailIndex = 0;
                }
                this.setState({thumbnailIndex, prevIndex});
                this._setMotion(thumbnailIndex);
            },3000)
    }

    handleMouseOver(index,e){
        var target = e.currentTarget;
        var inner = e.fromElement || e.relatedTarget; 
        clearInterval(this.autoTimer); 
        if (!target.contains(inner)) {
            var { thumbnailIndex } = this.state;
            if ( thumbnailIndex != index){
                if (Object.keys(this.bgDom).length){                       
                    //  利用this.state.prevIndex 保存上一个dom索引
                    this.setState({thumbnailIndex:index, prevIndex:index});
                    this._setMotion(index);                                                                    
                }
            }       
        }        
    }

    _clearMotion(){
        var keys = Object.keys(this.bgDom);
        for(var i=0,len=keys.length;i<len;i++){
            var dom = this.bgDom[keys[i]];
            dom.classList.remove(style['fadeOut']);
            dom.classList.remove(style['fadeIn']);
        }
    }
    
    _setMotion(index){      
        var { bgIndex, prevIndex } = this.state;
        //console.log('prevIndex',prevIndex);
        //console.log('nextIndex',index);
        var nextIndex = index;
        var prevDom = this.bgDom[prevIndex];
        var nextDom = this.bgDom[nextIndex];
        var currentDom = this.bgDom[bgIndex];
        var nextDom = this.bgDom[nextIndex];
        this._clearMotion();
        
        currentDom.classList.remove(style['selected']);
        prevDom.classList.add(style['fadeOut']);
        nextDom.classList.add(style['fadeIn']);
        
        // 当频繁触发monmouseover事件时，取消上一次的mouseover事件
        clearTimeout(this.handTimer);
        this.handTimer = setTimeout(()=>{           
            prevDom.classList.remove(style['fadeOut']);                   
            nextDom.classList.remove(style['fadeIn']);
            nextDom.classList.add(style['selected']);
            this.setState({bgIndex:index});
        },1500);
           
    }

    handleMouseOut(e){
        this._setTimer();
    }

    componentWillUnmount(){      
        this.bgDom = null;
        clearInterval(this.autoTimer);
        clearTimeout(this.handTimer);
        this.autoTimer = null;  
        this.handTimer = null;    
    }
   
    render() {
        var { forMobile } = this.props;
        var { thumbnailIndex, bgIndex, isLoading, data } = this.state;
        return(

            <div ref={container=>this.container = container} className={style['auto-carousel']}>
                {
                    isLoading
                    ?
                    <Spin />
                    :
                    data && data.length 
                    ?
                    <div style={{height:'100%'}}>
                        <div className={style.bg}>
                            {
                                data.map((item,index)=>(
                                    <div 
                                        key={index} 
                                        ref={ dom=>{if(this.bgDom) this.bgDom[index]=dom} } 
                                        className={ index==bgIndex ? `${style['bg-item']} ${style['selected']}` : style['bg-item']}
                                        style={{backgroundImage:`url(${item.thumbnails[0]})`}}
                                    ></div>
                                    
                                ))
                            }
                        </div>

                            <div className={style["img-container"]}>
                                {
                                    data.map((item,index)=>(
                                        <div 
                                            style={{backgroundImage:`url(${item.thumbnails[0]})`}}
                                            className={ thumbnailIndex==index?style['selected']:''}
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
                       
                        
                    
                    </div>
                    :
                    null
                                  
                }
                
                
            </div>
        )
    }
}


