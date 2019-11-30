import React from 'react';
import { Icon } from 'antd';
import PCNewsBlock from '../../news_block';

class PCNewsBlockItem extends React.Component {

    constructor(){
        super();
        this.state = {
            newsListStyle:{}
        }
    }

    componentWillReceiveProps(newProps){
        var { width, index, isScroll } = newProps;
        
        this.setState({newsListStyle:{
             width,
             left:index*width
        }});


    }

    render(){
        var { scrollStyle, reload } = this.props;
        var { type, count, newsListTitle, hasImg } = this.props.item;

        return (
            <div className="position-item" style={this.state.newsListStyle}>
                <PCNewsBlock  onReload={this.props.onReload} type={type} count={count} newsListTitle={newsListTitle} hasImg={hasImg} scrollStyle={scrollStyle} reload={reload}/>  
            </div>
        )
    }
}


export default class PCNewsBlockContainer extends React.Component {

    constructor(){
        super();
        this.state = {
            newsListWidth:0,
            movePosition:0,
            containerStyle:{
                left:0
            }
        }
    }

    componentWillReceiveProps(newProps){
        var { move, isScroll, currentIndex } = newProps;
        
        if (!isScroll){

            var newsListWidth = this.state.newsListWidth;
            var prevLeft = this.state.containerStyle.left;
            var nextLeft = prevLeft + move;
            console.log(nextLeft);
            if ( nextLeft === 0 ){
                this.props.onToggleToSide('right','none');  
                this.props.onToggleToSide('left','none');          
            } else if ( nextLeft < 0 && nextLeft > -(this.state.newsListWidth*4)) {
                
                    this.props.onToggleToSide('right','block');
                    this.props.onToggleToSide('left','block');
                
            } else if (nextLeft === -this.state.newsListWidth*4) {
                this.props.onToggleToSide('left','none');
            }
            this.setState({containerStyle:{
                left:nextLeft
            }})
            return ;
        } else {
            this.props.onToggleToSide('left','block'); 
        }
        
    }

    componentDidMount(){
        if (this.positionContainer){
            this.setState({
               
                    newsListWidth:this.positionContainer.clientWidth/4
                    
            })
        }
    }
    
    
    render(){
        var { containerStyle } = this.state;
        var { scrollStyle, reload } = this.props;

        return (
            <div ref={position=>this.positionContainer = position} style={containerStyle} className="position-container">
                 {
                    this.props.newsList.map((item,index)=>{
                        
                        
                        return <PCNewsBlockItem 
                            width={this.state.newsListWidth}
                            isScroll={this.state.isScroll}
                            item={item} 
                            key={index} 
                            index={index}
                           
                            onReload={this.props.onReload}
                            scrollStyle={this.props.scrollStyle}
                            reload={this.props.reload}
                        />
                    })
                 }
                 
            </div>
        )
    }
}
