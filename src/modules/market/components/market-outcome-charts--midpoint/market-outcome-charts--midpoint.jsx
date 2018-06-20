import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import Styles from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles'

import { isEqual } from 'lodash'

export default class MarketOutcomeMidpoint extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    chartWidths: PropTypes.object.isRequired,
    headerHeight: PropTypes.number.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    sharedChartMargins: PropTypes.object.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    hasPriceHistory: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      midpointLabelWidth: 0,
      candleNullMessageWidth: 0,
      midpointContainer: null,
    }

    this.drawMidpoint = this.drawMidpoint.bind(this)
    this.getMidpointLabelWidth = this.getMidpointLabelWidth.bind(this)
  }

  componentDidMount() {
    this.drawMidpoint({
      isMobile: this.props.isMobile,
      chartWidths: this.props.chartWidths,
      headerHeight: this.props.headerHeight,
      orderBookKeys: this.props.orderBookKeys,
      sharedChartMargins: this.props.sharedChartMargins,
      midpointLabelWidth: this.state.midpointLabelWidth,
      candleNullMessageWidth: this.state.candleNullMessageWidth,
      hasPriceHistory: this.props.hasPriceHistory,
      hasOrders: this.props.hasOrders,
      fixedPrecision: this.props.fixedPrecision,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(this.props.sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(this.props.chartWidths, nextProps.chartWidths) ||
      this.props.headerHeight !== nextProps.headerHeight ||
      this.props.fixedPrecision !== nextProps.fixedPrecision ||
      this.props.hasPriceHistory !== nextProps.hasPriceHistory ||
      this.props.hasOrders !== nextProps.hasOrders ||
      this.props.isMobile !== nextProps.isMobile ||
      this.state.midpointLabelWidth !== nextState.midpointLabelWidth ||
      this.state.candleNullMessageWidth !== nextState.candleNullMessageWidth
    ) {
      this.drawMidpoint({
        isMobile: nextProps.isMobile,
        chartWidths: nextProps.chartWidths,
        headerHeight: nextProps.headerHeight,
        orderBookKeys: nextProps.orderBookKeys,
        sharedChartMargins: nextProps.sharedChartMargins,
        midpointLabelWidth: nextState.midpointLabelWidth,
        candleNullMessageWidth: nextState.candleNullMessageWidth,
        hasPriceHistory: nextProps.hasPriceHistory,
        hasOrders: nextProps.hasOrders,
        fixedPrecision: nextProps.fixedPrecision,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.midpointContainer, this.state.midpointContainer)) {
      this.getCandleNullMessageWidth()
      this.getMidpointLabelWidth()
    }
  }

  // NOTE -- these measurements are done this way due to the use of reactFauxDom
  getMidpointLabelWidth() {
    const midpointLabelWidth = document.getElementById('midpoint_label')

    this.setState({ midpointLabelWidth: midpointLabelWidth != null ? midpointLabelWidth.getBBox().width : 0 })
  }

  getCandleNullMessageWidth() {
    const candleNullMessageWidth = document.getElementById('midpoint_null_candle_label')

    this.setState({ candleNullMessageWidth: candleNullMessageWidth != null ? candleNullMessageWidth.getBBox().width : 0 })
  }

  drawMidpoint(options) {
    const {
      isMobile,
      orderBookKeys,
      sharedChartMargins,
      midpointLabelWidth,
      candleNullMessageWidth,
      hasPriceHistory,
      hasOrders,
      chartWidths,
      headerHeight,
      fixedPrecision,
    } = options

    if (this.drawContainer) {
      // Faux DOM
      const midpointContainer = new ReactFauxDOM.Element('div')

      const drawParams = determineDrawParams({
        drawContainer: this.drawContainer,
        headerHeight,
        sharedChartMargins,
        chartWidths,
        isMobile,
      })

      // Chart Element
      const midpointChart = d3.select(midpointContainer)
        .append('svg')
        .attr('width', drawParams.containerWidth)
        .attr('height', 40)

      drawMidpointLine({
        drawParams,
        midpointChart,
        midpointLabelWidth,
        candleNullMessageWidth,
        hasPriceHistory,
        hasOrders,
        chartWidths,
        isMobile,
      })

      if (hasOrders) {
        drawMidpointLabel({
          isMobile,
          drawParams,
          orderBookKeys,
          midpointChart,
          fixedPrecision,
        })
      }

      return this.setState({
        midpointContainer: midpointContainer.toReact(),
      })
    }
  }

  render() {
    return (
      <section>
        <div
          ref={(drawContainer) => { this.drawContainer = drawContainer }}
          className={Styles.MarketOutcomeMidpoint}
        >
          {this.state.midpointContainer}
        </div>
      </section>
    )
  }
}

function determineDrawParams(options) {
  const {
    drawContainer,
    headerHeight,
    sharedChartMargins,
    chartWidths,
    isMobile,
  } = options

  const containerWidth = isMobile ? chartWidths.orders : drawContainer.clientWidth
  const containerHeight = drawContainer.clientHeight + headerHeight

  const chartDim = {
    ...sharedChartMargins,
    tickOffset: 10,
    right: 30,
    left: 0,
  }

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([
      chartDim.top,
      containerHeight - chartDim.bottom,
    ])

  return {
    containerWidth,
    containerHeight,
    chartDim,
    yScale,
    chartWidths,
  }
}

function drawMidpointLine(options) {
  const {
    drawParams,
    midpointChart,
    midpointLabelWidth,
    hasOrders,
    chartWidths,
  } = options

  // Establish the midpoint line segments to draw
  const drawSegments = []

  if (hasOrders) {
    drawSegments.push({
      start: 0,
      end: drawParams.containerWidth - midpointLabelWidth - drawParams.chartDim.right,
    })
  }

  drawSegments.forEach((segment) => {
    midpointChart.append('line')
      .attr('class', `${Styles.MarketOutcomeMidpoint__line}`)
      .attr('x1', segment.start)
      .attr('x2', segment.end)
      .attr('y1', () => drawParams.yScale(0.5))
      .attr('y2', () => drawParams.yScale(0.5))
  })

  if (!hasOrders) {
    drawOrdersNullMessage({
      midpointChart,
      drawParams,
      chartWidths,
    })
  }
}

function drawMidpointLabel(options) {
  const {
    drawParams,
    orderBookKeys,
    midpointChart,
    fixedPrecision,
    isMobile,
  } = options

  //  Midpoint Label
  midpointChart.append('text')
    .attr('id', 'midpoint_label')
    .attr('class', `${Styles.MarketOutcomeMidpoint__label}`)
    .attr('x', isMobile ? drawParams.chartWidths.orders : drawParams.containerWidth)
    .attr('y', drawParams.yScale(0.5))
    .attr('text-anchor', isMobile ? 'start' : 'end')
    .attr('dominant-baseline', 'central')
    .text(`${orderBookKeys.mid.toFixed(fixedPrecision)} ETH`)
}

function drawOrdersNullMessage(options) {
  const {
    midpointChart,
    drawParams,
    chartWidths,
  } = options

  midpointChart.append('text')
    .attr('id', 'midpoint_null_candle_label')
    .attr('class', `${Styles['MarketOutcomeMidpoint__null-message']}`)
    .attr('x', chartWidths.orders / 2)
    .attr('y', drawParams.yScale(0.5))
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text('No Open Orders')
}
