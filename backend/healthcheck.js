const http = require('http')

const options = {
  host: '0.0.0.0',
  port: 8080,
  path: '/api/healthcheck',
  timeout: 2000,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  json: true
}

const healthCheck = http.get(options, (res) => {
  let body = ''
  res.on('data', function(chunk) {
    body += chunk
  })
  res.on('end', function() {
    body = JSON.parse(body)
    if (body.teamspeak && body.discourse && res.statusCode === 200) {
      process.exit(0)
    } else {
      process.exit(1)
    }
  })
})

healthCheck.on('error', function(err) {
  process.exit(1)
})

healthCheck.end()
