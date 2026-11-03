class Solution {
public:
    vector<string> cutFields(const string& line) {
        // Wrong: getline reports no field after a trailing comma and none for an empty line.
        vector<string> fields;
        stringstream ss(line);
        string field;
        while (getline(ss, field, ',')) fields.push_back(field);
        return fields;
    }
};
