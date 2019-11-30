import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin , Button } from 'antd';

import PCNewsBlock from '../../news_block';
import style from '../../news_block/style.css';

export default class TopNewsItem extends React.Component{
    constructor(){
        super();
        this.state = {
            left:0,
            itemWidth:'',
            selected:false
        }
    }
    
    componentDidMount(){
        var { initPosition, selected } = this.props;
        var container = this.topNewsItem;   //  20是topNews-item 的padding值
        this.setState({left:initPosition, selected, itemWidth:`${container.clientWidth-20}px`});
    }

    componentWillReceiveProps(newProps){
        var { movePosition, allowUpdate, selected } = newProps;
        var { left } = this.state;
        if ( allowUpdate){
            this.setState({left:left+movePosition});
            /*
            setTimeout(()=>{
                this.setState({selected})
            },1000)
            */
        }
        
    }
    
    componentWillUnmount(){
        this.topNewsItem = null;
    }

    render(){
        var { data, initPosition, movePosition, fixPosition, selected } = this.props;
        var { left, itemWidth } = this.state;
        //var left = initPosition + movePosition ;
        return(

             <div ref={container=>this.topNewsItem = container} className={ selected ? style["selected"] +" "+ style["topNews-item"] : style["topNews-item"] } style={{left:`${left}%`}}>
                <PCNewsBlock data={data} hasImg={true} fixPosition={fixPosition} fixWidth={itemWidth}/>
            </div>
            

        )
    }
}


