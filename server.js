'use strict';

const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const PORT = 8080;
const HOST = '0.0.0.0';

const HTTP_NO_CONTENT = 204;

const app = express();
app.use(cors());

app.get('/track', (req, res) => {
    if (req.query.id) {
        const videoId = req.query.id;
        const title = req.query.title;
        try {
            const name = title ? title : (new Date()).getTime();
            const trackFile = `${name}.mp3`;
            const videoFile = `${name}_video.mp4`;
            const url = videoId.indexOf('youtube.com') !== -1 ? videoId : `https://www.youtube.com/watch?v=${videoId}`;
            ytdl(url)
                .on('error', (err) => {
                    console.log(err);
                    res.sendStatus(HTTP_NO_CONTENT);
                    return;
                })
                .pipe(fs.createWriteStream(videoFile))
                .on('finish', () => {
                    ffmpeg(videoFile)
                        .output(trackFile)
                        .on('end', function () {
                            res.download(trackFile);
                        })
                        .on('error', function (err) {
                            res.sendStatus(HTTP_NO_CONTENT);
                        })
                        .run();
                })
                .on('error', (err) => {
                    console.log(err);
                });
        }
        catch (ex) {
            res.sendStatus(HTTP_NO_CONTENT);
            return;
        }
    }
    else {
        res.sendStatus(HTTP_NO_CONTENT);
        return;
    }
});

app.get('/info', (req, res) => {
    if (req.query.id) {
        let videoId = req.query.id;
        try {
            const url = videoId.indexOf('youtube.com') !== -1 ? videoId : `https://www.youtube.com/watch?v=${videoId}`;
            ytdl.getInfo(url, {}, (err, info) => {
                const title = info.player_response.videoDetails.title;
                const videoId = info.player_response.videoDetails.videoId;
                const thumbnail = info.player_response.videoDetails.thumbnail.thumbnails[0].url;

                res.send({ videoId, title, thumbnail })
            });
        }
        catch (ex) {
            res.sendStatus(HTTP_NO_CONTENT);
            return;
        }
    }
    else {
        res.sendStatus(HTTP_NO_CONTENT);
        return;
    }
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
