const controllers = require('../controllers');
const auth = require('../utils/authorization');

module.exports = (app) => {
    app.get('/', controllers.home.homeGet);

    app.get('/user/register', controllers.user.registerGet);
    app.post('/user/register', controllers.user.registerPost);

    app.get('/user/login', controllers.user.loginGet);
    app.post('/user/login', controllers.user.loginPost);

    app.post('/user/logout', controllers.user.logout);
};