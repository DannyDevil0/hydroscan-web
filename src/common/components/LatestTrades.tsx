import React from 'react';
import { connect } from 'react-redux';
import './LatestTrades.scss';
import { fetchTradesLatest, fetchTrades } from '../actions/trade';
import { formatAmount, formatPriceUsd, formatAddress, formatCount } from '../lib/formatter';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Link } from 'found';
import Pagination from 'rc-pagination';
import Loading from '../components/Loading';

const mapStateToProps = (state, props) => {
  return {
    trades: props.tokenAddress ? state.trade.trades : state.trade.tradesLatest,
    page: state.trade.page,
    pageSize: state.trade.pageSize,
    total: state.trade.total,
    tradesLoading: props.tokenAddress ? state.trade.tradesLoading : state.trade.tradesLatestLoading
  };
};

class LatestTrades extends React.PureComponent<any, any> {
  // public componentDidMount() {
  //   const { dispatch, tokenAddress } = this.props;
  //   if (tokenAddress) {
  //     dispatch(fetchTrades({ tokenAddress }));
  //   } else {
  //     dispatch(fetchTradesLatest());
  //   }
  // }

  public render() {
    const { trades, page, pageSize, total, tokenAddress, tradesLoading } = this.props;
    return (
      <div className="LatestTrades section-wrapper">
        <div className="section-header">
          <div className="section-title">LATEST TRADES</div>
          <div className="bottom-border" />
        </div>
        <div className="section-body">
          {tradesLoading ? (
            <Loading />
          ) : (
            <table className="section-table">
              <thead>
                <tr>
                  <td className="pair">Pair</td>
                  <td className="trade-price">Trade Price</td>
                  <td className="buyer">Buyer</td>
                  <td className="buy-amount">Buy Amount</td>
                  <td className="sell-amount">Sell Amount</td>
                  <td className="seller">Seller</td>
                  <td className="transaction">Trascation</td>
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => {
                  return (
                    <tr key={trade.ID}>
                      <td className="pair">
                        <div className="pair-main">{`${trade.baseToken.symbol}/${trade.quoteToken.symbol}`}</div>
                        <div className="pair-secondary">{moment(trade.date).fromNow()}</div>
                      </td>
                      <td className="trade-price">
                        <div className="trade-price-main">
                          {formatAmount(new BigNumber(trade.quoteTokenAmount).div(trade.baseTokenAmount).toFixed())}
                        </div>
                        <div className="trade-price-secondary">
                          {formatPriceUsd(
                            new BigNumber(trade.quoteTokenAmount)
                              .div(trade.baseTokenAmount)
                              .times(trade.quoteTokenPriceUSD)
                              .toFixed()
                          )}
                        </div>
                      </td>
                      <td className="buyer">{formatAddress(trade.makerAddress)}</td>
                      <td className="buy-amount">{formatAmount(trade.baseTokenAmount)}</td>
                      <td className="sell-amount">{formatAmount(trade.quoteTokenAmount)}</td>
                      <td className="seller">{formatAddress(trade.takerAddress)}</td>
                      <td className="transaction">{formatAddress(trade.transactionHash)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {tokenAddress ? (
          <div className="pagination-wrapper">
            <div className="showing-range">
              {`Showing ${(page - 1) * pageSize + 1}-${(page - 1) * pageSize + trades.length} of ${formatCount(total)}`}
            </div>
            <Pagination
              className="ant-pagination"
              defaultCurrent={page}
              pageSize={pageSize}
              total={total}
              onChange={this.handlePageChange.bind(this)}
            />
          </div>
        ) : (
          <div className="view-more-wrapper">
            <Link className="link" to="/trades">
              <div className="view-more">VIEW MORE</div>
            </Link>
          </div>
        )}
      </div>
    );
  }

  public handlePageChange(current, size) {
    const { dispatch } = this.props;
    dispatch(fetchTrades({ page: current }));
  }
}

export default connect(mapStateToProps)(LatestTrades);
