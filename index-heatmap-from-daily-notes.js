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
var field_names_args = argv['f']
var field_name_list = []
if (typeof field_names_args === "string") {
    field_name_list.push(field_names_args)
} else {
    field_name_list = field_names_args
}


var alldata = []
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    /*
     * field_to_listDates
     * {
     *  field : [
     *    {
     *     date: "",
     *     value: 123
     *    }
     *  ]
     * }
     */
    var field_to_listDates = {}
    files.forEach(function(filename) {
        var text = fs.readFileSync(directoryPath+'/'+filename).toString('utf-8');
        field_name_list.forEach(function(field_name){

            if (!(field_name in field_to_listDates)){
                field_to_listDates[field_name] = []
            }

            const re = new RegExp(field_name + ":: (.*)", "i");
            const found = text.match(re);
            if (found === null || Object.keys(found).length < 2) {
                ;
                // console.log(`Found no match for ${re} for filename ${filename}`)
            } else {
                if ( Number(found[1]) != 0 ) {
                    field_to_listDates[field_name].push({
                        "date": filename.match(/\d\d\d\d-\d\d-\d\d/)[0],
                        "value": Number(found[1])
                    })
                }
            }
        });
    });

    for(var key in field_to_listDates){
        alldata.push({
        "calHeatmapSectionName": key,
        "data": field_to_listDates[key] 
        });
    }

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
