class Solution {
public:
    vector<string> cutFields(const string& line) {
        vector<string> fields;
        size_t start = 0;  // first character of the field being scanned
        for (size_t i = 0; i < line.size(); ++i) {
            if (line[i] == ',') {
                fields.push_back(line.substr(start, i - start));
                start = i + 1;
            }
        }
        fields.push_back(line.substr(start));  // the last field has no comma after it
        return fields;
    }
};
