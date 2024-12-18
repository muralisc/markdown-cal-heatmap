# Markdown Cal Heatmap

Create cal-heatmap from markdown logs.

Convert a markdown like:

<img src="example-markdown.jpeg" alt="example-markdown" width="400"/>

To heatmap:

<img src="example-heatmap.jpeg" alt="example-markdown" width="600"/>

```
npm init -y
npm install unified unified-stream remark-parse remark-rehype rehype-stringify


node index.js example.md

```

```
node index-daily.js -d ~/src/obsidian-vault2/Daily\ Notes -f cardio
```
