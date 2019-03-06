import React from 'react';
import { connect } from 'react-redux';
import './Chart.scss';
import { fetchTradesChart } from '../actions/trade';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { formatVolumeUsdShort, formatCountShort, formatVolumeUsd, formatCount, capitalize } from '../lib/formatter';
import FilterTabs from './FilterTabs';
import Loading from '../components/Loading';

const CustomTooltip = args => {
  const { active, payload, label } = args;
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{moment(label).format('MMMM Do YYYY, h:mm:ss a')}</p>
        {payload[1] && (
          <p className="label">{`${capitalize(payload[1].dataKey)}: ${formatVolumeUsd(payload[1].value)}`}</p>
        )}
        <p className="label">{`${capitalize(payload[0].dataKey)}: ${formatCount(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

const mapStateToProps = (state, props) => {
  return {
    chartData: state.trade.chartData,
    chartDataLoading: state.trade.chartDataLoading
  };
};

class Chart extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: 'VOLUME',
      sections: ['VOLUME', 'TRADES'],
      currentTab: '1M',
      tabs: ['24H', '7D', '1M', 'ALL']
    };
  }

  public render() {
    const { chartData, tokenAddress, relayerAddress, traderAddress, dispatch, chartDataLoading } = this.props;
    const { currentTab, tabs, currentSection, sections } = this.state;
    const showTraders = !traderAddress;
    const areaKey = currentSection === 'VOLUME' ? 'volume' : 'trades';
    return (
      <div className="Chart section-wrapper">
        <div className="chart-header">
          <div className="chart-title">
            {sections.map(section => {
              return (
                <div
                  key={section}
                  className={section === currentSection ? 'section-title' : 'section-title-inactive'}
                  onClick={() => {
                    this.setState({ currentSection: section });
                  }}>
                  {section}
                </div>
              );
            })}
          </div>

          <div className="filter-wrapper">
            <FilterTabs
              currentTab={currentTab}
              tabs={tabs}
              clickTab={tab => {
                this.setState({ currentTab: tab });
                dispatch(fetchTradesChart({ tokenAddress, relayerAddress, traderAddress, tab }));
              }}
            />
          </div>
          <div className="bottom-border" />
        </div>
        <div className="responsive-wrapper">
          {chartDataLoading ? (
            <Loading />
          ) : (
            <ResponsiveContainer>
              <ComposedChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 5
                }}>
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey="date"
                  tickFormatter={tick => {
                    return moment(tick).format('MMM Do');
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  yAxisId={areaKey}
                  tickFormatter={tick => {
                    return currentSection === 'VOLUME' ? formatVolumeUsdShort(tick) : formatCountShort(tick);
                  }}
                />
                {showTraders && (
                  <YAxis
                    hide={true}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin', dataMax => dataMax * 3]}
                    yAxisId="traders"
                    tickFormatter={tick => {
                      return formatCountShort(tick);
                    }}
                    orientation="right"
                  />
                )}
                {showTraders && (
                  <Bar
                    type="monotone"
                    dataKey="traders"
                    yAxisId="traders"
                    barSize={10}
                    stroke="#f1f3f4"
                    fill="#f1f3f4"
                  />
                )}
                <defs>
                  <linearGradient id="LineGradient" x1="0" y1="100%" x2="0" y2="0%">
                    <stop offset="0%" stopColor={'#00c6a3'} stopOpacity={0} />
                    <stop offset="50%" stopColor={'#00c6a3'} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={'#00c6a3'} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey={areaKey} yAxisId={areaKey} stroke="#00c6a3" fill="url(#LineGradient)" />
                <Tooltip content={<CustomTooltip />} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Chart);
