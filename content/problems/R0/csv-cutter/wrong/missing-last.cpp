class Solution {
public:
    vector<string> cutFields(const string& line) {
        // Wrong: only pushes a field when it meets a comma, so the last field is lost.
        vector<string> fields;
        size_t start = 0;
        for (size_t i = 0; i < line.size(); ++i) {
            if (line[i] == ',') {
                fields.push_back(line.substr(start, i - start));
                start = i + 1;
            }
        }
        return fields;
    }
};
