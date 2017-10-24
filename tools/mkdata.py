#!/usr/bin/env python3
# -*- coding: utf-8 -*- 

import sys, json;

def getReadings(filename):
    result = {};
    with open(filename, 'r') as f:
        for line in f:
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
    return result;

def getVariants(filename):
    tradVariants = {};
    zVariants = {};
    with open(filename, 'r') as f:
        for line in f:
            if (0 == line.find('#')):
                continue;
            data = line.strip().split();
            try:
                charSrc = data[0].replace('U+', '');
                charDest = data[2].replace('U+', '');
                if (data[1] == 'kTraditionalVariant'):
                    tradVariants[charSrc] = charDest;
                elif (data[1] == 'kZVariant'):
                    zVariants[charSrc] = charDest;
            except Exception as e:
                pass;
    for charSrc in tradVariants:
        charDest = tradVariants[charSrc];
        if (zVariants.get(charDest)):
            tradVariants[charSrc] = zVariants[charDest];
    return tradVariants, zVariants;

if __name__ == '__main__':
    readings = getReadings('./Unihan_Readings.txt');
    variants, zvariants = getVariants('./Unihan_Variants.txt');
    variants2 = {};
    for char in variants.copy():
        if (not readings.get(char)):
            variants2[char] = variants[char];
    sys.stdout.write(json.dumps({
        'r':readings,
        'v':variants2,
    }, sort_keys=True, separators=(',', ':')));

