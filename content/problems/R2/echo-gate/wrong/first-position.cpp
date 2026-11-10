class Solution {
public:
    bool hasEcho(vector<int> pings, int k) {
        unordered_map<int, int> firstSeen;
        for (int j = 0; j < static_cast<int>(pings.size()); ++j) {
            const auto it = firstSeen.find(pings[j]);
            if (it != firstSeen.end() && j - it->second <= k) return true;
            firstSeen.emplace(pings[j], j);  // Wrong: keeps the oldest position, so a close later repeat is missed.
        }
        return false;
    }
};
