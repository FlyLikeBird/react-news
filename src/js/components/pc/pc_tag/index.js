import React from 'react';
import { Row, Col, Spin } from 'antd';

import TagItem from './tag_item';

export default class PCTagIndex extends React.Component {
    
    constructor(props) {
      super();
      this.state = {
        tag:'',
        data:[]
      }
      
    }
    
    _loadArticleList(tag){      
      fetch(`/api/article/getArticleList?type=${tag}&count=20`)
        .then(response=>response.json())
        .then(json=>{
          var data = json.data;
          this.setState({data})
        })
    }
    
    componentWillReceiveProps(newProps){
      var prevTag = this.props.match.params.tag;
      var newTag = newProps.match.params.tag;
      if ( prevTag != newTag){
          this.setState({data:[]});
          this._loadArticleList(newTag);
      }
    }
    
    componentDidMount(){     
      var tag = this.props.match.params.tag;
      this._loadArticleList(tag);
    }

    render() {
        console.log(this.props);
        var { data } = this.state;
        return (
            <Row style={{paddingTop:'30px'}}>
                <Col span={2}></Col>
                <Col span={5}>
                    {/*<PCNewsBlock type="top" count={20} width="100%" title="相关新闻" /> */}  
                </Col>
                <Col span={15}>
                    
                    {
                        data.length
                        ?
                        data.map((item,key)=>(
                            <TagItem item={item} key={key} />
                        ))
                        :
                        <Spin/>
                    }
                
                </Col>
                <Col span={2}></Col>
            </Row>
        )
        
    }

}











