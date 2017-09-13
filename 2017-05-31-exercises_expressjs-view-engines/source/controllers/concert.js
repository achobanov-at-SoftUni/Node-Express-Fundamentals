const fs = require('fs');
const shortid = require('shortid');

const Concert = require('../models/Concert');
const utils = require('../utils/untilities');

module.exports = {
    addGet: (req, res) => {
        res.render('concert/add');
    },
    addPost: (req, res) => {
        let concertData = req.body;

        Concert.findOne({ name: concertData.name, band: concertData.band  }).then(existingConcert => {
            if (existingConcert) {
                let error = 'Concert with that name and band already exists';
                res.render('concert/add', { error });
                return;
            }

            concertData.creationDate = new Date().toISOString().slice(0, 10);
            concertData.cover = `\\${req.file.path}`;

            Concert.create(concertData).then(concert => {
                res.redirect(`/concert/${concert._id}/details`);
            })
        })
    },
    detailsGet: (req, res) => {
        let concertId = req.params.id;

        Concert.findById(concertId).populate('setList').then(concert => {
           res.render('concert/details', { concert });
        });
    }
};
