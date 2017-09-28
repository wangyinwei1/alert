import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'

const levelIcon = ({extraStyle, iconType, initalIconState, onClick, iconState}) => {

    // mapping iconType to classname 
    const iconStyle = iconType === 'jj' || iconType == 3 || iconType === 'Critical'
                    ? classnames(styles.iconMain, extraStyle, styles.jjColorIcon)
                    : iconType === 'gj' || iconType == 2 || iconType === 'Warning'
                        ? classnames(styles.iconMain, extraStyle, styles.gjColorIcon)
                        : iconType === 'tx' || iconType == 1 || iconType === 'Information'
                            ? classnames(styles.iconMain, extraStyle, styles.txColorIcon)
                            : iconType === 'hf' || iconType == 0 || iconType === 'Ok'
                                ? classnames(styles.iconMain, extraStyle, styles.hfColorIcon)
                                : iconType === 'noAlerts'
                                    ? classnames(styles.iconMain, extraStyle, styles.noAlertsColorIcon)
                                    : false
    
    const whiteIcon = classnames(styles.whiteIcon, iconStyle)

    return initalIconState 
                    ? typeof iconState === 'undefined' || iconState
                        ? <div className={iconStyle} onClick={ (e) => onClick(e) }></div>
                            : <div className={whiteIcon} onClick={(e) => onClick(e)}></div>
                    : typeof iconState !== 'undefined' && iconState
                        ? <div className={iconStyle} onClick={(e) => onClick(e)}></div>
                            : <div className={whiteIcon} onClick={(e) => onClick(e)}></div>
}

levelIcon.defaultProps = {
    iconType: 'hf',
    initalIconState: true, // true --> fill
    onClick: () => {}
}

levelIcon.propTypes = {
    iconType: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]).isRequired,
    initalIconState: React.PropTypes.bool.isRequired,
    iconState: React.PropTypes.bool, // true --> fill
    extraStyle: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool
    ]),
    onClick: React.PropTypes.func.isRequired
}

export default levelIcon