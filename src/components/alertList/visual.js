// 这个文件暂时不用, 因为需要变更
// 目前支持拖曳

import React from 'react'
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin'
import _ from 'lodash'
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../utils'
import { injectIntl, FormattedgiMessage, defineMessages } from 'react-intl'

const WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

const VisualAnalyze = ({visualAnalyze, dispatch}) => {
    
    const { firstItems, 
            rowHeight, 
            onLayoutChange, 
            cols,
            layout,
            isExpand 
        } = visualAnalyze


    // 生成布局
    // const layout = firstItems.length > 0 &&firstItems.map( (item, i) => {
    //     const y =  Math.ceil(Math.random() * 4) + 1;
    //     return {x: i * 2 % 6, y: Math.floor(i / 3) , w: 2, h: 1, i: i.toString()};
       
    // })
    // const onLayoutChange = function(layout) {
    //     this.setState(layout);
    // }
    
    const queryVisualRes = (e) => {
        
        const target = e.target,
            val = target.getAttribute('data-value'),
            index = target.getAttribute('data-key')
            
        dispatch({
            type: 'visualAnalyze/queryVisualRes',
            payload: {
                val,
                index
            }
        })
        // e.stopPropagation()
    }

    // 生成可视化组件
    const visualComponent = firstItems.map((item, i) => {
        
        return (
            <div className="wrapDiv" key={i}>
                <div className={item.isExpand ? 'hide' : ''}>
                    <div className="gridBg" ></div>
                    <div className="visualSimple" data-value={item.value} data-key={i} >
                        <div style={{background:'yellow'}} className="visualAlert"></div>
                        {item.value}
                        <div className="expand" data-value={item.value} data-key={i} onMouseDown={(e) => {queryVisualRes(e)}}></div>

                    </div>
                </div>
                <div className={!item.isExpand ? 'visualTotal hide' : 'visualTotal'} data-key={i} >
                    <div className="head" >
                    <div style={{background:'red'}} className="visualAlert"></div>
                    {item.value}
                    </div>
                    <div className="list">
                    <ul>
                        <li> 
                            <div style={{background:'yellow'}} className="alertListWrap"></div>
                            <div style={{background:'yellow'}} className="alertList"></div>
                            <div className="visualText">
                                2334
                            </div>
                        </li> 
                        <li> 
                            <div style={{background:'yellow'}} className="alertListWrap"></div>
                            <div style={{background:'yellow'}} className="alertList"></div>
                            <div className="visualText">
                                2334
                            </div>
                        </li> 
                        <li> 
                            <div style={{background:'yellow'}} className="alertListWrap"></div>
                            <div style={{background:'yellow'}} className="alertList"></div>
                            <div className="visualText">
                                2334
                            </div>
                        </li> 
                        <li> 
                            <div style={{background:'yellow'}} className="alertListWrap"></div>
                            <div style={{background:'yellow'}} className="alertList"></div>
                            <div className="visualText">
                                2334
                            </div>
                        </li> 
                    </ul>
                    </div>
                </div>
            </div>
        )
    })

   
    return (
       <ReactGridLayout margin={[15,15]} rowHeight={rowHeight}  layout={layout}  cols={cols} isResizable={false} onLayoutChange={onLayoutChange}>
        {visualComponent}
      </ReactGridLayout>
    )
}
export default connect( state => {
    return {
        visualAnalyze: state.visualAnalyze,
    }
})(VisualAnalyze)

