
import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin , Button } from 'antd';

import PCNewsBlock from '../../news_block';
import style from './topNews.style.css';

var count = 0;
export default class TopNewsContainer extends React.Component{
    constructor(){
        super();
        this.state={
           move:0,
           currentIndex:0,
           contentWidth:0         
        }
    }

    _setContainerMarginLeft(move){
        var contentContainer = this.contentContainer;
        var imgContainer = this.imgContainer;
        if ( contentContainer && imgContainer ){
            contentContainer.style.marginLeft = move+'px';
            imgContainer.style.marginLeft = move+'px';
            this.setState({move});
        }     
    }

    handleToggle(direction){
        var { currentIndex, move, contentWidth } = this.state;      
        var prevMove = move;
        if (direction == 'left'){
            move+=contentWidth;
            if (move==contentWidth) {
                setTimeout(()=>{
                    this._setContainerMarginLeft(prevMove);
                },300)
            }
            
        } else {
            move-=contentWidth;
            if (move==-contentWidth*5){
                setTimeout(()=>{
                    this._setContainerMarginLeft(prevMove);
                },300)
            }
        }
        this._setContainerMarginLeft(move);        
    }

    componentDidMount(){
        var container = this.container;
        if (container){
            var contentWidth = Math.floor(container.clientWidth/4);
            this.setState({contentWidth});
        }
    }

    handleClick(id){
        var { history } = this.props;
        if (history) history.push(`/details/${id}`);
    }

    componentWillUnmount(){
        this.container = null;
        this.imgContainer = null;
        this.contentContainer = null;
    }

    render(){
        var { isFixed, data, imgData, reloading, loadEnd } = this.props;
        var { currentIndex, scrollToBottom, contentWidth } = this.state;

        return(
                <div ref={container=>this.container=container} className={style["container"]}>
                    <div ref={imgContainer=>this.imgContainer=imgContainer} className={ isFixed ? `${style["img-container"]} ${style["fixed"]}`:style["img-container"]}>
                        {   
                            imgData.map((item,index)=>(
                                <div key={index} onClick={this.handleClick.bind(this,item[0]._id)} style={{width:contentWidth+'px',display:'inline-block',padding:'10px 10px 0 10px',backgroundColor:'#fff'}}>
                                    <div className={style["img-item"] }>
                                        <div className={style["bg"]} style={{backgroundImage:`url(${item[0].thumbnails[0]})`}}></div>
                                        <span className={style["tags"]}>{item[0].type}</span>
                                        <span className={style["desc"]}>{item[0].title}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {//  解决position:fix 高度坍塌问题
                        isFixed ? <div style={{height:this.imgContainer.clientHeight+'px'}}></div> : null
                    }
                    <div style={{width:'100%',overflowX:'hidden'}}>
                        <div ref={contentContainer=>this.contentContainer=contentContainer} className={style['content-container']}>
                        {
                            data.map((item,index)=>(
                                <div key={index} style={{width:contentWidth+'px',display:'inline-block',padding:'10px'}}>
                                    <PCNewsBlock data={item}  />
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    {   
                        reloading
                        ?
                        <Spin/>
                        :
                        null
                    }
                    {
                        loadEnd ? <div style={{margin:'10px 0'}}>新闻已经加载完了!暂时没有更多新闻~</div> : null
                    }
                    <Button onClick={this.handleToggle.bind(this,'left')} className={`${style["toggle"]} ${style["toggle-left"]}`}><Icon type="left" /></Button>
                    <Button onClick={this.handleToggle.bind(this,'right')} className={`${style["toggle"]} ${style["toggle-right"]}`}><Icon type="right" /></Button>
                </div>
            
        )
    }
}


