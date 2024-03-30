import {
    stream
} from 'unified-stream'
import {
    unified
} from 'unified'
import remarkParse from 'remark-parse'
import fs from 'fs'
import minimist from 'minimist';
import {
    DateTime
} from 'luxon'
import express from 'express'

var argv = minimist(process.argv.slice(2));
var filenames = argv['_'];

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getListOfTextAtRoot(ast_as_ref) {
    let ast_of_lists = ast_as_ref.children.map((item) => {
        if (item.type == "list") {
            return item;
        } else {
            return null;
        }
    }).filter(function(el) {
        return el != null;
    });;

    let firstListIndex = 0;
    let listOfDateString = ast_of_lists[firstListIndex].children.map((item) => {
        try {
            let listString = item.children[0].children[0].value;
            let date_value_pair = listString.split(' - ')
            let dateSring = date_value_pair[0]
            let valueSring = date_value_pair.length > 1 ? date_value_pair[1] : 1; // getRandomIntInclusive(1,100)
            let valueNumber = Number(valueSring);
            // console.log(dateSring, valueNumber);
            let dateObj = DateTime.fromFormat(dateSring,
                'y-LL-dd ccc' /* https://moment.github.io/luxon/#/formatting */
            );
            return {
                date: dateObj.toFormat('y-LL-dd'), 
                value: valueNumber
            };
        } catch(e) {
            console.log("At least two members are required for the list to be noted as list in AST")
            throw e
        }
    });

    return listOfDateString;
}

let alldata = filenames.map((filename) => {
    console.log(`Processing file ${filename}`)
    var text = fs.readFileSync(filename).toString('utf-8');
    const abstract_syntax_tree = unified()
        .use(remarkParse)
        .parse(text);
    let retval = {
        "filename": filename,
        "data": getListOfTextAtRoot(abstract_syntax_tree)
    }
    return retval;
});
// console.log(alldata)


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
