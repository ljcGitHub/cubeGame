if (process.env.NODE_ENV === 'development') {
  require('./browser/index')
} else {
  require('./wx/weapp-adapter')
  require('./wx/symbol')
}
