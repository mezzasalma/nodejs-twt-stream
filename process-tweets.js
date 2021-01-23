const { Writable, Transform } = require("stream")

const jsonParser = new Transform({
    readableObjectMode: true, // objet en lecture pour les autres

    transform(chunk, _, callback) {
        let data = {}
        try {
            data = JSON.parse(chunk)
            this.push(data)
        } catch (error) {
            //
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
    transform(chunk, _, callback) {
        this.counter++

        this.push(this.counter.toString())

        callback()
    }
})
tweetCounter.counter = 0

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
    jsonParser,
    textExtractor,
    imageUrlExtractor
}