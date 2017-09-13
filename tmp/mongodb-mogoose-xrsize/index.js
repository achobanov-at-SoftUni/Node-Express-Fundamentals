const database = require('./config/database.config')
const config = require('./config/config')
const instanodeDb = require('./instanode-db')

let localEnv = 'development'

let environment = process.env.NODE_ENV || localEnv

database(config[environment], config.port)
  .then(() => {
    // instanodeDb.saveImage({
    //   url: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
    //   description: 'such cat much wow',
    //   tags: ['cat', 'kitty', 'cute', 'catstagram']
    // })

    // instanodeDb.findByTag('cat')

    instanodeDb.filter().then((images) => {
      images.forEach(i => console.log(i))
    })
  })
