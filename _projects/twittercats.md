---
layout: project
title: "Twitter Cats"
date: 2017-10-09
thumbnail: "/assets/images/projects/twitter-cats.jpg"
shortDescription: "Realtime stream of cat photos from Twitter"
live: "http://twitter-cats.herokuapp.com"
code: "https://github.com/brettapeters/twitter-cats"
tech: ["Twitter Streaming API", "Go", "WebSockets", "HTML5 Canvas", "Heroku"]
---

This project started as a take-home interview challenge I created when we needed to hire a new developer at PeaceJam. The assignment was to use the Twitter Streaming API to track cat-related Tweets, extract photos from them, and send them to all connected clients in real-time. This is my "solution" to the assignment. The back-end relies on concurrent code to ensure the app can handle WebSocket connections from several clients simultaneously.