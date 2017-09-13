const port = 27017
const dbName = 'dbTest'
const prodDbName = 'dbProd'

module.exports = {
  development: {
    connectionString: `mongodb://localhost:${port}/${dbName}`
  },
  production: {
    connectionString: `mongodb://localhost:${port}/${prodDbName}`
  },
  port: `${port}`
}
