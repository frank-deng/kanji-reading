.PHONY:work
work: ../readings.txt ../main.min.js ../index.min.css

../readings.txt: mkdata.py
	python3 ./mkdata.py > ../readings.txt

../main.min.js: main.js
	uglifyjs --toplevel -c -m -o ../main.min.js main.js

../index.min.css: index.css
	cssmin < index.css > ../index.min.css

