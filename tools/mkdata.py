#!/usr/bin/env python3
# -*- coding: utf-8 -*- 

import sys, json;

def getReadings(filename, filejsrc):
    jsrc = {};
    with open(filejsrc, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 ==  len(line)):
                continue;
            data = line.strip().split();
            charCode = data[0].replace('U+', '');
            if (data[1] == 'kIRG_JSource'):
                jsrc[charCode] = True;
        
    result = {};
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 ==  len(line)):
                continue;
            data = line.strip().split();
            charCode = data[0].replace('U+', '');
            if not jsrc.get(charCode):
                continue;
            if (data[1] in ('kJapaneseKun', 'kJapaneseOn') and None == result.get(charCode)):
                result[charCode] = {};
            if (data[1] == 'kJapaneseKun'):
                result[charCode]['kun'] = data[2:];
            elif (data[1] == 'kJapaneseOn'):
                result[charCode]['on'] = data[2:];
    return result;

def getVariants(filename):
    tradVariants = {};
    zVariants = {};
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip();
            if (0 == line.find('#') or 0 ==  len(line)):
                continue;
            data = line.strip().split();
            charSrc = data[0].replace('U+', '');
            charDest = data[2].replace('U+', '');
            if (data[1] == 'kTraditionalVariant'):
                tradVariants[charSrc] = charDest;
            elif (data[1] == 'kZVariant'):
                zVariants[charSrc] = charDest;

    for charSrc in tradVariants:
        charDest = tradVariants[charSrc];
        if (zVariants.get(charDest)):
            tradVariants[charSrc] = zVariants[charDest];
    return tradVariants, zVariants;

if __name__ == '__main__':
    readings = getReadings('./Unihan_Readings.txt', 'Unihan_IRGSources.txt');
    variants, zvariants = getVariants('./Unihan_Variants.txt');
    variants2 = {};
    for char in variants:
        if (not readings.get(char)):
            variants2[char] = variants[char];
    sys.stdout.write(json.dumps({
        'r':readings,
        'v':variants2,
    }, sort_keys=True, separators=(',', ':')));

