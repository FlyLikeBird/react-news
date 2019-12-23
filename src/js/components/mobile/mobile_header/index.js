import React from 'react';
import { Menu, Icon, Tabs, message, Badge } from 'antd';

import logoUrl from '../../../images/logo.png';

export default class MobileHeader extends React.Component {
    
    render() {
        var { msg } = this.props;
        var { hasLogined } = this.state;

        
        return (
        
            <header>
                <div className="mobile-header">
                    <span style={{display:'flex',alignItems:'center'}}>
                        <span className="img-container" style={{backgroundImage:`url(${logoUrl})`}}></span>
                        ReactNews
                    </span>
                    
                    {
                        hasLogined
                        ?
                        <div>
                            <span className="img-container"><img src={avatar} /></span>
                        </div>
                        :
                        <span><Icon type="user" /></span>
                    }
                    
                </div>               
            </header>
        

        )
    }
}

