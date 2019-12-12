import React from 'react';
import { Row, Col, Spin } from 'antd';
import Sidebar from '../../side_bar';
import TagItem from './tag_item';
import AutoCarousel from '../../autoCarousel';

export default class PCTagIndex extends React.Component {
    
    constructor(props) {
      super();
      this.state = {
        isLoading:true,
        data:[]
      }
      
    }
    
    _loadArticleList(tag){      
      fetch(`/api/article/getArticleList?type=${tag}&count=20`)
        .then(response=>response.json())
        .then(json=>{
          var data = json.data;
          this.setState({data, isLoading:false})
        })
    }
    
    componentWillReceiveProps(newProps){
      var prevTag = this.props.match.params.tag;
      var newTag = newProps.match.params.tag;
      if ( prevTag != newTag){
          this.setState({isLoading:true});
          this._loadArticleList(newTag);
      }
    }
    
    componentDidMount(){     
      var tag = this.props.match.params.tag;
      this._loadArticleList(tag);
    }

    render() {
        var { history } = this.props;
        var { data, isLoading } = this.state;
        return (
            <Row style={{paddingTop:'30px'}}>
                <Col span={2}></Col>
                <Col span={5}><Sidebar /></Col>
                <Col span={15} style={{paddingLeft:'50px'}}>
                    
                    {
                        isLoading
                        ?
                        <Spin/>
                        :
                        data.length
                        ?
                        <div>
                            <div style={{height:'150px',marginBottom:'50px'}}><AutoCarousel count={4} history={history}/></div>
                            {
                                data.map((item,key)=>(
                                    <TagItem item={item} key={key} history={history}/>
                                ))
                            }                        
                        </div>
                        :
                        null
                    }
                
                </Col>
                <Col span={2}></Col>
            </Row>
        )
        
    }

}











