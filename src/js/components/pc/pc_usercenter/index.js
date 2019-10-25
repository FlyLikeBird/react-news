import React from 'react';
import { Menu, Icon, Tabs, Row, Col, Upload, Modal, Card, List, Spin, Badge } from 'antd';

import PCUserAvatar from './pc_userAvatar.js';
import PCUserCenterContainer from './pc_usercenter_container';

export default class PCUserCenter extends React.Component{
	constructor(){
		super();
		this.state={
			user:{},
			isSelf:false,
			userFollow:[],
			userFans:[],
			userCollect:[],
			userAction:[],
			userComments:[],
			userHistory:[],
			isLoad:true
			
		}
	}

	_loadUserInfo(props){
		
		var params = props.match.params.id;
		var isSelf = localStorage.getItem('userid') === params ? true :false;
		fetch(`/api/usr/usercenter?userid=${params}`)
			.then(response=>response.json())
			.then(json=>{
				//console.log(data);
				var user = json.data;
				//console.log(responseData);
				var { userFollow, userFans, userAction, userHistory, userCollect, username, comments } = user;				
				this.setState({user, userFollow, userFans, userAction, userCollect, userHistory,userComments:comments,isSelf,isLoad:false})
		})

	}

	componentWillReceiveProps(newProps){
		var params = this.props.match.params.userid;
		if ( params != newProps.match.params.userid){
			this.setState({isLoad:true});
			this._loadUserInfo(newProps);
		}	
		
	}

	componentDidMount(){
		this._loadUserInfo(this.props)
	}
	
	render(){
		console.log(this.props);
		var { socket, history, msg } = this.props;
		var { user, userFollow, userFans, userAction, userComments, userHistory, userCollect, isSelf, isLoad  } = this.state;

		return(

			<div>				
				<Row style={{paddingTop:'30px'}}>
					<Col span={2}></Col>
					<Col span={20} style={{textAlign:'center'}}>
						{
							isLoad
							?
							<Spin size="large"/>
							:
							<Row>
								<Col span={8}>
									<PCUserAvatar user={user}/>
								</Col>
								<Col span={16} style={{position:'relative',textAlign:'left'}}>
									
									<PCUserCenterContainer 
										userFollow={userFollow}
										userFans = {userFans}
										userAction={userAction}
										userComments={userComments}
										userHistory={userHistory}
										userCollect={userCollect}
										
										socket={socket}
										history={history}
										msg={msg}
										isSelf={isSelf}
									/>
									
								</Col>	
							</Row>
						}
						
					</Col>									
					<Col span={2}></Col>
				</Row>					
			</div>

		)
	}
}



