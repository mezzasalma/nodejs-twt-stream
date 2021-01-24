const { Writable, Readable, Transform } = require("stream")

function getTweetFromSource(broadcaster) {
    // create a new source stream for each client
    const tweetSource = new Readable({
        objectMode: true,
        read() { }
    })

    // data event callback
    function pushToSource(chunk) {
        tweetSource.push(chunk)
    }

    // listen to new data from main pipeline and push it to client stream
    broadcaster.on("data", pushToSource)

    // remove event listener if error, emitted from client pipeline
    tweetSource.on("error", () => {
        broadcaster.off("data", pushToSource)
    })

    return tweetSource
}

const jsonParser = new Transform({
    readableObjectMode: true, // objet en lecture pour les autres
    transform(chunk, _, callback) {
        let data = {}
        try {
            data = JSON.parse(chunk)
            this.push(data)
        } catch (error) {
            // console.error(error)
        }
        callback()
    }
})

const textExtractor = new Transform({
    writableObjectMode: true,

    transform(chunk, _, callback) {
        const text = chunk?.data?.text + ""
        this.push(text)
        callback()
    }
})

const imageUrlExtractor = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, _, callback) {
        try {
            chunk?.includes.media?.map( media => {
                this.push(media.url + "")
            })
        } catch (error) {
            //
        }
        // this.push(JSON.stringify(chunk))
        callback()
    }
})

const tweetCounter = new Transform({
    objectMode: true,
    transform(chunk, _, callback) {
        this.counter++
        let tag = chunk.matching_rules[0].tag
        if (!this.tagsArray.hasOwnProperty(tag)) {
            this.tagsArray[tag] = 1
        }
        if (this.tagsArray.hasOwnProperty(tag)) {
            this.tagsArray[tag]++
        }
        // this.push(this.counter.toString())
        console.log(this.tagsArray, "Total des tweets récupérés contenant des images " + this.counter)
        this.push(chunk)
        callback()
    }

})
tweetCounter.counter = 0
tweetCounter.tagsArray = []

const logger = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (err) {
            //
        }
        callback()
    }
})

module.exports = {
    getTweetFromSource,
    jsonParser,
    tweetCounter,
    textExtractor,
    imageUrlExtractor,
}