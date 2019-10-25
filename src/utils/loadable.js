import React from 'react';
import Loadable from 'react-loadable';
import { Spin } from 'antd';

export default (path)=>{
    return Loadable({
        loader:()=>import(path),
        loading:()=><Spin/>,
        //timeout:10000

    })
}
    
