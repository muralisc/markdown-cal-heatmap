pushd ~/src/markdown-cal-heatmap/
node ~/src/markdown-cal-heatmap/index-heatmap-from-daily-notes.js -d ~/src/obsidian-vault2/Daily\ Notes -f cardio -f mast -f kuttuMuruLove -f neck_exercise -p 9123 &
NODE_PID=$!
sleep 5
node ~/src/markdown-cal-heatmap/puppeteer-screenshot.js -f cardio-mast
kill -9 $NODE_PID
popd
