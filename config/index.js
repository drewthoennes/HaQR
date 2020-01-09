module.exports = (env) => {
  // Determine configuration
  if (env === 'production' || !process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    // Production config
    return {
      'port': process.env.PORT,
      'host': process.env.ROOT_URL,
      'name': process.env.APPLICATION_NAME,
      'database': {
        'uri': process.env.MONGODB_URI,
        'reconnectInterval': 10000
      }
    }
  }

  // Development config
  return {
    'port': 8080,
    'host': 'http://localhost:8080',
    'name': process.env.APPLICATION_NAME,
    'database': {
      'uri': 'mongodb://localhost:27017/haqr',
      'reconnectInterval': 10000
    }
  }
}
