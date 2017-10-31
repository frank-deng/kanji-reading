#!/usr/bin/env python3
# -*- coding: utf-8 -*- 

import sys, json;

def getKanjiAll(filename):
    jsrc = {};
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 == len(line)):
                continue;
            data = line.strip().split();
            charCode = data[0].replace('U+', '');
            if len(charCode) > 4:
                continue;
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
            if not kanjiAll.get(charCode) or len(charCode) > 4:
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
            if len(charSrc) > 4 or len(charDest) > 4:
                continue;
            elif (data[1] == 'kTraditionalVariant' and readings.get(charDest) and not readings.get(charSrc)):
                tradVariants[charSrc] = charDest;
    return tradVariants;

if __name__ == '__main__':
    kanjiAll = getKanjiAll('./Unihan_IRGSources.txt');
    readings = getReadings('./Unihan_Readings.txt', kanjiAll);
    variants = getVariants('./Unihan_Variants.txt', kanjiAll, readings);
    sys.stdout.write('[Readings]\n');
    for i,r in readings.items():
        on, kun = '', '';
        if r.get('on'):
            on = ','.join(r['on']);
        if r.get('kun'):
            kun = ','.join(r['kun']);
        sys.stdout.write('%s\t%s\t%s'%(i, on, kun));
    sys.stdout.write('[Variants]\n');
    for s,d in variants.items():
        sys.stdout.write('%s%s\n'%(s, d));

