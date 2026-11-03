class Solution {
public:
    vector<string> splitFields(string line) {
        // Wrong: drops empty fields entirely.
        vector<string> fields;
        string cur;
        for (const char c : line) {
            if (c == ',') {
                if (!cur.empty()) fields.push_back(cur);
                cur.clear();
            } else cur += c;
        }
        if (!cur.empty()) fields.push_back(cur);
        return fields;
    }
};
