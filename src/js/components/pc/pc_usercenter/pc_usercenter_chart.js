import React from 'react';

import {  Drawer, Icon, Button } from 'antd';

var echarts = require('echarts')

//console.log(echarts);
export default class ChartContainer extends React.Component{
    constructor(){
        super();
        this.state={
            visible:false
            
        }
    }

    handleModalVisible(){
        this.setState({visible:true});
        setTimeout(()=>{
            if(this.echartsDom){
                var myChart = echarts.init(this.echartsDom);
                myChart.setOption({
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                });
            }
            
        },0)
    }

    handleClose(){
        this.setState({visible:false});
    }
    

    render(){
        var { visible } = this.props;
        return(

            
                
                <Drawer className="chart-container" visible={visible} placement="left" closable={false} onClose={this.handleClose.bind(this)}>
                    <div id="myechart" style={{width:'400px',height:'400px'}} ref={echartsDom=>this.echartsDom = echartsDom}>
                    </div>
                </Drawer>
            

        )
    }
}


