/* eslint-disable consistent-return */
import _ from 'lodash';
import withQuery from 'with-query';
import { message } from 'antd';

const request = ({
  url, method, body, isfiles,
}) => {
  let bearerHeader = 'Bearer ';
  // bitgii hamaagvi uurchluud baildaa uur zunduu gazar ashiglchihsn bgaa ymiig !!!!!!!!!!!!!!!!!!!!
  const root = localStorage.getItem('auth') === null ? null : JSON.parse(localStorage.getItem('auth'));

  if (root !== null) {
    bearerHeader += root.data[0].info.access_token;
  }
  if (method === 'GET') {
    return fetch(withQuery(process.env.API + url, body), {
      credentials: 'include',
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: bearerHeader,
        'Access-Control-Allow-Headers': '*',
      },
    }).then((response) => {
      if (response.status === 401 || response.status === 403) {
        // localStorage.clear();
      }
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }

  if (isfiles) {
    const request = new Request(process.env.HOST_SERVER + url, {
      method,
      headers: new Headers({ Authorization: bearerHeader }),
      body,
    });
    return fetch(request).then((response) => {
      if (!response.ok) { throw new Error(response.statusText); }
      return response.json();
    });
  }

  return fetch(process.env.API + url, {
    credentials: 'include',
    method,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: bearerHeader,
    },
    body: JSON.stringify(body),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

const asyncFn = ({
  body, url, method = 'GET', model, name, isfiles = false,
}) => async (dispatch) => {
  const payload = {};
  dispatch({
    type: model.request,
    payload,
    name,
  });
  try {
    if (model.request === 'REQUEST_LOGOUT') {
      dispatch({
        type: model.response,
        name,
      });
    } else {
      const data = await request({
        url, method, body, isfiles,
      });
      if (data && data.success !== false) {
        if (model.response === 'RESPONSE_PRODUCTLIST_UPDATE') { message.success(data.message); }
      } else {
        message.warning(data.message);
      }
      if (!data) {
        throw new Error('no data provided');
      }
      return dispatch({
        type: model.response,
        payload: data,
        name,
      });
    }
  } catch (error) {
    dispatch({
      type: model.error,
      message: error.message,
      name,
    });
  }
};

export { request, asyncFn };
