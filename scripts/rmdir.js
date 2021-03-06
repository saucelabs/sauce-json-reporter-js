const fs = require("fs")

let args = process.argv.slice(2)

args.forEach(function (arg) {
    if (fs.existsSync(arg)) {
        fs.rmdirSync(arg, {recursive: true});
    }
});
