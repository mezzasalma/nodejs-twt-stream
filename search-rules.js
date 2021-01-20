const needle = require("needle")

const TWT_API_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const options = {
    headers: {
        "Content-Type" : "application/json",
        Authorization: `Bearer ${process.env.TWT_BEARER_TOKEN}`
    }
}

function setSearchRules(rules) {
    const opts = {
        ...options,
        path: TWT_API_RULES_PATH,
        method: "POST",
    }

    const data = JSON.stringify({
        add: rules
    })

    console.log("body data: ", data)

    const req = http.request(opts, (res) => {
        let data
        res.on("data", (chunk) => {
            data += chunk
        })
        res.on("end", () => {
            console.log("twt api response: ", data)
        })
    })

    req.write(data)
    req.end()
}

async function getSearchRules() {
    const response = await needle('get', TWT_API_URL, options)
    // console.log('getRules: ', response.body)
    return response.body
}

async function deleteSearchRules(ids) {
    const data = {
        delete: { ids }
    }
    const response = await needle('post', TWT_API_URL, data, options)
    // console.log('delete rules: ', response.body)
}

async function addSearchRules(rules) {
    const data = {
        add: rules
    }
    const response = await needle('post', TWT_API_URL, data, options)
    // console.log('addRules: ', response.body)
}

module.exports = {
    getSearchRules,
    deleteSearchRules,
    addSearchRules
}