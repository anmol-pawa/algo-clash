class Solution {
public:
    bool hasEcho(vector<int> pings, int k) {
        unordered_map<int, int> lastSeen;  // id -> most recent position
        for (int j = 0; j < static_cast<int>(pings.size()); ++j) {
            const auto it = lastSeen.find(pings[j]);
            if (it != lastSeen.end() && j - it->second <= k) return true;
            lastSeen[pings[j]] = j;  // newest copy is always the closest one
        }
        return false;
    }
};
