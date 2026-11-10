class Solution {
public:
    vector<int> tidePair(vector<int>& readings, int target) {
        unordered_map<int, int> firstSeen;  // value -> earliest index holding it
        for (int j = 0; j < static_cast<int>(readings.size()); ++j) {
            const auto it = firstSeen.find(target - readings[j]);  // look BEFORE inserting j
            if (it != firstSeen.end()) return {it->second, j};
            firstSeen.emplace(readings[j], j);  // emplace keeps the earliest index
        }
        return {-1, -1};
    }
};
