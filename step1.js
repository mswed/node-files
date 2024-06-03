const fs = require('fs')

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

const path = process.argv[2]
if (path) {
    cat(path)
} else {
    console.log('Please specify a file')
}
