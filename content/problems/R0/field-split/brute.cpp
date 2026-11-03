class Solution {
public:
    vector<string> splitFields(string line) {
        vector<string> fields(1);
        for (const char c : line) {
            if (c == ',') fields.emplace_back();
            else fields.back().push_back(c);
        }
        return fields;
    }
};
