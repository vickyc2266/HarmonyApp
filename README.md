![The Harmony Project logo](https://raw.githubusercontent.com/harmonydata/brand/main/Logo/PNG/%D0%BB%D0%BE%D0%B3%D0%BE%20%D1%84%D1%83%D0%BB-05.png)

<a href="https://harmonydata.ac.uk"><span align="left">🌐 harmonydata.ac.uk</span></a>
<a href="https://www.linkedin.com/company/harmonydata"><img align="left" src="https://raw.githubusercontent.com//harmonydata/.github/main/profile/linkedin.svg" alt="Harmony | LinkedIn" width="21px"/></a>
<a href="https://twitter.com/harmony_data"><img align="left" src="https://raw.githubusercontent.com//harmonydata/.github/main/profile/x.svg" alt="Harmony | X" width="21px"/></a>
<a href="https://www.instagram.com/harmonydata/"><img align="left" src="https://raw.githubusercontent.com//harmonydata/.github/main/profile/instagram.svg" alt="Harmony | Instagram" width="21px"/></a>
<a href="https://www.facebook.com/people/Harmony-Project/100086772661697/"><img align="left" src="https://raw.githubusercontent.com//harmonydata/.github/main/profile/fb.svg" alt="Harmony | Facebook" width="21px"/></a>
<a href="https://www.youtube.com/channel/UCraLlfBr0jXwap41oQ763OQ"><img align="left" src="https://raw.githubusercontent.com//harmonydata/.github/main/profile/yt.svg" alt="Harmony | YouTube" width="21px"/></a>

# Harmony Front End 

<!-- badges: start -->
![my badge](https://badgen.net/badge/Status/In%20Development/orange)
[![License](https://img.shields.io/github/license/harmonydata/harmony)](https://github.com/harmonydata/harmony/blob/main/LICENSE)
[![forks](https://img.shields.io/github/forks/harmonydata/app)](https://github.com/harmonydata/app/forks)

<!-- badges: end -->

This is the app in React which is running at https://harmonydata.ac.uk/app. It is not the blog which is at the base of the https://harmonydata.ac.uk domain at all paths other than /app.

* 🪧 The source code of the Harmony static blog at https://harmonydata.ac.uk is in this repo: https://github.com/harmonydata/harmonydata.github.io. It is hosted with Github Pages.
* 🪧 The Harmony Python library source code is here: https://github.com/harmonydata/harmony.
* 🪧 The Harmony R library source code is here: https://github.com/harmonydata/harmony_r.
* 🪧 The Harmony API source code is here: https://github.com/harmonydata/harmonyapi.

## How to run Harmony's Node.js front end.

First you need the [API server](https://github.com/harmonydata/harmonyapi) running. Download, install and start the Harmony API. The Node.js front end will connect to the API server.

Follow the steps to install [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Then `cd` into this cloned folder (`cd app`) and run:

```
npm install
npm start
```

You can access Harmony in your browser at `http://localhost:3000/app#/`.

![screenshot](https://harmonydata.ac.uk/images/localhost-min.png)

## How to run this front end and connect to localhost API

Run the [Harmony API](https://github.com/harmonydata/harmonyapi) app in Python.

Open `.env` and change `REACT_APP_API_URL` to `http://localhost:8000` and change `REACT_APP_ABSOLUTE_URL_PREFIX` to `http://localhost:8000/app` (so that the front end knows that it's running on localhost and that it should connect to a localhost API)

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ABSOLUTE_URL_PREFIX=http://localhost:8000/app
```

Then run `npm install; npm start` as usual.

## Who to contact?

You can contact Harmony team at https://harmonydata.ac.uk/, Thomas Wood at http://fastdatascience.com/ or John Rogers at http://delosis.com

# How to contribute

You can raise an issue in the [issue tracker](https://github.com/harmonydata/harmony/issues), and you can open a [pull request](https://github.com/harmonydata/harmony/pulls).

Please contact us at  https://harmonydata.ac.uk/contact or write to thomas@fastdatascience.com if you would like to be involved in the project.
