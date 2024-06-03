const fs = require('fs')
const url = require('url')
const axios = require('axios')

function cat(path) {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`No such file or directory: ${path}`)
                process.exit(1)
            }

        }
        console.log(data)
    })
}

async function webCat(url) {
    try {
        const res = await axios.get(url)
        console.log(res.data)
    } catch (err) {
        if (err.code === 'ENOTFOUND') {
            console.log(`Failed to reach ${url} (404 Not Found)`)
        } else  if(err.code === 'ERR_BAD_REQUEST') {
            console.log(`Failed to reach ${url} (Bad Request)`)
        } else {
            console.log(err)
        }

    }

}
const path = process.argv[2]
if (path) {
    try {
        const userURL = new url.URL(path)
        webCat(path)
    } catch (e) {
        cat(path)
    }
} else {
    console.log('Please specify a file or a url')
}
