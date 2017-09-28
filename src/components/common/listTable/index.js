import React, { PropTypes, Component } from 'react'
import { Button, Spin, Popover, Checkbox } from 'antd';
import LevelIcon from '../levelIcon/index.js'
import Animate from 'rc-animate'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import $ from 'jquery'
import WrapableTr from './wrapableTr'
import TopFixedArea from './topFixedArea'
import LeftFixedArea from './leftFixedArea'
import ScrollBar from './scrollBar'
import Table from './table'
import Theads from './theads'

class ListTable extends Component {
  constructor() {
    super();
    this.state = { groupMap: {} };
    this.toggleGroupSpread = this.toggleGroupSpread.bind(this);
  }
  componentDidMount() {
    this._getTotalScrollHeight();
    this._setAutoLoadMore();
    this.scrollHeight = this._getTotalScrollHeight();
  }

  componentDidUpdate(oldProps) {
    clearTimeout(this.autoLoad);
    setTimeout(() => {
      this.scrollHeight = this._getTotalScrollHeight();
      this.isLoadingMore = false;
    }, 300)
    const { columns: newColumns } = this.props;
    const { columns: oldColumns } = oldProps;
    if (oldColumns && oldColumns.length > 0 && newColumns.length > oldColumns.length) {
      $("div.listContainer").scrollLeft(10000);
    }
  }

  componentWillUnMount() {
    clearTimeout(this.autoLoad);
    this._cancelAutoLoadMore();
  }

  // 切换组展开或显示
  toggleGroupSpread(e) {
    const { groupMap } = this.state;
    const groupIndex = e.target.getAttribute('data-groupIndex')
    if(typeof groupMap[groupIndex] == 'undefined') {
      groupMap[groupIndex] = false;
    } else {
      groupMap[groupIndex] = !groupMap[groupIndex];
    }

    this.setState();
  }

  _setAutoLoadMore() {
    $(this.props.target).scroll((e) => {
      const $target = $(e.target);
      const $tableArea = $(this.refs.tableArea);

      // 当区域已经被隐藏，则不执行loadMore操作
      if ($tableArea.is(":visible") && $target.scrollTop() + 200 > this.scrollHeight - $target.height() && this.props.isShowMore && !this.props.isLoadingMore && !this.props.isLoading && !this.isLoadingMore) {
        this.isLoadingMore = true;

        this.autoLoad = setTimeout(() => {
          this.props.loadMore();
        }, 0)
      }
    })
  }

  _cancelAutoLoadMore() {
    $(this.props.target).unbind("scroll");
  }

  // 获取可滚动的区域总高度
  _getTotalScrollHeight() {
    const $target = $(this.props.target);
    let totalHeight = 0;
    $target.children().each((index, ele) => {
      totalHeight += $(ele).context.clientHeight;
    })
    return totalHeight;
  }

  render() {
    const {
      sourceOrigin,
      isGroup,
      groupBy,
      isShowMore,
      data,
      columns,
      checkAlertFunc,
      loadMore,
      checkAlert,
      detailClick,
      spreadChild,
      noSpreadChild,
      spreadGroup,
      noSpreadGroup,
      selectedAll,
      handleSelectAll,
      relieveClick,
      orderFlowNumClick,
      showAlertOrigin,
      isLoading,
      isLoadingMore,
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      extraArea,
      extraAreaKey,
      topHeight,
      isNeedCheckOwner,
      userInfo = {},
      begin,
      end,
      intl: { formatMessage }
    } = this.props

    const { groupMap } = this.state;

    const fixedColumns = columns.filter((item) => item.isFixed == true);

    const formatMessages = defineMessages({
      showMore: {
        id: 'alertList.showMore',
        defaultMessage: '显示更多',
      }
    })

    return (
      <div ref="tableArea">
        <Spin spinning={isLoading}>
          <div className={"listContainer " + styles.listContainer}>
            <ScrollBar sourceOrigin={sourceOrigin} horizonTarget="div.listContainer" />
            {/* <div style={{ display: columns.length > 2?'block':'none' }}> */}
            {
              columns.length > 2 ?
                <LeftFixedArea
                  sourceOrigin={sourceOrigin}
                  isGroup={isGroup}
                  groupBy={groupBy}
                  data={data}
                  columns={fixedColumns}
                  checkAlertFunc={checkAlertFunc}
                  checkAlert={checkAlert}
                  detailClick={detailClick}
                  spreadChild={spreadChild}
                  noSpreadChild={noSpreadChild}
                  spreadGroup={spreadGroup}
                  noSpreadGroup={noSpreadGroup}
                  selectedAll={selectedAll}
                  handleSelectAll={handleSelectAll}
                  relieveClick={relieveClick}
                  orderFlowNumClick={orderFlowNumClick}
                  showAlertOrigin={showAlertOrigin}
                  isLoading={isLoading}
                  orderUp={orderUp}
                  orderDown={orderDown}
                  orderBy={orderBy}
                  orderType={orderType}
                  orderByTittle={orderByTittle}
                  extraArea={extraArea}
                  topHeight={topHeight}
                  userInfo={userInfo}
                  isNeedCheckOwner={isNeedCheckOwner}
                  begin={begin}
                  end={end}
                  toggleGroupSpread={this.toggleGroupSpread}
                  groupMap={groupMap}
                />
                :
                undefined
            }

            {/* </div> */}
            <TopFixedArea parentTarget="div.listContainer" sourceOrigin={sourceOrigin}
              theads={
                <Theads columns={columns}
                  sourceOrigin={sourceOrigin}
                  isGroup={isGroup}
                  columns={columns}
                  selectedAll={selectedAll}
                  handleSelectAll={handleSelectAll}
                  orderUp={orderUp}
                  orderDown={orderDown}
                  orderBy={orderBy}
                  orderType={orderType}
                  orderByTittle={orderByTittle}
                  begin={begin}
                  end={end}
                />
              }
              extraArea={extraArea} extraAreaKey={extraAreaKey} topHeight={topHeight}
            />
            <Table
              isNeedCheckOwner={isNeedCheckOwner}
              sourceOrigin={sourceOrigin}
              isGroup={isGroup}
              groupBy={groupBy}
              groupMap={groupMap}
              data={data}
              columns={columns}
              checkAlertFunc={checkAlertFunc}
              checkAlert={checkAlert}
              detailClick={detailClick}
              spreadChild={spreadChild}
              noSpreadChild={noSpreadChild}
              spreadGroup={spreadGroup}
              noSpreadGroup={noSpreadGroup}
              selectedAll={selectedAll}
              handleSelectAll={handleSelectAll}
              relieveClick={relieveClick}
              orderFlowNumClick={orderFlowNumClick}
              showAlertOrigin={showAlertOrigin}
              isLoading={isLoading}
              orderUp={orderUp}
              orderDown={orderDown}
              orderBy={orderBy}
              orderType={orderType}
              orderByTittle={orderByTittle}
              userInfo={userInfo}
              isNeedCheckOwner={isNeedCheckOwner}
              begin={begin}
              end={end}
              toggleGroupSpread={this.toggleGroupSpread}
            />
          </div>
        </Spin>
        {isShowMore && <Spin size="large" spinning={isLoadingMore}><div className={styles.loadMore}><Button onClick={() => {this.isLoadingMore = true; loadMore()}}><FormattedMessage {...formatMessages['showMore']} /></Button></div></Spin>}
      </div>
    )
  }
}

ListTable.defaultProps = {
  sourceOrigin: 'alertMange',
  target: 'div#topMain', // 用于设置参考对象
  checkAlertFunc: () => { },
  spreadChild: () => { },
  noSpreadChild: () => { },
  handleSelectAll: () => { },
  relieveClick: () => { },
  orderFlowNumClick: () => { }
}

ListTable.propTypes = {
  sourceOrigin: React.PropTypes.string.isRequired,
}

export default injectIntl(ListTable)
