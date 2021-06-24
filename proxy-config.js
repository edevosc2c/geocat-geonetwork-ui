module.exports = {
  '/geonetwork': {
    target: 'https://apps.titellus.net',
    secure: true,
    logLevel: 'debug',
    changeOrigin: true,
    cookiePathRewrite: {
      '/geonetwork': '/',
    },
  },
  '/datafeeder': {
    target: 'http://localhost:8080',
    secure: true,
    logLevel: 'debug',
    changeOrigin: true,
    cookiePathRewrite: {
      '/datafeeder': '/',
    },
  },
}
