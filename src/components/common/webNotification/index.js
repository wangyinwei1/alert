import React, { Component } from 'react'
import Notification from './notification'

let defaultThreshold = 10 // 上限100条
let defaultPlacement = 'topRight';
let defaultPrefix = 'alert-notification';
let defaultTop = 24;
let defaultBottom = 24;
let defaultGetContainer
const notificationInstance = {}

function getPlacementStyle(placement) {
  let style;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: defaultTop,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: defaultBottom,
      };
      break;
    case 'bottomRight':
      style = {
        right: 0,
        top: 'auto',
        bottom: defaultBottom,
      };
      break;
    default:
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto',
      };
  }
  return style
}

function getNotificationInstance(args) {
  if (notificationInstance[defaultPlacement]) {
    return notificationInstance[defaultPlacement];
  }
  notificationInstance[defaultPlacement] = Notification.newInstance(args);
  return notificationInstance[defaultPlacement];
}

const api = {
  // app component open run By set threashold
  config(args) {
    defaultPlacement = args.placement || defaultPlacement
    getNotificationInstance({
      threshold: args.threshold || defaultThreshold,
      style: getPlacementStyle(defaultPlacement),
      prefix: args.prefix || defaultPrefix
    })
  },
  // update when have new notices
  update(notices) {
    if (notificationInstance[defaultPlacement]) {
      notificationInstance[defaultPlacement].update(notices)
    }
  },
  // destroy webNotification
  destroy() {
    Object.keys(notificationInstance).forEach(key => {
      notificationInstance[key].destroy();
      delete notificationInstance[key];
    })
  }
};

export default api