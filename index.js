require("dotenv").config()
const { pipeline, Writable } = require("stream")

const WebSocket = require("ws")
const server = require("./server")

const {connectToTwitter, tweetStream} = require("./twitter")
const {jsonParser, textExtractor, imageUrlExtractor} = require("./process-tweets")
const {getSearchRules, deleteSearchRules, addSearchRules} = require('./search-rules')

// server websocket https
server.listen(3000)
// récupère les mêmes paramètres pour se brancher sur le même port --> 1 seul connection au serveur
const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
    console.log("new connection: ")

    client.on("message", (message) => {
        console.log("message from client: ", message)
        resetRules(message)

        client.send(message)
    })

    client.on("end", () => {
        socketStream.end()
    })

    // traite les tweets (via transform) côté server
    // puis envoie les données au CLIENT via websocket
    const socketStream = WebSocket.createWebSocketStream(client);
    pipeline(
        tweetStream,
        jsonParser,
        // textExtractor,
        imageUrlExtractor,
        socketStream,
        (err) => {
            if (err) {
                console.error("pipeline error: ", err)
            } else {
                //
            }
        }
    )
})

// connexion API Twitter
connectToTwitter()

// reset rules : get / delete / add
async function resetRules(keyword = "ghibli") {
    // get rules
    const existingRules = await getSearchRules()
    const ids = existingRules?.data?.map( rule => rule.id )

    // delete rules
    if (ids) {
        await deleteSearchRules(ids)
    }

    // add rules
    await addSearchRules([
        {value: `${keyword} has:images`, tag: `${keyword}`},
    ])
}