const Concert = require('../models/Concert');

module.exports =  {
    homeGet: (req, res) => {
        Concert.find().sort({dateCreated: -1}).populate('setList').then(concerts => {
            let data = { concerts };
            if (req.query.success) {
                data.success = req.query.success;
            }
            if (req.query.error) {
                data.error = req.query.error;
            }

            res.render('home/index', data);
        });
    },
    homePost: (req, res) => {
        let filter = req.body.filter;
        Concert
            .find(
                { $text: { $search: filter } },
                { score: { $meta: 'textScore' } }
            )
            .sort({ score: { $meta: 'textScore' }, })
            .populate('setList')
            .then(concerts => {
                res.render('home/index', { concerts })
            });
    }
};