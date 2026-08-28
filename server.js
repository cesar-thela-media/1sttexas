/**
 * Production server for Railway / Docker (Node 20).
 * Stack contract: `node server.js` after multi-stage Bun 1.3.4 build.
 */
const { createServer } = require('node:http')
const { parse } = require('node:url')
const next = require('next')

const dev = process.env.NODE_ENV === 'development'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = Number(process.env.PORT || 8080)
const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      // trailingSlash: true would 308 /api/health → /api/health/; Railway/Docker
      // healthchecks (and POST /api/submit) must return the JSON body on the unsashed path.
      if (req.url === '/api/health' || req.url?.startsWith('/api/health?')) {
        req.url = req.url.replace('/api/health', '/api/health/')
      } else if (req.url === '/api/submit' || req.url?.startsWith('/api/submit?')) {
        req.url = req.url.replace('/api/submit', '/api/submit/')
      }
      handle(req, res, parse(req.url, true)).catch(err => {
        console.error('Error handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      })
    }).listen(port, hostname, () => {
      console.log(`Next server running on http://${hostname}:${port}`)
    })
  })
  .catch(err => {
    console.error('Failed to start server', err)
    process.exit(1)
  })
