/// <reference types='node' />
import http = require('http');
import https = require('https');
import stream = require('stream');

declare module 'request-promise-lite' {
  export interface IRequestOptions {
    /**
     * Send as JSON. Use form parameter to send as form post.
     */
    body?: { [key: string]: any };

    /**
     * Basic authentication
     */
    auth?: {
      user: string;
      password: string;
    };
  }
}
