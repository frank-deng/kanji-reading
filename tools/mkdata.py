#!/usr/bin/env python3
# -*- coding: utf-8 -*- 

import sys, json;

def getKanjiAll(filename):
    jsrc = {};
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 ==  len(line)):
                continue;
            data = line.strip().split();
            charCode = data[0].replace('U+', '');
            if (data[1] == 'kIRG_JSource'):
                jsrc[charCode] = True;
    return jsrc;

def getReadings(filename, kanjiAll):
    result = {};
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 ==  len(line)):
                continue;
            data = line.strip().split();
            charCode = data[0].replace('U+', '');
            if not kanjiAll.get(charCode):
                continue;
            if (data[1] in ('kJapaneseKun', 'kJapaneseOn') and None == result.get(charCode)):
                result[charCode] = {};
            if (data[1] == 'kJapaneseKun'):
                result[charCode]['kun'] = data[2:];
            elif (data[1] == 'kJapaneseOn'):
                result[charCode]['on'] = data[2:];
    return result;

def getVariants(filename, kanjiAll, readings):
    tradVariants = {};
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 ==  len(line)):
                continue;
            data = line.strip().split();
            charSrc = data[0].replace('U+', '');
            charDest = data[2].replace('U+', '');
            if (data[1] == 'kTraditionalVariant' and readings.get(charDest) and not readings.get(charSrc)):
                tradVariants[charSrc] = charDest;
    return tradVariants;

if __name__ == '__main__':
    kanjiAll = getKanjiAll('./Unihan_IRGSources.txt');
    readings = getReadings('./Unihan_Readings.txt', kanjiAll);
    variants = getVariants('./Unihan_Variants.txt', kanjiAll, readings);
    sys.stdout.write(json.dumps({
        'r':readings,
        'v':variants,
    }, sort_keys=True, separators=(',', ':')));

