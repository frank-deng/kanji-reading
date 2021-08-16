# kanji-reading

一个用于搜索日文汉字音读和训读的工具。  
A tool for searching on-readings and kun-readings for Kanji characters.

[单击此处](https://frank-deng.github.io/kanji-reading/)可访问日文汉字读音查询页面。  
[Click Here](https://frank-deng.github.io/kanji-reading/) to open the page for searching Kanji readings.

也可以直接在本地文件系统中直接打开`kanji-reading.html`来使用本工具（有的浏览器需要点击页面下方的“允许阻止的内容”以正常使用）。  
This tool can alse be opened locally by opening `kanji-reading.html` from file system directly (Some browsers may need to click "Allow blocked content" at the bottom of the page before using this tool).

通过将所有日文假名编码成对应的ASCII字符的方式，以及将Unicode数值使用base62编码的方式，实现了压缩日文汉字读音数据的功能，减少了需要传输的数据量，节省了带宽。  
Kanji reading data is compressed by encoding all the Japanese Kanas into corresponding ASCII characters, as well as encoding Unicode value into base62; So as to reduce the amount of data transfer and save bandwidth.

Data was generated from [http://www.unicode.org/Public/UNIDATA/Unihan.zip](http://www.unicode.org/Public/UNIDATA/Unihan.zip)
