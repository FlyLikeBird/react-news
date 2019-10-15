import React from 'react';
import { Row, Col } from 'antd';

import style from './style.css';

export default class AutoCarousel extends React.Component {
    constructor(){
        super();
        this.state = {
            width:0,
            currentIndex:0

        }
    }

    componentDidMount(){
        var { data } = this.props;
        if (data.length){
            var container = this.container;
            if (container){
                var width = (container.offsetWidth)/(data.length)   
                this.setState({width})
            }
            //this._setTimer();
            
        }        
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
        //this._setTimer()
    }

    componentWillUnmount(){
        if (this.timer) {
            clearInterval(this.timer);
        }
        
    }

    render() {
        var { width, currentIndex } = this.state;
        var { data } = this.props;

        return(

            <div ref={container=>this.container = container} className={style['auto-carousel']}>
                {
                    data.length
                    ?
                    <div className={style.bg} style={{backgroundImage:`url(${data[currentIndex]})`}}>
                        {
                            data.map((item,index)=>(
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
                                    <img src={item} />
                                </div>
                            ))
                        }
                    </div>
                    :
                    null
                }
                
                
            </div>
        )
    }
}


