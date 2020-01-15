import React from 'react';
import MobileFooter from '../mobile_footer';
import { Menu, Spin, Tabs } from 'antd';
const { TabPane } = Tabs;

export default class MobileScrollContainer extends React.Component {
    
    handleScroll(){
        var { onScrollToBottom, canScroll } = this.props;
        var container = this.container;
        //console.log(canScroll);
        if (container && canScroll){
            var { scrollTop, scrollHeight, clientHeight } = container;
            //console.log(scrollHeight);
            if ( (scrollTop + clientHeight) == scrollHeight) {
                if ( onScrollToBottom) onScrollToBottom();
            }
        }
    }
    
    componentWillUnmount(){
        this.container = null;
    }

    render(){
        var { autoLoad } = this.props;
        return (
            <div ref={container=>this.container=container} className="content-container" onScroll={this.handleScroll.bind(this)}>
                { this.props.children }
                { autoLoad ? <Spin/> : null}
            </div>            
                      
                   
        )
    }
}






