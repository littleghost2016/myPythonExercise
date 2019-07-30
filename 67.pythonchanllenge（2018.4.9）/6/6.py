import os
import re
import zipfile


def get_clues():
    os.chdir('./channel')
    filelist = os.listdir()
    filelist.pop()  # filelist = filelist[:-2]
    with open('readme.txt', 'r') as f:
        last = f.readlines()[2].strip().split(' ')[-1]
    while True:
        with open(last + '.txt', 'r') as f:
            lastthing = f.read().strip()
            # Separate the setence and the 'nothing'.
            lastthings = lastthing.split(' ')[-1]
        if lastthings.isdigit():
            last = lastthings
        else:
            break
    print(lastthing)


def work_with_clues():
    # 'findnothing' is a function.
    findnothing = re.compile(r'Next nothing is (\d+)').match
    comments = []  # Store the comments
    z = zipfile.ZipFile('channel.zip', 'r')
    seed = '90052'
    while True:
        fname = seed + '.txt'
        comments.append(z.getinfo(fname).comment.decode())
        # The type of z.getinfo(xxx).comment is bytes-like, we should use decode() change it to string-like object.
        guts = z.read(fname)
        m = findnothing(guts.decode())
        # The type of z.read(xxx) is bytes-like.
        if m:
            seed = m.group(1)
        else:
            break
    print(''.join(comments)) # This is not a pickle. Pay attention to the similar situation.


if __name__ == '__main__':
    # get_clues()
    work_with_clues()

# I write 'hockey'---http://www.pythonchallenge.com/pc/def/hockey.html and get 'it's in the air. look at the letters.'
# The letters that hockey has are similar to 'oxygen' and it's exist in air.
# The key is {oxygen}---http://www.pythonchallenge.com/pc/def/oxygen.html