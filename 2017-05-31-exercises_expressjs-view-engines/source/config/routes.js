const homeController = require('../controllers/home');
const concertController = require('../controllers/concert');
const songController = require('../controllers/song');

const multer = require('multer');

let upload = multer({ dest: `./public/images/content` });

module.exports = app => {
    app.get('/', homeController.homeGet);
    app.post('/', homeController.homePost);

    app.get('/concert/add', concertController.addGet);
    app.post('/concert/add', upload.single('cover'), concertController.addPost);

    app.get('/concert/:id/details', concertController.detailsGet);
    app.post('/concert/:id/details', songController.detailsPost);

    app.get('/song/list', songController.listGet);
};