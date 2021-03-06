import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatCount, formatPriceUsd, formatPercent, formatVolumeUsd, formatAmount } from '../lib/formatter';
import { fetchTokens } from '../actions/token';
import { connect } from 'react-redux';
import './Tokens.scss';
import Pagination from 'rc-pagination';
import en_US from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import { Link } from 'found';
import { getTokenLogoUrl, changeColor } from '../lib/utils';
import Loading from '../components/Loading';

const mapStateToProps = state => {
  return {
    tokens: state.token.tokens,
    page: state.token.page,
    pageSize: state.token.pageSize,
    total: state.token.total,
    tokensLoading: state.token.tokensLoading
  };
};

class Tokens extends React.Component<any, any> {
  public render() {
    const { tokens, page, pageSize, total, tokensLoading, location } = this.props;
    const { keyword, relayerAddress, traderAddress } = location.query;
    let title = 'Tokens';
    let secondary = '';
    if (keyword) {
      title = 'Tokens - Search ';
      secondary = keyword;
    } else if (relayerAddress) {
      title = 'Tokens - Relayer ';
      secondary = relayerAddress;
    } else if (traderAddress) {
      title = 'Tokens - Trader ';
      secondary = traderAddress;
    }
    return (
      <div className="Tokens">
        <Header />
        <div className="container">
          <div className="main-wrapper">
            <div className="main-header">
              <div className="main-title">
                <div className="main">{title}</div>
                <div className="secondary">{secondary}</div>
              </div>
              <div className="pagination-wrapper-top">
                <Pagination
                  className="ant-pagination"
                  locale={en_US}
                  defaultCurrent={1}
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={this.handlePageChange.bind(this)}
                />
              </div>
            </div>
            <div className={`main-body ${tokens.length === pageSize ? 'full-page' : ''}`}>
              {tokensLoading ? (
                <Loading />
              ) : (
                <table className="main-table">
                  <thead>
                    <tr>
                      <td className="rank">#</td>
                      <td className="token">Token</td>
                      <td className="volume">24h Volume (USD)</td>
                      <td className="change">24h Vol Change</td>
                      {!traderAddress && <td className="traders">24h Traders</td>}
                      <td className="price">Last Price (USD)</td>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token, index) => {
                      return (
                        <tr key={token.address}>
                          <td className="rank">{(page - 1) * pageSize + index + 1}</td>
                          <td className="token">
                            <object data={getTokenLogoUrl(token.address)} type="image/png">
                              <div className="default-img" />
                            </object>
                            <div>
                              <Link className="link" to={`/tokens/${token.address}`}>
                                <div className="main">{token.name}</div>
                              </Link>
                              <div className="secondary">{token.symbol}</div>
                            </div>
                          </td>
                          <td className="volume">
                            <div className="main">{formatVolumeUsd(token.volume24h)}</div>
                            <div className="secondary">{`${formatAmount(token.amount24h)} ${token.symbol}`}</div>
                          </td>
                          <td className={`change ${changeColor(token.volume24hChange)}`}>
                            <div className="main">{formatPercent(token.volume24hChange)}</div>
                          </td>
                          {!traderAddress && (
                            <td className="traders">
                              <div className="main">{formatCount(token.traders24h)}</div>
                            </td>
                          )}
                          <td className="price">
                            <div className="main">{token.priceUSD === '0' ? '-' : formatPriceUsd(token.priceUSD)}</div>
                            <div className="secondary">
                              {token.priceUSD === '0' ? '' : moment(token.priceUpdatedAt).fromNow()}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="page-wrapper pagination-wrapper">
            <div className="showing-range">
              {`Showing ${(page - 1) * pageSize + 1}-${(page - 1) * pageSize + tokens.length} of ${formatCount(total)}`}
            </div>
            <Pagination
              className="ant-pagination"
              locale={en_US}
              defaultCurrent={1}
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={this.handlePageChange.bind(this)}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  public handlePageChange(page, size) {
    const { dispatch, location } = this.props;
    const { keyword, relayerAddress, traderAddress } = location.query;
    dispatch(fetchTokens({ page, keyword, relayerAddress, traderAddress }));
  }
}

export default connect(mapStateToProps)(Tokens);
