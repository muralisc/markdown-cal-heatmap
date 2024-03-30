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
var text = fs.readFileSync(filenames[0]).toString('utf-8');

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
    let listOfDates = ast_of_lists[firstListIndex].children.map((item) => {
        return DateTime.fromFormat(item.children[0].children[0].value,
            'y-LL-dd ccc' /* https://moment.github.io/luxon/#/formatting */
        );
    });


    let listOfDateString = listOfDates.map((item) => {
        return {
            date: item.toFormat('y-LL-dd'),
            value: 1
        };
    });
    return listOfDateString;
}

const abstract_syntax_tree = unified()
    .use(remarkParse)
    .parse(text)

let alldata = filenames.map((filename) => {
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
console.log(alldata)


// Finally start the app !!
const app = express()
const port = 3000
app.get('/dates', (req, res) => {
    res.send(getListOfTextAtRoot(abstract_syntax_tree))
})

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
