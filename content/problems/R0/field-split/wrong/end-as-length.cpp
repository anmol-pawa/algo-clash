class Solution {
public:
    vector<string> splitFields(string line) {
        // Wrong: passes the comma position as the LENGTH, so every field after the first is too long.
        vector<string> fields;
        size_t start = 0;
        while (true) {
            const size_t comma = line.find(',', start);
            if (comma == string::npos) {
                fields.push_back(line.substr(start));
                break;
            }
            fields.push_back(line.substr(start, comma));
            start = comma + 1;
        }
        return fields;
    }
};
