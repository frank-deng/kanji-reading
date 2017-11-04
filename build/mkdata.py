#!/usr/bin/env python3
# -*- coding: utf-8 -*- 

import sys;

def base62encode(n):
    metachar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    BASE = 62;
    result = '';
    while n > BASE:
        n, digit = divmod(n, BASE);
        result = metachar[digit] + result;
    result = metachar[n] + result;
    return result;

def kanaCompress(romaji):
    dataRomaji = {
        'A':'あ','I':'い','U':'う','E':'え','O':'お',
        'KA':'か','KI':'き','KU':'く','KE':'け','KO':'こ',
        'SA':'さ','SHI':'し','SU':'す','SE':'せ','SO':'そ',
        'TA':'た','CHI':'ち','TI':'ち','TU':'つ','TSU':'つ','TE':'て','TO':'と',
        'NA':'な','NI':'に','NU':'ぬ','NE':'ね','NO':'の',
        'HA':'は','HI':'ひ','HU':'ふ','FU':'ふ','HE':'へ','HO':'ほ',
        'MA':'ま','MI':'み','MU':'む','ME':'め','MO':'も',
        'YA':'や','YU':'ゆ','YO':'よ',
        'RA':'ら','RI':'り','RU':'る','RE':'れ','RO':'ろ',
        'WA':'わ','WO':'を',
        'GA':'が','GI':'ぎ','GU':'ぐ','GE':'げ','GO':'ご',
        'ZA':'ざ','JI':'じ','ZI':'じ','ZU':'ず','ZE':'ぜ','ZO':'ぞ',
        'DA':'だ','DI':'ぢ','DU':'づ','DE':'で','DO':'ど',
        'BA':'ば','BI':'び','BU':'ぶ','BE':'べ','BO':'ぼ',
        'PA':'ぱ','PI':'ぴ','PU':'ぷ','PE':'ぺ','PO':'ぽ',
        'KYA':'きゃ','KYU':'きゅ','KYO':'きょ',
        'GYA':'ぎゃ','GYU':'ぎゅ','GYO':'ぎょ',
        'SHA':'しゃ','SHU':'しゅ','SHO':'しょ',
        'SYA':'しゃ','SYU':'しゅ','SYO':'しょ',
        'SHYA':'しゃ','SHYU':'しゅ','SHYO':'しょ',
        'JA':'じゃ','JU':'じゅ','JO':'じょ',
        'JYA':'じゃ','JYU':'じゅ','JYO':'じょ',
        'CHA':'ちゃ','CHU':'ちゅ','CHO':'ちょ',
        'CHYA':'ちゃ','CHYU':'ちゅ','CHYO':'ちょ',
        'DYA':'ぢゃ','DYU':'ぢゅ','DYO':'ぢょ',
        'NYA':'にゃ','NYU':'にゅ','NYO':'にょ',
        'HYA':'ひゃ','HYU':'ひゅ','HYO':'ひょ',
        'BYA':'びゃ','BYU':'びゅ','BYO':'びょ',
        'PYA':'ぴゃ','PYU':'ぴゅ','PYO':'ぴょ',
        'MYA':'みゃ','MYU':'みゅ','MYO':'みょ',
        'RYA':'りゃ','RYU':'りゅ','RYO':'りょ',
        'FA':'ふぁ','FI':'ふぃ','FE':'ふぇ','FO':'ふぉ',
        'N':'ん',
    };
    dataCompress = {
        'あ':'0','い':'1','う':'2','え':'3','お':'4',
        'ぁ':'5','ぃ':'6','ぅ':'7','ぇ':'8','ぉ':'9',
        'か':'A','き':'B','く':'C','け':'D','こ':'E',
        'さ':'F','し':'G','す':'H','せ':'I','そ':'J',
        'た':'K','ち':'L','つ':'M','て':'N','と':'O',
        'な':'P','に':'Q','ぬ':'R','ね':'S','の':'T',
        'は':'U','ひ':'V','ふ':'W','へ':'X','ほ':'Y',
        'ま':'Z','み':'a','む':'b','め':'c','も':'d',
        'や':'e','ゆ':'f','よ':'g',
        'ら':'h','り':'i','る':'j','れ':'k','ろ':'l',
        'わ':'m','を':'n',
        'が':'o','ぎ':'p','ぐ':'q','げ':'r','ご':'s',
        'ざ':'t','じ':'u','ず':'v','ぜ':'w','ぞ':'x',
        'だ':'y','ぢ':'z','づ':'!','で':'#','ど':'$',
        'ば':'%','び':'&','ぶ':'(','べ':')','ぼ':'*',
        'ぱ':'+','ぴ':'.','ぷ':'-','ぺ':'/','ぽ':':',
        'ん':';','ゃ':'<','ゅ':'=','ょ':'>','っ':'?',
    }
    kanaSeq = '';
    romaji0 = romaji;
    k = [];
    while len(romaji) > 0:
        if len(romaji) >= 2 and (romaji[0] == romaji[1]) and (romaji[0] not in 'AEIOU'):
            kanaSeq += 'っ';
            romaji = romaji[1:];
        elif len(romaji) >= 4 and dataRomaji.get(romaji[:4]):
            kanaSeq += dataRomaji[romaji[:4]];
            romaji = romaji[4:];
        elif len(romaji) >= 3 and dataRomaji.get(romaji[:3]):
            kanaSeq += dataRomaji[romaji[:3]];
            romaji = romaji[3:];
        elif len(romaji) >= 2 and dataRomaji.get(romaji[:2]):
            kanaSeq += dataRomaji[romaji[:2]];
            romaji = romaji[2:];
        elif dataRomaji.get(romaji[0]):
            kanaSeq += dataRomaji[romaji[:1]];
            romaji = romaji[1:];
        else:
            kanaSeq += romaji[0];
            romaji = romaji[1:];
    try:
        return ''.join([dataCompress[c] for c in kanaSeq]);
    except KeyError as e:
        print('<', kanaSeq, romaji0, '>');
        raise e;

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
    for i in sorted(readings.keys()):
        r = readings[i];
        on, kun = '', '';
        if r.get('on'):
            on = ','.join([kanaCompress(a) for a in r['on']]);
        if r.get('kun'):
            kun = ','.join([kanaCompress(a) for a in r['kun']]);
        sys.stdout.write('%s%s\t%s\n'%(base62encode(int(i, 16)), on, kun));
    sys.stdout.write('[Variants]\n');
    for s in sorted(variants.keys()):
        d = variants[s];
        sys.stdout.write('%s%s\n'%(base62encode(int(s, 16)), base62encode(int(d, 16))));

