class Solution {
public:
    bool hasEcho(vector<int> pings, int k) {
        const int n = static_cast<int>(pings.size());
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n && j - i <= k; ++j)
                if (pings[i] == pings[j]) return true;
        return false;
    }
};
