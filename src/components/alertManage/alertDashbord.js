import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Spin } from 'antd'
import * as d3 from 'd3'
import pathToRegexp from 'path-to-regexp';
import { event as currentEvent } from 'd3'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Tip from './d3Tip'
import $ from 'jquery'

import AlertSet from './alertSet'
const d3Tip = new Tip

const formatMessages = defineMessages({
  noData: {
    id: 'alertManage.noData',
    defaultMessage: '告警看板暂无数据，请先设置关注数据',
  },
  NEW: {
    id: 'treemap.activeAlerts',
    defaultMessage: '未接手告警',
  },
  PROGRESSING: {
    id: 'treemap.assignedAlerts',
    defaultMessage: '处理中告警',
  },
  RESOLVED: {
    id: 'treemap.resolvedAlerts',
    defaultMessage: '已解决告警',
  },
  EXCEPTCLOSE: {
    id: 'treemap.exceptClosed',
    defaultMessage: '所有未关闭告警',
  }
})
const deepCopy = (soruce) => {
  return JSON.parse(JSON.stringify(soruce));
}


class Chart extends Component {

  constructor(props) {
    super(props)
    // this.setTreemapHeight = this.setTreemapHeight.bind(this);
    this.timer = null // 定时器
    this.chartProps = { };

    const { location } = this.props;
    const { pathname } = location;
    if(pathToRegexp('/alertManage/:id').test(pathname)) {
      const matchs = pathToRegexp('/alertManage/:id').exec(pathname);
      this.id = matchs[1];
    }
  }
  setTreemapHeight(ele) {
    // const _percent = 0.85 // 占屏比
    const clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    ele.style.height = (clientHeight - 130) + 'px'

  }
  shouldComponentUpdate(nextProps) {
    return this.chartProps.currentDashbordData !== nextProps.currentDashbordData || this.chartProps.isFullScreen !== nextProps.isFullScreen
  }
  componentDidMount() {
    const self = this;
    let htmlDomClassName = document.getElementsByTagName('html')[0].className;

    const severityToColor = {
      '0': 'recovery', // 恢复
      '1': 'remind', // 提醒
      '2': 'notice', // 警告
      '3': 'urgent'  // 紧急
    }
    this.chartWidth = document.documentElement.clientWidth - 160 - 90
    this.chartHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight) - 180
    this.xscale = d3.scale.linear().range([0, this.chartWidth])
    this.yscale = d3.scale.linear().range([0, this.chartHeight])
    this.color = function (num) {
      // 没有数据时的颜色
      if (num < 0) {
        return 'nodata'
      }
      return severityToColor[num]
    }

    this.chart = d3.select("#treemap")
      .append("svg:svg")
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .append("svg:g")


    this.timer = setInterval(() => {
      // 全屏下不刷新
      //if(!this.chartProps.isFullScreen){
      this.chartProps.requestFresh()
      //}

    }, 60000)

    // 监听ESC
    document.addEventListener('keyup', (e) => {
      if (this.chartProps.isFullScreen) {
        if (e.keyCode === 27) { //esc按键
          self.props.setFullScreen()
        }
      }
    }, false)

    // 加载面板
    const { dispatch, id, params } = this.props;
    dispatch({ type: 'alertManage/alertManageSetup', payload: { id: this.id } })
  }

  componentWillReceiveProps({ alertManage, isFold, dispatch }) {
    const {
      isSetAlert,
      levels ,
      hideAlertSetTip,
      modalVisible,
      tagsNum,
      tagsList,
      isLoading,
      isFullScreen,
      isFixed,
      currentDashbordData,
      oldDashbordDataMap,
      selectedStatus,
      selectedTime,
      isNeedRepaint
    } = alertManage;

    const chartProps = {
      selectedStatus,
      selectedTime,
      isFold,
      currentDashbordData: currentDashbordData || [],
      oldDashbordDataMap,
      isNeedRepaint,
      isLoading,
      isFullScreen,
      isFixed,
      setFullScreen(){
        dispatch({
          type: 'alertManage/setFullScreen'
        })
      },
      requestFresh: () => {
        dispatch({
          type: 'alertManage/queryAlertDashbord',
          payload: {
            id: this.id
          }
        })
      }
    }

    this.chartProps = chartProps;
  }

  componentDidUpdate(nextProps) {
    const { oldDashbordDataMap, isFixed, isNeedRepaint } = this.chartProps;

    if (this.chartProps.isFixed != nextProps.isFixed || this.chartProps.isFullScreen != nextProps.isFullScreen) {
      this._repaint();
      return;
    }

    if (this.treemap && !isNeedRepaint) {
      this._update();
    } else {
      this._repaint();
    }

  }

  componentWillUnmount() {
    d3Tip.hide();
    clearInterval(this.timer)
  }

  // 根据窗口大小重新设置每一块的大小
  _resize() {

  }

  // 全屏
  _fullScreen() {
    const childCells = d3.select(".cell.child");
    const parentCells = d3.select(".cell.parent");

  }

  _idealTextColor(bgColor) {
    var nThreshold = 105;
    var components = this._getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
  }

  _getRGBComponents(color) {
    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);
    return {
      R: parseInt(r, 16),
      G: parseInt(g, 16),
      B: parseInt(b, 16)
    };
  }

  // 单元格内容变化
  _textTransition(selector, isFullScreen) {
    const cells = d3.select(selector);
    // cells.selectAll("*").interrupt();
    const textTransition = cells.select("svg").select(".label")
      .attr("isFullScreen", isFullScreen)
      .text((d) => this._wrap(d, isFullScreen ? this.chartWidth / d.parent.dx * d.dx : d.dx))
      .transition();

    if (isFullScreen) {
      textTransition.each("end", function (d) {
        textTransition.attr("isFullScreen", isFullScreen);
      })
    }
  }

  // 计算文本宽度
  _textSize(fontSize, text) {
    var span = document.createElement("span");
    var result = {};
    result.width = span.offsetWidth;
    result.height = span.offsetWidth;
    span.style.visibility = "hidden";
    span.style.fontSize = fontSize
    document.body.appendChild(span);
    if (typeof span.textContent != "undefined")
      span.textContent = text;
    else span.innerText = text;
    result.width = span.offsetWidth - result.width;
    result.height = span.offsetHeight - result.height;
    span.parentNode.removeChild(span);
    return result;
  }

  _wrap(d, actualWidth) {
    let text = d.name;
    let textSize = this._textSize("13px", text);
    let isShorted = false;

    // 防止死循环，当内容压缩为‘’时退出循环
    while (text != '' && textSize.width > d.dx - 40 && textSize.width > 2) {
      isShorted = true;
      text = text.substring(0, text.length - 1);
      textSize = this._textSize("13px", text + '...');
    }

    // 如果内容为‘’，且‘...’占据的空间依旧比个子空间大，则不显示任何内容
    if (text == '' && this._textSize("13px", text + '...') > d.dx - 40) {
      isShorted = false;
    }

    return isShorted ? (text + "...") : text;
  }

  _update() {
    const { oldDashbordDataMap, currentDashbordData } = this.chartProps;

    var children = currentDashbordData.filter(function (d) {
      return !d.children;
    });
    const childrenCells = d3.selectAll("g.cell.child");
    childrenCells
      .data(children, function (d) {
        return "c-" + d.path;
      });

    currentDashbordData.forEach((parentNode, index) => {
      parentNode.children.forEach((childNode) => {
        const oldNode = oldDashbordDataMap[childNode.id];
        const wrap = this._wrap;
        const currentNode = d3.select("[id='" + childNode.id + "']");

        // 最高级别警告发生变化时呈现的动画
        if ((childNode && oldNode) && childNode.maxSeverity != oldNode.maxSeverity) {
          const svg = currentNode.select("svg");
          if (currentNode[0] && currentNode[0][0]) {
            currentNode[0][0].__data__.maxSeverity = childNode.maxSeverity;
          }
          svg
            .select("rect.background")
            .transition()
            .duration(2000)
            .attr("class", (d) => {
              return `background ${this.color(childNode.maxSeverity || 0)}`
            })
        }

        // 告警数发生变化时呈现的动画
        if (childNode && (!oldNode || oldNode.trueVal != childNode.trueVal)) {
          const node = this.chart.select("[id='" + childNode.id + "']");
          currentNode[0][0].__data__.trueVal = childNode.trueVal;
          currentNode[0][0].__data__.noData = childNode.trueVal == 0;
          node.data(childNode);
          const svg = d3.select("[id='" + childNode.id + "']").select("svg");
          let isInAction = false;
          const labelTransition = svg
            .select("text.label")
            .transition()
            .each("start", function (d) {
              if (d.isInAction) {
                isInAction = true
              } else {
                d.isInAction = true;
              }
            });

          if (!isInAction) {
            labelTransition
              .duration(500)
              .style("opacity", "0")
              .transition()
              .delay(2000)
              .transition()
              .duration(500)
              .style("opacity", "1")
              .each("end", function (d) {
                d.isInAction = false;
              })

            const text = svg
              .append("text")
              .attr("class", "tipLabel")
              .attr('x', function (d) {
                if (d.kx) {
                  return d.kx * d.dx / 2;
                } else {
                  return d.dx / 2;
                }
              })
              .attr("dy", ".35em")
              .attr("fill", "#04203e")
              .attr("font-size", "13")
              .attr("text-anchor", "middle")
              .text((oldNode.trueVal > childNode.trueVal ? ('-' + (oldNode.trueVal - childNode.trueVal)) : '+' + (childNode.trueVal - oldNode.trueVal)))
              .style("color", "red")
              .attr('font-size', function (d) {
                const self = d3.select(this);
                const originFontSize = self.attr("font-size");
                const originStyle = document.defaultView.getComputedStyle(self.node())
                const textLength = self.node().getComputedTextLength();
                const fontSizeTimesDx = d.dx / textLength;
                const fontSizeTimesDy = d.dy / originStyle.lineHeight;
                let targetFontSize = 13 * (fontSizeTimesDx > fontSizeTimesDy ? fontSizeTimesDy : fontSizeTimesDx) * 0.8;

                if (targetFontSize > 30) {
                  targetFontSize = 30
                }
                return targetFontSize;
              })

            // 若告警数减少则数字从上往下移动，否则从下往上移动
            if (oldNode.trueVal < childNode.trueVal) {
              text
                .attr('y', function (d) {
                  if (d.ky) {
                    return d.ky * d.dy;
                  } else {
                    return d.dy;
                  }
                })
                .transition()
                .duration(1000)
                .attr('y', function (d) {
                  if (d.ky) {
                    return d.ky * d.dy / 2
                  } else {
                    return d.dy / 2;
                  }
                })
                .transition()
                .duration(1000)
                .attr('y', function (d) {
                  return -10;
                })
            } else {
              text
                .attr('y', function (d) {
                  return 0;
                })
                .transition()
                .duration(1000)
                .attr('y', function (d) {
                  if (d.ky) {
                    return d.ky * d.dy / 2
                  } else {
                    return d.dy / 2;
                  }
                })
                .transition()
                .duration(1000)
                .attr('y', function (d) {
                  if (d.ky) {
                    return d.ky * d.dy + 10
                  } else {
                    return d.dy + 10;
                  }
                })
            }

            text
              .transition()
              .delay(2000)
              .style("display", "none")
              .text((d) => this._wrap(d))
              .remove();
          }
        }
      })
    })

    if (!this.chartProps.isFixed) {
      setTimeout(() => { this._repaint(); }, 3000);
    }
  }

  _repaint() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      // 全屏下不刷新
      //if(!this.props.isFullScreen){
      this.chartProps.requestFresh()
      //}

    }, 60000)

    let { selectedStatus } = this.chartProps;
    let { intl: { formatMessage } } = this.props;

    // 如果全屏
    const treemapNode = document.querySelector('#treemap')

    // 去掉所有动画
    $("text.label").css("opacity", "1");
    $("text.tipLabel").remove();

    if (this.chartProps.isFullScreen) {
      //这里是为了遮住头部的那段空白 用了下面hack
      //  高度添加40px(headerHeight为40)
      // 然后在往上移动40px遮住空白
      this.chartWidth = window.innerWidth
      this.chartHeight = window.innerHeight
      treemapNode.style.cssText = 'position:fixed;top:-20px;left:0'

    } else {
      if (this.chartProps.isFold) {
        this.chartWidth = document.documentElement.clientWidth - 140;
      } else {
        this.chartWidth = document.documentElement.clientWidth - 160 - 90;
      }
      this.chartHeight = window.innerHeight - 180
      treemapNode.style.cssText = 'position:absolute;'
    }


    this.xscale = d3.scale.linear().range([0, this.chartWidth]);
    this.yscale = d3.scale.linear().range([0, this.chartHeight]);

    d3.select("#treemap")
      .select('svg')
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)

    // 计算总的告警数 主要是为了当告警数很小时 区域无法显示 给一个最小的区域快大小
    let sumAlerts = 0
    this.chartProps.currentDashbordData.forEach((item) => {
      sumAlerts += item.value
    })


    this.treemap = d3.layout.treemap()
      .round(false)
      .size([this.chartWidth, this.chartHeight])
      .sticky(true)
      .value(function (d) {
        if (d.fixedValue) {
          return d.fixedValue
        } else {
          return d.value
        }

      });
    let htmlDomClassName = document.getElementsByTagName('html')[0].className;
    var headerHeight = 40;
    var transitionDuration = 500;
    var root;
    var node;

    if (this.chartProps.currentDashbordData.length < 1) {
      d3.select("#treemap").select('svg').attr('height', 0)
      return
    } else {
      d3.select("#treemap").select('svg').attr('height', this.chartHeight)
    }

    let updateData = deepCopy(this.chartProps.currentDashbordData)
    updateData.forEach((item, index) => {
      if (item.value == 0) { item.noData = true }
      if (item.children) {
        let hasZeros = 0
        item.children.forEach((childItem) => {
          if (childItem.value == 0) {
            childItem.value = 1
            childItem.noData = true
            hasZeros++

          } else {

          }
        })
        item.value = hasZeros
      }
    })

    node = root = {
      path: 'root',
      children: updateData
    };

    var nodes = this.treemap.nodes(root)

    var children = nodes.filter(function (d) {
      return !d.children;
    });
    var parents = nodes.filter(function (d) {
      return d.children;
    });

    // d3.json("../../../mock/alert.json", function(data) {
    if (children.length > 0) {

      // create parent cells
      var parentCells = this.chart.selectAll("g.cell.parent")
        .data(parents.slice(1), function (d) {
          return "p-" + d.path;
        });

      var parentEnterTransition = parentCells.enter()
        .append("g")
        .attr("class", "cell parent")
        .on("click", d => {

        })

        .attr("id", function (d) {
          return d.id
        })

        .append("svg")
        .attr("class", "clip")
        .attr("width", function (d) {
          return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight);
      parentEnterTransition.append("rect")
        .classed("background", true)
        .attr("width", function (d) {
          return Math.max(0.01, d.dx);
        })
        .attr('stroke-width', '4')
        .attr("height", headerHeight);
      parentEnterTransition.append('text')
        .attr("class", "label")
        .attr("fill", (htmlDomClassName == 'white') ? "#4082e6" : "#6ac5fe")
        .attr("text-anchor", "middle")
        .attr("x", function (d) {
          return Math.max(0.01, d.dx / 2);
        })
        .attr("y", "12")
        .attr("transform", "translate(3, 13)")
        .attr("width", function (d) {
          return Math.max(0.01, d.dx);
        })
        .attr('font-size', '13')
        .attr("height", headerHeight)
        .text((d) => this._wrap(d))
      // update transition
      var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
      parentUpdateTransition.select(".cell")
        .attr("transform", function (d) {
          return "translate(" + d.dx + "," + d.y + ")";
        });
      parentUpdateTransition.select("rect.background")
        .attr("width", function (d) {
          return Math.max(0.01, d.dx);
        })
        .attr("x", function (d) {
          return Math.max(0.01, d.dx / 2);
        })
        .attr("y", "10")
        .attr("height", headerHeight)
      parentUpdateTransition.select(".label")
        .attr("transform", "translate(3, 13)")
        .attr("width", function (d) {
          return Math.max(0.01, d.dx);
        })
        .attr('font-size', '20')
        .attr("height", 20)
        .text((d) => d.name);
      // remove transition
      parentCells.exit()
        .remove();

      // create children cells
      var childrenCells = this.chart.selectAll("g.cell.child")
        .data(children, function (d) {
          return "c-" + d.path;
        });
      // enter transition
      var childEnterTransition = childrenCells.enter()
        .append("g")
        .attr("class", "cell child")
        .attr("id", function (d) {
          return d.id
        })
        .on("contextmenu", (d, e) => {
          const parentD = node === d.parent ? root : d.parent;
          // 如果该节点已处于动画当中，则不执行此次动画
          if (d.isInAction) {
            currentEvent.preventDefault();
            return;
          }
          d.isInAction = true;
          zoom.call(this, node === d.parent ? root : d.parent, d.parent)
          // this._textTransition("#" + parentNode.id + " > .child");
          if (parentD.parent) {
            parentD.children.forEach((childD) => {
              childD.isFullScreen = true;
            })
          }
          d3Tip.hide()
          currentEvent.preventDefault()
        })
        .on("click", (d) => {
          d3Tip.hide()
          let alertListPath = {};
          let pName = d.parent.name
          let pKey = d.parent.key
          if (pKey) {
            alertListPath[pKey] = { key: pKey, keyName: pName, values: d.name }
          }

          localStorage.setItem('alertListPath', JSON.stringify(alertListPath))
          localStorage.setItem('__visual_group', pKey)

          if (pName != 'source' && pName != 'status' && pName != 'severity') {
            const gr1 = [{ key: pKey, value: d.name }]
            localStorage.setItem('__alert_visualAnalyze_gr1', JSON.stringify(gr1))
          }
          window.location.hash = "#/alertManage/alertList";
        })

        // .on('mouseout', tip.hide)

        .append("svg")
        .attr("class", "clip")

      childEnterTransition.append("rect")
        .classed("background", true)
        // .attr('filter',"url(#inset-shadow)")
        .attr('stroke-width', '2')
        .attr("style", "cursor:pointer")
        .style("fill", (d) => {
          // return color(d.maxSeverity);
        })
        .on('mouseenter', (d) => {
          d3Tip.show(d, formatMessage({ ...formatMessages[this.chartProps.selectedStatus] }))
        })
        .on('mouseleave', function () {
          d3Tip.hide()
        })
      childEnterTransition.append("line")
        .classed("shadow", true)
        .attr('stroke', '#000')
        .attr('stroke-opacity', '0.1')
        .attr('stroke-width', '28')
        .style("stroke-linecap", "round")
      childEnterTransition.append('text')
        .attr("class", "label")
        .attr('x', function (d) {
          return d.dx / 2;
        })
        .attr('y', function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("fill", "#ffffff")
        .attr("font-size", "14")
        //.attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        // .style("display", "none")
        .text((d) => d.name)
        .on('mouseover', (d) => {
          d3Tip.show(d, formatMessage({ ...formatMessages[this.chartProps.selectedStatus] }))
          return false
        })
        .on('mouseout', (d) => {
          d3Tip.show(d, formatMessage({ ...formatMessages[this.chartProps.selectedStatus] }))
          return false
        })
      // update transition
      var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
      childUpdateTransition.select(".cell")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      childUpdateTransition.select("rect.background")
        .attr("width", function (d) {
          return Math.max(0.01, d.dx);
        })
        .attr("height", function (d) {
          return d.dy;
        })
        .style("fill", function (d) {
          // return color(d.maxSeverity);
        });
      childUpdateTransition.select(".label")
        .attr('x', function (d) {
          return d.dx / 2;
        })
        .attr('y', function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        // .text((d) => this._wrap();
        .text((d) => this._wrap(d))

      // exit transition
      childrenCells.exit()
        .remove();



      zoom.call(this, node);
      // });


      function size(d) {
        if (d.fixedValue) {
          return d.fixedValue;
        } else {
          return d.value;
        }
      }


      // function count(d) {
      //     return 1;
      // }


      //and another one
      function textHeight(d) {
        var ky = this.chartHeight / d.dy;
        this.yscale.domain([d.y, d.y + d.dy]);
        return (ky * d.dy) / headerHeight;
      }


      function zoom(d, cellD) {

        d.isInAction = true;

        this.treemap
          .padding([headerHeight / (this.chartHeight / d.dy), 0, 0, 0])
          .nodes(d);

        // moving the next two lines above treemap layout messes up padding of zoom result
        var kx = this.chartWidth / d.dx;
        var ky = this.chartHeight / d.dy;
        var level = d;

        this.xscale.domain([d.x, d.x + d.dx]);
        this.yscale.domain([d.y, d.y + d.dy]);

        if (node != level) {
          this.chart.selectAll(".cell.child .label")
          // .style("display", "none");
        }


        const parentD = d;

        if (parentD.parent) {
          parentD.children.forEach((childD) => {
            childD.kx = kx;
            childD.ky = ky;
          })
        } else if (cellD) {
          cellD.children.forEach((childD) => {
            childD.kx = undefined;
            childD.ky = undefined;
          })
        }

        // const kxTransition = d3.select("#" + d.id).attr("kx", kx);

        var zoomTransition = this.chart.selectAll("g.cell").transition().duration(transitionDuration)
          .attr("transform", (d) => {
            return "translate(" + this.xscale(d.x) + "," + this.yscale(d.y) + ")";
          })
          .each("start", function () {
            d3.select(this).select("label")
              .style("display", "none");
          })
          .each("end", (d, i) => {
            d.isInAction = false;
            if (!i && (level !== self.root)) {
              const tempNode = d3.select("[id='" + d.id + "']");
              parentD.children.forEach((childD) => {
                d3.select("[id='" + childD.id + "']").select('.label').text((d) => this._wrap(d));
              })
              // this.chart.selectAll(".cell.child")
              //     .filter(function(d) {
              //         return d.parent === self.node; // only get the children for selected group
              //     })
              //     .select(".label")
              //     .style("display", "")
              //     .text(this._wrap)
              //     .style("fill", (d) => {
              //       return this._idealTextColor(color(d.maxSeverity));
              //     });
            }

            const matchD = parentD.children.filter((childD) => childD.id == d.id);
            if (matchD && matchD.length > 0 && level.depth == 1) {
              this._textTransition("[id='" + matchD[0].id + "']", true);
            }
          })

        zoomTransition.select(".clip")
          .attr("width", function (d) {
            return Math.max(0.01, (kx * d.dx));
          })
          .attr("height", function (d) {
            return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
          });

        zoomTransition.select(".label")
          .attr("width", function (d) {
            return Math.max(0.01, (kx * d.dx));
          })
          .attr("height", function (d) {
            return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
          })
          .text((d) => this._wrap(d));

        zoomTransition.select(".child .label")
          .attr("x", function (d) {
            return kx * d.dx / 2;
          })
          .attr("y", function (d) {
            return ky * d.dy / 2;
          })
          .attr("font-size", "11.5pt")
        //.style("text-shadow", "1px 1px 1px #333")
        zoomTransition.select(".child .shadow")
          .attr("x1", (d) => {
            const result = this._textSize('11.5pt', this._wrap(d))
            return (kx * d.dx / 2) - (result.width / 2);
          })
          .attr("y1", function (d) {
            return ky * d.dy / 2;
          })
          .attr("x2", (d) => {
            const result = this._textSize('11.5pt', this._wrap(d))
            return (kx * d.dx / 2) + (result.width / 2);
          })
          .attr("y2", function (d) {
            return ky * d.dy / 2;
          })
        zoomTransition.select(".parent .label")
          .attr("x", function (d) {
            return kx * d.dx / 2;
          })


        zoomTransition.select("rect.background")
          .attr("width", function (d) {
            return Math.max(0.01, (kx * d.dx));
          })
          .attr("height", function (d) {
            return d.children ? headerHeight : Math.max(0.01, (ky * d.dy));
          })
          .attr("class", d => {
            if (!d.children && d.noData) {
              return 'nodata background'
            }
            return d.children ? 'background nodata' : `background ${this.color(d.maxSeverity || 0)}`;
          });


        node = d;

        if (d3.event) {
          d3.event.stopPropagation();
        }
      }
    }
  }


  render() {

    const hasData = Array.isArray(this.chartProps.currentDashbordData) && this.chartProps.currentDashbordData.length > 0

    const { dispatch, isShowMask } = this.props;

    const alertSetProps = {
      hideAlertSetTip: this.chartProps.hideAlertSetTip,

      onOk(){
        dispatch({
          type: 'app/showMask',
          payload: false
        })
        dispatch({
          type: 'alertManage/toggleAlertSetTip',
          payload: true
        })
      }
    }

    // 下面分开判断主要是为了没数据居中显示
    return (
      <div>
        <div className={styles.loadingWrap}>
          <Spin spinning={this.chartProps.isLoading}>
            <div id="treemap" className={styles.treemap + ' ' + (this.chartProps.isFullScreen ? styles.maxTreemap : '')}>

            </div>
          </Spin>
        </div>
        {!hasData && <div className={styles.alertNoData}><FormattedMessage {...formatMessages['noData']} /></div>}
        {
          isShowMask ?
          <AlertSet {...alertSetProps}/>
          :
          undefined
        }
      </div>
    )
  }

}
export default injectIntl(connect(state => {
  return {
    alertManage: state.alertManage,
    isFold: state.app.isFold,
    isShowMask: state.app.isShowMask
  }
})(Chart))
