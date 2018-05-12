const http = require('http')
const url = require('url')
const { StringDecoder } = require('string_decoder')
const server = http.createServer((req, res) => {
  const parseUrl = url.parse(req.url, true)
  const path = parseUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()
  var headers = req.headers

  const qString = parseUrl.query

  // Get the payload,if any

  const decoder = new StringDecoder('utf-8')
  let buffer = ''

  req.on('data', function (data) {
    buffer += decoder.write(data)
  })

  // this gets called even if therees n data

  req.on('end', function () {
    buffer += decoder.end()
  

    // choose handler which req should go to, if 404 use notfound


    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
     router[trimmedPath] : handlers.notFound;


    // construct data object for handler

    var data = {
      path: trimmedPath,
      qObject: qString,
      method: method,
      headers: headers,
      payload: buffer
    }

    // use rerqHandler for routing which contains route
    chosenHandler(data,(statusCode,payload)=>{
      // default status code

      statusCode = typeof statusCode === 'number' ? statusCode : 200

      // defualt payload
      payload = typeof payload === 'object' ? payload : {}

      // convert payload to string

      var payloadString = JSON.stringify(payload);
      //return response

      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('returniong this response',statusCode, payloadString )
    })
    
  })
})

var handlers = {}

handlers.advisors = (data, callback) => {
  // callback http status code , and a payload object

  callback(406, { 'handler name': 'advisor handler' })
}

handlers.notFound = (data, callback) => {
  callback(404);
}
var router = {
  advisors: handlers.advisors
}

server.listen(6269, () => {
  console.log(`Server listening on port 6269`)
})
