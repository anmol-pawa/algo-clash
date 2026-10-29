class Solution {
public:
    bool isBalanced(string s) {
        // Delete adjacent matching pairs until nothing changes.
        bool changed = true;
        while (changed) {
            changed = false;
            for (const string p : {"()", "[]", "{}"}) {
                const size_t pos = s.find(p);
                if (pos != string::npos) {
                    s.erase(pos, 2);
                    changed = true;
                }
            }
        }
        return s.empty();
    }
};
