class Solution {
public:
    bool hasEcho(vector<int> pings, int k) {
        unordered_map<int, int> lastSeen;
        for (int j = 0; j < static_cast<int>(pings.size()); ++j) {
            const auto it = lastSeen.find(pings[j]);
            if (it != lastSeen.end() && j - it->second < k) return true;  // Wrong: the gap k itself is allowed.
            lastSeen[pings[j]] = j;
        }
        return false;
    }
};
