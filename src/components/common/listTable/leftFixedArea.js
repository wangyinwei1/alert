import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Table from './table'
import TopFixedArea from './topFixedArea'
import Theads from './theads'
import styles from './index.less'

class LeftFixedArea extends Component {
  render() {
    const {
      sourceOrigin,
      isGroup,
      groupBy,
      data,
      columns,
      checkAlertFunc,
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
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      extraArea,
      topHeight,
      isNeedCheckOwner,
      userInfo,
      groupMap,
      toggleGroupSpread,
    } = this.props;

    const formatMessages = defineMessages({
      entityName: {
        id: 'alertList.title.enityName',
        defaultMessage: '对象',
      },
      name: {
        id: 'alertList.title.name',
        defaultMessage: '告警名称',
      },
    });

    const onHide = () => {
      // this.refs.leftFixedArea && $(this.refs.leftFixedArea).css("z-index", 1);
    }

    const onShow = () => {
      $(this.refs.leftFixedArea).removeAttr("style");
    }

    onHide();

    return (
      <div ref="leftFixedArea" className={ styles.leftFixedArea }>
        <TopFixedArea parentTarget="div.listContainer" sourceOrigin={sourceOrigin}
          theads={
            <Theads
              isAffectTdWithSameKey={ false }
              columns={columns}
              sourceOrigin={sourceOrigin}
              isGroup={isGroup}
              selectedAll={selectedAll}
              handleSelectAll={handleSelectAll}
              orderUp={orderUp}
              orderDown={orderDown}
              orderBy={orderBy}
              orderType={orderType}
              orderByTittle={orderByTittle}
            />
          }
          topHeight={topHeight}
          isShowScrollBar={ false }
          onHide={ onHide }
          onShow={ onShow }
        />
        <div className={ styles.leftFixedTable }>
          <Table
            isShowNoDataTip={false}
            sourceOrigin={sourceOrigin}
            isGroup={isGroup}
            groupBy={groupBy}
            groupMap={groupMap}
            toggleGroupSpread={toggleGroupSpread}
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
          />
        </div>
      </div>
    )
  }
}

export default LeftFixedArea;