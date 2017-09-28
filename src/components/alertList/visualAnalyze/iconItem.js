import React, { Component } from 'react'
import styles from '../index.less'
import { classnames, severityToColor } from '../../../utils/index'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Popover } from 'antd'

const formatMessages = defineMessages({
  noData: {
    id: 'visualAnalyze.noData',
    defaultMessage: '暂无数据',
  }
});

class IconItem extends Component {
  shouldComponentUpdate(newProps) {
    if(JSON.stringify(newProps.childItem) != JSON.stringify(this.props.childItem)) {
      return true;
    } else if(newProps.alertList) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    const { childItem, alertList, showAlertList, cancelShowAlertList, detailClick } = this.props;
    let AlertListContent = (
      <div>Loading...</div>
    )

    if (Array.isArray(alertList)) {
      AlertListContent = alertList.length > 0 ?
        alertList.map((item, index) => {
          return (
            <div key={index}>
              <a data-id={item.id} data-isLoaded={false} data-list={alertList} onClick={(e) => { detailClick(e) }}>
                <span className="visualAlert" style={{ background: severityToColor[item['severity']] }}></span>{item.name}
              </a>
            </div>
          )
        }) :
        (<div><FormattedMessage {...formatMessages['noData']} /></div>)
    }

    const iconImage = (childItem.iconUrl && childItem.iconUrl!="")?<img src={childItem.iconUrl} style={{ width: '50%', marginTop: '25%' }} /> : undefined;

    return (
      <Popover content={AlertListContent} >
        <li className={ styles.iconItemLi } data-id={childItem.resId} onMouseLeave={cancelShowAlertList} onMouseEnter={showAlertList}>

          <div className={childItem['severity'] > -1 ? styles.tagsRingTwo : styles.tagsRingTwo2} style={{ background: severityToColor[childItem['severity']] }}>
            {childItem['severity'] <= -1 && iconImage}
          </div>
          {
            childItem['severity'] > -1 && <div className={styles.tagsRingOne} style={{
              marginTop: '-20px',
              //backgroundImage: `url("${childItem.iconUrl}")`,
              backgroundColor: severityToColor[childItem['severity']]
            }}>
              {iconImage}
            </div>
          }

          <div className={styles.tagsName}>{childItem.resName}</div>

        </li>
      </Popover>
    )
  }
}

export default IconItem;
