from matplotlib import pyplot as pl
from matplotlib.ticker import MultipleLocator
# import random


x = [x for x in range(1, 65)]
y = [-1.229, -1.229, -1.226, -1.223, -1.221, -1.219, -1.218, -1.216, -1.214, -1.212, -1.210, -1.123, -0.957, -0.643, -0.455, -0.25, -0.104, -0.022, 0.117, 0.181, 0.247, 0.292, 0.333, 0.364, 0.396, 0.42, 0.441, 0.459, 0.473, 0.487,
     0.499, 0.509, 0.517, 0.526, 0.531, 0.538, 0.542, 0.548, 0.553, 0.554, 0.558, 0.559, 0.561, 0.564, 0.565, 0.566, 0.569, 0.57, 0.57, 0.571, 0.571, 0.572, 0.572, 0.572, 0.573, 0.573, 0.573, 0.573, 0.573, 0.573, 0.573, 0.573, 0.573, 0.573]

# fig = pl.figure(figsize=(10, 6))

pl.plot(x, y, label='XY', color='blue', marker='.')
pl.xlim(0, 66)
pl.ylim(-1.5, 0.7)
pl.xlabel("Number")
pl.ylabel("ΔT")
ax = pl.gca()
ax.xaxis.set_major_locator(MultipleLocator(66))
ax.yaxis.set_major_locator(MultipleLocator(2.2))
pl.grid()
# fig.autofmt_xdate()
# pl.show()
pl.savefig("Picture.png")
