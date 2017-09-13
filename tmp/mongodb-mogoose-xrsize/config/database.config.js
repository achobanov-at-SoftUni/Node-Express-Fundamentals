const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = (config, port) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.connectionString)

    let database = mongoose.connection

    database.once('open', (err) => {
      if (err) {
        console.log(err)
        return
      }

      console.log(`Connected to database @ port ${port}!`)
      resolve()
    })

    database.on('error', (err) => {
      reject(err)
    })

    require('../models/Image')
    require('../models/Tag')
  })
}
