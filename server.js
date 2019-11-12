'use strict';

const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(cors());

app.get('/track', (req, res) => {
    if (req.query.id) {
        ytdl.getInfo(req.query.id, (err, info) => {
            if (err) {
                throw err;
            }

            let title = info.title;
            let file = `${__dirname}/files/${title}`;

            ytdl(req.query.id).pipe(
                fs.createWriteStream(`${file}_video.mp4`)
            ).on('finish', () => {
                ffmpeg(`${file}_video.mp4`)
                    .output(`${file}.mp3`)
                    .on('end', function () {
                        res.download(`${file}.mp3`);
                    })
                    .on('error', function (err) {
                        throw err;
                    })
                    .run();
            });
        });
    }
    else {
        res.send('Please provide track id');
    }
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
