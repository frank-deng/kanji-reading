#!/usr/bin/env python3
# -*- coding: utf-8 -*- 

import sys, json;

result = {};
for line in sys.stdin:
    if (0 == line.find('#')):
        continue;
    data = line.strip().split();
    try:
        charCode = data[0].replace('U+', '');
        if (data[1] in ('kJapaneseKun', 'kJapaneseOn') and None == result.get(charCode)):
            result[charCode] = {};
        if (data[1] == 'kJapaneseKun'):
            result[charCode]['kun'] = data[2:];
        elif (data[1] == 'kJapaneseOn'):
            result[charCode]['on'] = data[2:];
    except Exception as e:
        pass;

sys.stdout.write(json.dumps(result));

