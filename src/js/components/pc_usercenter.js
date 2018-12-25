import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Row,Col } from 'antd';
import { Menu, Icon, Tabs, message, Form, Input, Button, CheckBox, Modal, Card, notification, Upload } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import PCHeader from './pc_header';
import PCFooter from './pc_footer';

export default class PCUserCenter extends React.Component{
	constructor(){
		super();
		this.state={
			usercollection:'',
			usercomments:'',
			previewImage:'',
			previewVisible:false
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
			//console.log(json);
		});

		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid="+localStorage.userid,fetchOptions)
		.then(response=>response.json())
		.then(json=>{
			console.log(json);
			this.setState({usercomments:json});
			
		})
	}
	
	
	render(){

		const props = {
			action:'http://newsapi.gugujiankong.com/Handler.ashx',
			headers:{
				'Access-Control-Allow-Origin':'*'
			},
			listType:'picture-card',
			defaultFileList:[
				{
					uid:0,
					name:'xxx.png',
					state:'done',
					url:'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
					thumbUrl:'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png'
				}
			],
			onPreview:(file)=>{
				this.setState({previewImage:file.url,previewVisible:true})
			}
		};

		const usercollection = this.state.usercollection;
		const usercollectionList = usercollection.length 
									?
									usercollection.map((item,index)=>(
										<Card key={index} title={item.uniquekey} extra={<div><a href={`/#/details/${item.uniquekey}`}>查看</a></div>}>
											<p>{ item.Title } </p>
										</Card>
									))
									:
									'还没有收藏任何文章！';


		const usercomments = this.state.usercomments;
		const usercommentsList = usercomments.length 
									?
									usercomments.map((item,index)=>(
										<Card key={index} title={`您于${item.datetime}评论了文章 ${ item.uniquekey}`} extra={<div><a href={`/#/details/${item.uniquekey}`}>查看</a></div>}>
											<p>{ item.Comments } </p>
										</Card>
									))
									:
									'还没有评论任何文章！'

		return(

			<div>
				<PCHeader/>
				<Row style={{paddingTop:'20px'}}>
					<Col span={2}></Col>
					<Col span={20}>
						<Tabs>
						<TabPane tab="我的收藏列表" key="1">
							<div className="comment">
								<Row>
									<Col id="commentContainer" span={24}>
										{ usercollectionList }
									</Col>
								</Row>
							</div>
						</TabPane>
						<TabPane tab="我的评论列表" key="2">
							<div className="comment">
								<Row>
									<Col span={24}>
										{ usercommentsList }
									</Col>
								</Row>
							</div>
						</TabPane>
						<TabPane tab="我的浏览记录" key="3">


						</TabPane>
						<TabPane tab="头像设置" key="4">
							<div className="clearfix">
								<Upload {...props}>
									<Icon type="plus"/>
									<div className="ant-upload-text">上传照片</div>
									
								</Upload>
								<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
									<img alt="预览" src={this.state.previewImage}/>
								</Modal>
							</div>
						</TabPane>
					</Tabs>
					</Col>
					<Col span={2}></Col>

				</Row>
					
				<PCFooter/>
			</div>

		)
	}
}


