import argparse

parser = argparse.ArgumentParser()

parser.add_argument('file')
# parser.add_argument('-i')
parser.add_argument('--limit', type=int, default=10)

args = parser.parse_args()

with open(args.file, 'r') as f:
    txt = f.read()
number = args.limit

print(txt)
print(number)
