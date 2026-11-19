class Solution {
public:
    vector<int> dropAll(vector<int> deck, int target) {
        // Correct but O(n * k): every removal shifts the whole tail one slot at a time.
        // The volatile stores keep the shift element-wise, so it stays slow on any machine
        // (a plain vector::erase is a memmove that a fast CPU can finish inside the limit).
        size_t i = 0;
        size_t size = deck.size();
        volatile int* p = deck.data();
        while (i < size) {
            if (p[i] == target) {
                for (size_t j = i; j + 1 < size; ++j) p[j] = p[j + 1];
                --size;
            } else {
                ++i;
            }
        }
        deck.resize(size);
        return deck;
    }
};
