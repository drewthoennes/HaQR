module.exports = () => {
  // Determine configuration
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    // Production config
    return {
      'port': 8080,
      'host': 'https://boilermakeqr.herokuapp.com',
      'name': 'BoilerMakeQR',
      'database': {
        'uri': 'mongodb://localhost:27017/boilermakeqr',
        'reconnectInterval': 10000
      }
    }
  }

  // Development config
  return {
    'port': 8080,
    'host': 'http://localhost:8080',
    'name': 'BoilerMakeQR',
    'database': {
      'uri': 'mongodb://localhost:27017/boilermakeqr',
      'reconnectInterval': 10000
    }
  }
}
