class Solution {
public:
    vector<string> splitFields(string line) {
        // Wrong: getline never yields a final empty field, so "x," gives ["x"] and "" gives [].
        vector<string> fields;
        stringstream ss(line);
        string part;
        while (getline(ss, part, ',')) fields.push_back(part);
        return fields;
    }
};
