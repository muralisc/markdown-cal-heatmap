node index-heatmap-from-daily-notes.js -d ~/src/obsidian-vault2/Daily\ Notes -f cardio -f mast -p 9123 &
sleep 5
node puppeteer-screenshot.js -f cardio-mast
