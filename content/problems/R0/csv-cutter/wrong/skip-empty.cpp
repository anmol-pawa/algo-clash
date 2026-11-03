class Solution {
public:
    vector<string> cutFields(const string& line) {
        // Wrong: drops the empty fields.
        vector<string> fields;
        string cur;
        for (const char c : line) {
            if (c == ',') {
                if (!cur.empty()) fields.push_back(cur);
                cur.clear();
            } else {
                cur += c;
            }
        }
        if (!cur.empty()) fields.push_back(cur);
        return fields;
    }
};
