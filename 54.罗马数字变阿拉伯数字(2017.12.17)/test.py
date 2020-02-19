import time


class Solution:
    def twoSum(self, string):
        dictionary = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000,
        }
        string_to_list = list(string)
        result = 0
        for j in string_to_list:
            result += dictionary[j]
        return result

    def test(self):
        with open('input.txt', 'r') as f:
            data = f.readlines()
        for eachline in data:
            pass


if __name__ == '__main__':
    solution = Solution()
    # print(solution.twoSum('DCXXI'))

    # while True:
    #     solution.write_time()
    #     time.sleep(60)
