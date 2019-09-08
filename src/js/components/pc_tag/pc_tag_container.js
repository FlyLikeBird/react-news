import React from 'react';
import { Link } from 'react-router-dom';
import PCHeader from '../pc_header';
import PCFooter from '../pc_footer';

import { Row, Col, List, Spin } from 'antd';

export default class PCTagContainer extends React.Component {
    
    constructor(props) {
      super();
      this.state = {
        list:[],
        load:true
      }
      
    }
 
    _loadArticleList(tag){
      
      fetch(`/article/getArticleList?type=${tag}&count=20`)
        .then(response=>response.json())
        .then(data=>{
          this.setState({list:data.data,load:false})
        })
    }
    

    componentWillReceiveProps(newProps){
      //console.log(this);

      this._loadArticleList(newProps.tag);
      
    }

    render() {

        const contentStyle = {     
          'width':'730px',
          height:'50px',
          lineHeight:'25px',
          display:'-webkit-box',
          'WebkitBoxOrient':'vertical',
          'WebkitLineClamp':'2',
          overflow :'hidden',
          'textOverflow':'ellipsis',
          marginBottom:'4px'
        };

        const ListComponent = this.state.load 
                              ?
                              <Spin size="large"/>
                              :
                              this.state.list.length 
                              ?
                              <List
                                className="user-list-container"
                                itemLayout="vertical"
                                size="large"
                                dataSource={this.state.list}
                                renderItem={item=>(
                                  <List.Item key={item.title}>                
                                  
                                    <List.Item.Meta
                                      title={<Link to={`/details/${item.uniquekey}`}>{item.title}</Link>}
                                      description={
                                        <div>
                                          <span className="text">发布时间: <span className="mark">{item.newstime}</span></span>
                                          <span className="text">来源: <span className="mark">{item.auth}</span></span>
                                          <span className="text">类型: <span className="mark">{item.type}</span></span>
                                          <div style={contentStyle}>{item.content}</div>
                                          
                                          <div style={{height:'150px',overflow:'hidden',marginTop:'6px',marginBottom:'20px'}}>
                                           {

                                            item.thumbnail.map((imgSrc,index)=>(
                                              <img key={index} src={imgSrc} style={{width:'33%',padding:'4px 2px',verticalAlign:'top'}}/>
                                            ))
                                           }
                                          </div>
                                        </div>
                                      }
                                    />
                                    
                                    </List.Item>
                                  )}
                                />
                                :
                                <div>该类型新闻暂时还未发布!请查看其他类别新闻!</div>
        return (
          <section style={{paddingTop:'40px'}}>
            <Row>
              <Col span={2}></Col>
              <Col span={5} className="container">
                  {/*<PCNewsBlock type="top" count={20} width="100%" title="相关新闻" /> */}
    
              </Col>
              <Col span={15}>
                  { ListComponent }
              </Col>
              <Col span={2}></Col>
            </Row>
        </section>
      )
    }

}











