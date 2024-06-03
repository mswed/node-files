const fs = require('fs')
const url = require('url')
const axios = require('axios')

async function cat(path) {
    try {
        return await fs.promises.readFile(path, 'utf-8')
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`No such file or directory: ${path}`)
            process.exit(1)
        }
    }
}

async function webCat(url) {
    try {
        const res = await axios.get(url)
        return res.data;
    } catch (err) {
        if (err.code === 'ENOTFOUND') {
            console.log(`Failed to reach ${url} (404 Not Found)`)
        } else if (err.code === 'ERR_BAD_REQUEST') {
            console.log(`Failed to reach ${url} (Bad Request)`)
        } else {
            console.log(err)
        }

    }

}

async function writeFile(path, data) {
    try {
        return await fs.promises.writeFile(path, data)

    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`No such file or directory ${path}`)
        } else {
            console.log(err)

        }

    }
}

function parseArgs() {
    const targets = [];
    let position = 0;
    const args = process.argv.slice(2)
    const argsLength = args.length;

    while (argsLength > position) {
        const currentArg = args[position]
        let target = null;
        if (currentArg === '--out') {
            // We got an output flag the next two args must be an output path and an input path

            if (args[position + 2] in [undefined, '--out'] || args[position + 2] in [undefined, '--out']) {
                console.log('Unable to process input, make sure you are providing enough arguments')
                process.exit(2)
            }
            target = {
                type: 'InOut',
                in: args[position + 2],
                out: args[position + 1]
            }
            position += 3
        } else {
            target = {type: 'in', in: currentArg}
            position++
        }
        targets.push(target)


    }
    return targets

}

async function run() {
    const targets = parseArgs();
    if (targets.length > 0) {
        for (const t of targets) {
            console.log(t)
            let data = null;
            // Read the data
            try {
                const userURL = new url.URL(t.in)
                data = await webCat(t.in)
            } catch (e) {
                data = await cat(t.in)
            }
            if (t.type === 'in') {
                console.log(data)
            } else if (t.type === 'InOut') {
                console.log('Writing file!')
                await writeFile(t.out, data)
            }
        }
    }
}


run()
