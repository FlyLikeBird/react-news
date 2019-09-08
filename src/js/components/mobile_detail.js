import React from 'react';
import { Row, Col, BackTop } from 'antd';

import MobileHeader from './mobile_header';
import MobileFooter from './mobile_footer';

import CommonComments from './common_comments/common_comments';

export default class MobileNewsDetails extends React.Component {
	constructor(){
		super()
		this.state={
			newsItem:'',
			func:''
		}
	}

	componentDidMount(){
		var fetchOption = {
			method:'GET'
		}
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey="+this.props.params.uniquekey,fetchOption)
		.then(response=>response.json())
		.then(json=>{
			this.setState({newsItem:json});
			document.title = this.state.newsItem.title + " -React News | React驱动的新闻平台";


		})
	}

	createMarkup(){
		//return {__html:'<a>ceshi</a>'}
		return {__html:this.state.newsItem.pagecontent};
	}

	render(){

		return(
			<div id="mobileDetailsContainer">
				<MobileHeader/>
				<div className="ucmobilelist" style={{padding:'4px'}}>
					<Row>
						<Col span={24}>
							<div className="articleContainer" dangerouslySetInnerHTML={this.createMarkup()} ></div>
						</Col>
					</Row>
					<CommonComments uniquekey={this.props.params.uniquekey}/>
				</div>
				
				<BackTop/>
				<MobileFooter/>
			</div>


		)
	}
}