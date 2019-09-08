import React from 'react';

import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin , Button } from 'antd';

const { Meta } = Card;

import PCNewsBlockContainer from './pc_topnews_container';
import PCFooter from './pc_footer';



export default class PCTopNewsIndex extends React.Component{
    constructor(){
        super();
        this.state={
           scrollStyle:{},
           movePosition:0,
           newsListWidth:0,
           movePosition:0,
           
           isScroll:false,
           isLoad:false,
           reload:false,

           newsList:[{
            type:'guonei',
            count:50,
            newsListTitle:'国内',
            hasImg:true,
           },{
            type:'yule',
            count:50,
            newsListTitle:'娱乐',
            hasImg:true,
           },{
            type:'guoji',
            count:50,
            newsListTitle:'国际',
            hasImg:true,
           },{
            type:'shehui',
            count:50,
            newsListTitle:'社会',
            hasImg:true,
           },{
            type:'guonei',
            count:50,
            newsListTitle:'国内',
            hasImg:true,
           },{
            type:'yule',
            count:50,
            newsListTitle:'娱乐',
            hasImg:true,
           },{
            type:'guoji',
            count:50,
            newsListTitle:'国际',
            hasImg:true,
           },{
            type:'shehui',
            count:50,
            newsListTitle:'社会',
            hasImg:true,
           }]
        }
    }

    
    handleScroll(e){
        var scrollDom = this.newsList;
        
        if (scrollDom.scrollTop >= 150 ) {

            var newsListDom = this.newsList;
            var newsListWidth = (newsListDom.clientWidth) / 4;

            var scrollStyle = {
                position:'fixed',
                top:'80px',
                zIndex:'100',
                width:newsListWidth-20
            };
            
            this.setState({scrollStyle,isScroll:true});
            //console.log(scrollDom.scrollHeight);
            if (scrollDom.scrollHeight - scrollDom.scrollTop -530 < 50 ) {
                
                this.setState({isLoad:true,reload:true});
            }
            
            
            
        } else {
            this.setState({scrollStyle:{}})
        } 
    }
    
    componentDidMount(){
        this.setState({})
    }
    
    setButtonDisplay(leftOrRight,show){
        
        var leftButton = this.leftButton,rightButton = this.rightButton;
        var button = leftOrRight === 'right' ? rightButton : leftButton;
        
        button.style.display = show
    }

    handleToggle(direction){
        
        if ( this.newsList ) {
            var newsListDom = this.newsList;
            var newsListWidth = (newsListDom.clientWidth) / 4;
            var movePosition = direction === 'left'? -Number(newsListWidth) : newsListWidth;
            
            this.setState({movePosition,isScroll:false});  
        }  
    }

    handleReloadIsOver(){
        this.setState({reload:false,isLoad:false})
    }

    render(){


        return(

             <div>
                
                <div style={{marginTop:'30px',height:'530px',textAlign:'center'}}>
                    <Col span={2}></Col>                   
                    <Col span={20}>
                        
                        <div className="newsList-container" ref={newsList=>this.newsList= newsList} onScroll={this.handleScroll.bind(this)}>                            
                            <PCNewsBlockContainer isScroll={this.state.isScroll} reload={this.state.reload} onReload={this.handleReloadIsOver.bind(this)} move={this.state.movePosition} newsList={this.state.newsList} onToggleToSide={this.setButtonDisplay.bind(this)} scrollStyle={this.state.scrollStyle}/>
                            
                         </div>
                         {
                            this.state.isLoad
                            ?
                            <Spin size="large"/>
                            :
                            null
                         }
                         <button style={{display:'block'}} ref={left=>this.leftButton=left} onClick={this.handleToggle.bind(this,'left')} className="toggle toggle-left"><Icon type="left" /></button>
                         <button style={{display:'block'}} ref={right=>this.rightButton=right} onClick={this.handleToggle.bind(this,'right')} className="toggle toggle-right"><Icon type="right" /></button>
                        
                    </Col>                   
                    <Col span={2}></Col>

                </div>
                    
                <PCFooter/>
            </div>
            

        )
    }
}


