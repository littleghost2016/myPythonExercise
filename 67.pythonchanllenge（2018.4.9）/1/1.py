text = "g fmnc wms bgblr rpylqjyrc gr zw fylb. rfyrq ufyr amknsrcpq ypc dmp. bmgle gr gl zw fylb gq glcddgagclr ylb rfyr'q ufw rfgq rcvr gq qm jmle. sqgle qrpgle.kyicrpylq() gq pcamkkclbcb. lmu ynnjw ml rfc spj."
o = ''
for each in text:
    if ord('a') <= ord(each) <= ord('z'):
        o += chr((ord(each) + 2 - ord('a')) % 26 + ord('a'))
    else:
        o += each
print(o)

# key is {ocr}.
