import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { Modal, Button, Slider } from 'antd';
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

class SuppressTimeSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        }
    }

    changeTime(currentTime) {
        this.setState({
            time: currentTime
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isShowTimeSliderModal) {
            this.setState({
                time: 0
            })
        }
    }

    render() {
        const { isShowTimeSliderModal, onCancel, onOk } = this.props;

        const localeMessage = defineMessages({
            ok: {
                id: 'modal.ok',
                defaultMessage: '确定'
            },
            cancel: {
                id: 'modal.cancel',
                defaultMessage: '取消'
            },
            timeSlider_title: {
                id: 'modal.customTime',
                defaultMessage: '自定义时间'
            },
            timeSliderMessage: {
                id: 'modal.timeSlider.message',
                defaultMessage: '拖选时间内，不提醒我',
            }
        })

        const modalFooter = []
        modalFooter.push(<div key={1} className={styles.modalFooter} key={ 1 }>
        <Button type="primary" onClick={ () => {
            let mins = this.state.time * 60
            onOk(mins)
        }} ><FormattedMessage {...localeMessage['ok']} /></Button>
        <Button type="primary" onClick={ () => {
            onCancel()
        }}><FormattedMessage {...localeMessage['cancel']} /></Button>
        </div>
        )

        return (
            <Modal
                title={<FormattedMessage {...localeMessage['timeSlider_title']} />}
                maskClosable="true"
                onCancel={ onCancel }
                visible={ isShowTimeSliderModal }
                footer={ modalFooter }
            >
                <div className={styles.timeSlider}>
                    <p><FormattedMessage {...localeMessage['timeSliderMessage']} /></p>
                    <Slider onChange={this.changeTime.bind(this)} value={this.state.time} className={classnames(styles.hours, `timeMarks${(Number(this.state.time) + 0.5) * 2}`)} tipFormatter={null} min={0} max={24} step={0.5}/>
                </div>
            </Modal>
        )
    }
}

SuppressTimeSlider.propTypes = {

}

export default injectIntl(SuppressTimeSlider);