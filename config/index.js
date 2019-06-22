module.exports = {
  dev: {
    'port': 8080,
    'database': {
      'uri': 'mongodb://localhost:27017/boilermakeqr',
      'reconnectInterval': 10000
    }
  },
  prod: {
    'port': 8080,
    'database': {
      'uri': 'mongodb://localhost:27017/boilermakeqr',
      'reconnectInterval': 10000
    }
  }
}
