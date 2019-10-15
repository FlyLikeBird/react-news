import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Row,Col } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Card, notification } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import MobileHeader from './mobile_header';
import MobileFooter from './mobile_footer';

export default class MobileUserCenter extends React.Component{
	constructor(){
		super();
		this.state={
			usercollection:'',
		}
	}

	

	componentDidMount(){
		var fetchOptions = {
			method:'GET'
		};
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid="+localStorage.userid,fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			this.setState({usercollection:json});
			console.log(json);
		})
	}
	
	
	render(){

		const usercollection = this.state.usercollection;
		const usercollectionList = usercollection.length 
									?
									usercollection.map((item,index)=>(
										<Card key={index} title={item.uniquekey} extra={<div><a href={`/details/${item.uniquekey}`}>查看</a><a onClick={this.handleClick} style={{paddingLeft:'4px'}}>删除</a></div>}>
											<p>{ item.Title } </p>
										</Card>
									))
									:
									'还没有收藏任何文章！'

		return(
			<div>
				<MobileHeader/>
					<Row style={{paddingTop:'20px'}}>
					
						<Col span={24}>
							<Tabs>
								<TabPane tab="我的收藏列表" key="1">
									{ usercollectionList }
								</TabPane>
								<TabPane tab="我的评论列表" key="2">

								</TabPane>
								<TabPane tab="我的浏览记录" key="3">

								</TabPane>
								<TabPane tab="头像设置" key="4">

								</TabPane>
								</Tabs>
						</Col>
					

					</Row>
					
				<MobileFooter/>
			</div>

		)
	}
}


