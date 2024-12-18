import {
    stream
} from 'unified-stream'
import {
    unified
} from 'unified'
import remarkParse from 'remark-parse'
import fs from 'fs'
import minimist from 'minimist';
import express from 'express'

// Use minimist to parse the arguments
var argv = minimist(process.argv.slice(2));
// Get all arguments as a list
var directoryPath = argv['d'];
var field_name = argv['f']
const re = new RegExp(field_name + ":: (.*)", "i");


var alldata = []
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    let date_values = files.map(function (filename) {
        // Do whatever you want to do with the file
        // console.log(`Processing file ${filename}`)
        var text = fs.readFileSync(directoryPath+'/'+filename).toString('utf-8');
        const found = text.match(re);
        if ( Number(found[1]) != 0 ) {
            let retval = {
                "date": filename.match(/\d\d\d\d-\d\d-\d\d/)[0],
                "value": Number(found[1])
            }
            // console.log(retval)
            return retval;
        }
    }).filter(function(el) {
        return el != null;
    });

    alldata = [{
        "filename": field_name,
        "data": date_values
    }]
    // console.log(alldata)
});

// Finally start the app !!
const app = express()
const port = 3000
app.get('/all_files', (req, res) => {
    res.send(alldata)
})

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/static/cal-heatmap-express.html')
})

app.listen(port, () => {
    console.log(
        `Example app listening on port http://localhost:${port}`)
})
