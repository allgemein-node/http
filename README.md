
# @allgemein/http

[![Build Status](https://travis-ci.com/allgemein-node/http.svg?branch=master)](https://travis-ci.com/allgemein-node/http)
[![codecov](https://codecov.io/gh/allgemein-node/http/branch/master/graph/badge.svg)](https://codecov.io/gh/allgemein-node/http)
[![Dependency Status](https://david-dm.org/allgemein-node/http.svg)](https://david-dm.org/allgemein-node/http)

This is a abstract implementation for a generic http requests api, which can
be backed by different implementations. Like got, request, node-fetch or others.

The default implementation is uses got package. 

## Install

```js
npm i @allgemein/http got
```

## Usage

```js
import {HttpFactory, IHttpResponse, IHttp, IHttpStream} from "commons-http";

let httpFactory = await HttpFactory.load();
let http:IHttp = httpFactory.create();

// use as promise
let resp:IHttpResponse<any> = await http.get('http://example.com');
console.log(resp.body)

// use as stream
let stream:IHttpStream<any> = http.get('http://example.com',{stream:true});
stream.pipe(fs.createWriteStream('test.file'));

await stream.asPromise()
``` 
