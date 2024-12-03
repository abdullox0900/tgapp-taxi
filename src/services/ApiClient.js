import axios from 'axios';
import * as Sentry from '@sentry/react';

const ACCESS_TOKEN_FIELD = "accessToken";
const API_BASE = `${process.env.REACT_APP_API_HOST}`;

class ApiClient {

  actionUrl(name) {
    return `${API_BASE}/${name}`;
  }

  requestConfig() {
    const config = {
      responseType: 'json',
      headers: {}
    };
    // check auth status
    const key = window.localStorage.getItem(ACCESS_TOKEN_FIELD);
    if (key) {
      config.headers['Authorization'] = `Bearer ${key}`;
    }
    return config;
  }

  _get(url, params) {
    return new Promise((resolve, reject) => {
      try {
        let config = this.requestConfig();
        if (params) {
          params['_'] = Date.now();
          config.params = params;
        } else {
          config.params = {
            '_': Date.now()
          }
        }
        axios.get(url, config)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            Sentry.captureException(err);
            reject(err);
          });
      } catch (e) {
        Sentry.captureException(e);
        reject(e);
      }
    });
  }

  _post(url, data) {
    return new Promise(((resolve, reject) => {
      try {
        axios.post(url, data, this.requestConfig())
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            Sentry.captureException(err);
          });
      } catch (e) {
        Sentry.captureException(e);
        reject(e);
      }
    }));
  }

  _postForm(url, data) {
    return new Promise(((resolve, reject) => {
      try {
        let cfg = this.requestConfig();
        let bodyFormData = new FormData();
        for (let key in data) {
          bodyFormData.append(key, data[key]);
        }
        axios({
          method: "post",
          url: url,
          data: bodyFormData,
          headers: {...cfg.headers, "Content-Type": "multipart/form-data"},
        })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            Sentry.captureException(err);
            reject(err);
          });
      } catch (e) {
        Sentry.captureException(e);
        reject(e);
      }
    }));
  }

  isAuthenticated() {
    return window.localStorage.getItem(ACCESS_TOKEN_FIELD) !== null;
  }

  authTrusted(username, params) {
    let req = this._post(this.actionUrl('auth/trusted'), {username, ...params});

    req.then(res => {
      window.localStorage.setItem(ACCESS_TOKEN_FIELD, res.token);
    });

    return req;
  }

  getWorkflowDescription() {
    return this._get(this.actionUrl('tg-app/driver/workflows/descriptor'));
  }

  getWorkflowState() {
    return this._get(this.actionUrl('tg-app/driver/inspections'));
  }

  createWorkflowState() {
    return this._post(this.actionUrl('tg-app/driver/inspections'));
  }

  updateWorkflowState(workflowId, stepId, params) {
    return this._post(this.actionUrl(`tg-app/driver/inspections/${workflowId}/steps/${stepId}`), params);
  }

  updateWorkflowStateFile(workflowId, stepId, data) {
    return this._postForm(this.actionUrl(`tg-app/driver/inspections/${workflowId}/steps/${stepId}/upload`), data);
  }

  submitWorkflow(workflowId) {
    return this._post(this.actionUrl(`tg-app/driver/inspections/${workflowId}/submit`));
  }

  cancelWorkflow(workflowId) {
    return this._post(this.actionUrl(`tg-app/driver/inspections/${workflowId}/cancel`));
  }
}

const apiClient = new ApiClient();

export {apiClient};