class Solution {
public:
    vector<string> splitFields(string line) {
        vector<string> fields;
        size_t start = 0;
        while (true) {
            const size_t comma = line.find(',', start);
            if (comma == string::npos) {
                fields.push_back(line.substr(start));  // the last field runs to the end, possibly empty
                break;
            }
            fields.push_back(line.substr(start, comma - start));  // substr takes (pos, LENGTH)
            start = comma + 1;
        }
        return fields;
    }
};
