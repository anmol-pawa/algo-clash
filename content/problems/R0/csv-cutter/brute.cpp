class Solution {
public:
    vector<string> cutFields(const string& line) {
        vector<string> fields(1);
        for (const char c : line) {
            if (c == ',') fields.emplace_back();
            else fields.back() += c;
        }
        return fields;
    }
};
