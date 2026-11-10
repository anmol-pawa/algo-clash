class Solution {
public:
    vector<int> tidePair(vector<int>& readings, int target) {
        unordered_map<int, int> firstSeen;
        for (int j = 0; j < static_cast<int>(readings.size()); ++j) {
            firstSeen.emplace(readings[j], j);  // Wrong: inserts before looking, so an hour can pair with itself.
            const auto it = firstSeen.find(target - readings[j]);
            if (it != firstSeen.end()) return {it->second, j};
        }
        return {-1, -1};
    }
};
