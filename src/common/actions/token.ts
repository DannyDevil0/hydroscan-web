export const fetchTokens = payload => {
  return {
    type: 'FETCH_TOKENS',
    payload
  };
};

export const setTokens = payload => {
  return {
    type: 'SET_TOKENS',
    payload
  };
};

export const setTokensLoading = payload => {
  return {
    type: 'SET_TOKENS_LOADING',
    payload
  };
};

export const fetchToken = payload => {
  return {
    type: 'FETCH_TOKEN',
    payload
  };
};

export const setToken = payload => {
  return {
    type: 'SET_TOKEN',
    payload
  };
};

export const setTokenLoading = payload => {
  return {
    type: 'SET_TOKEN_LOADING',
    payload
  };
};
