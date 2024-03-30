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

const app = express()
const port = 3000


var argv = minimist(process.argv.slice(2));
var text = fs.readFileSync(argv['_'][0]).toString('utf-8');

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
            'y-LL-dd ccc');
    });

    console.log(listOfDates)

}

const abstract_syntax_tree = unified()
    .use(remarkParse)
    .parse(text)

getListOfTextAtRoot(abstract_syntax_tree)
// console.log(JSON.stringify(abstract_syntax_tree))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
