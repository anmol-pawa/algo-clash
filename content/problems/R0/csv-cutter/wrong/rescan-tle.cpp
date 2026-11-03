class Solution {
public:
    vector<string> cutFields(const string& line) {
        // Correct but quadratic: to find field k it re-scans the line from the start, counting commas.
        const size_t commas = count(line.begin(), line.end(), ',');
        vector<string> fields;
        for (size_t k = 0; k <= commas; ++k) {
            size_t seen = 0, start = 0;
            while (seen < k) {
                if (line[start] == ',') ++seen;
                ++start;
            }
            size_t end = start;
            while (end < line.size() && line[end] != ',') ++end;
            fields.push_back(line.substr(start, end - start));
        }
        return fields;
    }
};
