import fetch from 'isomorphic-fetch';
import { catchError, filter, flatMap, map } from 'rxjs/operators';
import { setTokens, setTokensLoading, setTokensTop } from '../actions/token';
import Epic from './epic';

export const tokensLoading: Epic = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === 'FETCH_TOKENS'),
    map(() => {
      return setTokensLoading(true);
    })
  );

export const fetchTokens: Epic = action$ =>
  action$.pipe(
    filter(action => action.type === 'FETCH_TOKENS'),
    flatMap(action => {
      return fetch(`${process.env.RAZZLE_HYDROSCAN_API_URL}/api/v1/tokens?page=${action.payload.page}`);
    }),
    flatMap(response => response.json()),
    map(body => body as any),
    flatMap((json: any) => [
      setTokens({
        tokens: json.tokens,
        page: json.page,
        pageSize: json.pageSize,
        total: json.count
      }),
      setTokensLoading(false)
    ]),
    catchError((error: Error) => [console.log(error), setTokensLoading(false)])
  );

export const fetchTokensTop: Epic = action$ =>
  action$.pipe(
    filter(action => action.type === 'FETCH_TOKENS_TOP'),
    flatMap(action => {
      return fetch(`${process.env.RAZZLE_HYDROSCAN_API_URL}/api/v1/tokens?pageSize=10&filter=${action.payload.filter}`);
    }),
    flatMap(response => response.json()),
    map(body => body as any),
    flatMap((json: any) => [setTokensTop({ tokensTop: json.tokens })]),
    catchError((error: Error) => [console.log(error)])
  );
