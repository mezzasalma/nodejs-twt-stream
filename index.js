require("dotenv").config()
const { pipeline, PassThrough } = require("stream")

const WebSocket = require("ws")
const server = require("./server")

const {connectToTwitter, tweetStream} = require("./twitter")
const {jsonParser, tweetCounter, textExtractor, imageUrlExtractor, getTweetFromSource} = require("./process-tweets")
const {getSearchRules, deleteSearchRules, addSearchRules} = require('./search-rules')

// server websocket https
server.listen(3000)
// récupère les mêmes paramètres pour se brancher sur le même port --> 1 seul connection au serveur
const wsServer = new WebSocket.Server({ server })

// create a passthrough: a transform that does nothing, just passing data through
const broadcaster = new PassThrough({
    writableObjectMode: true,
    readableObjectMode: true
})

wsServer.on("connection", (client) => {
    console.log("new connection: ")

    client.on("message", (message) => {
        console.log("message from client: ", message)
        let keywords = message.split(',')
        resetRules(keywords)

        client.send(keywords)
    })

    // client.on("end", () => {
    //     socketStream.end()
    // })

    // create a new readable stream of tweets for this client
    const tweetSource = getTweetFromSource(broadcaster)

    // traite les tweets (via transform) côté server
    // puis envoie les données au CLIENT via websocket
    const socketStream = WebSocket.createWebSocketStream(client);
    pipeline(
        tweetSource,
        jsonParser,
        imageUrlExtractor,
        // tweetCounter,
        socketStream,
        (err) => {
            if (err) {
                console.error("pipeline error: ", err)
            } else {
                //
            }
        }
    )
    socketStream.on("close", () => {
        socketStream.destroy() // destroy socketStream to terminate client pipeline
    })
})

// connexion API Twitter
connectToTwitter()

// main pipeline, ending with broadcaster passthrough stream
pipeline(
  tweetStream,
  // jsonParser,
  // add here what transform you want for ALL clients
  // remember to set objectMode when needed
  broadcaster,
  (err) => {
      console.log("main pipeline ended")
      if (err) {
          console.error("main pipeline error: ", err)
      }
      console.log(tweetStream)
  }
)

// reset rules : get / delete / add
async function resetRules(keywords = ["ghibli"]) {
    console.log(keywords)
    // get rules
    const existingRules = await getSearchRules()
    const ids = existingRules?.data?.map( rule => rule.id )

    // delete rules
    if (ids) {
        await deleteSearchRules(ids)
    }

    // add rules
    await keywords.forEach( k => {
        k = k.trim()
        console.log(k)
        addSearchRules([
            {value: `${k} has:images`, tag: `${k}`},
        ])
    })
}