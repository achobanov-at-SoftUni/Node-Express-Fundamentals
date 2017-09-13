const qs = require('querystring');

const Song = require('../models/Song');
const Concert = require('../models/Concert');
const utils = require('../utils/untilities');

module.exports = {
    listGet: (req, res) => {
        Song.find().then(songs => {
            res.render('song/list', { songs });
        })
    },
    detailsPost: (req, res) => {
        let songData = qs.parse(req.url.substring(req.url.indexOf('?') + 1));
        songData.ballad = Boolean(songData.ballad);

        Song.findOne({ name: songData.name, band: songData.band }).then(song => {
            if (song) {
                let status = 200;
                let data = {
                    name: song.name,
                    minutes: song.minutes,
                    seconds: song.seconds
                };
                utils.respondToAjax({ res, status, data });
                return;
            }

            Song.create(songData).then(song => {
                if (!song) {
                    let status = 502;
                    let error = 'Could not create song';
                    utils.respondToAjax({ res, status, error });
                    return;
                }

                let concertId = req.params.id;
                Concert.findById(concertId).then(concert => {
                    if (!concert) {
                        let status = 404;
                        let error = 'Concert no longer exists';
                        utils.respondToAjax({ res, status, error });
                        return;
                    }

                    concert.setList.push(song._id);
                    concert.save();

                    let status = 200;
                    let data = {
                        name: song.name,
                        minutes: song.minutes,
                        seconds: song.seconds
                    };
                    utils.respondToAjax({ res, status, data });
                });
            });
        });
    }
};