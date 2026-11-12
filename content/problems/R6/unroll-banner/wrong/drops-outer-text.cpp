class Solution {
public:
    string unroll(string banner) {
        vector<int> counts;
        string cur;
        int count = 0;
        for (const char ch : banner) {
            if (isdigit(static_cast<unsigned char>(ch))) {
                count = count * 10 + (ch - '0');
            } else if (ch == '[') {
                counts.push_back(count);  // bug: the text built so far is not saved
                count = 0;
                cur.clear();
            } else if (ch == ']') {
                const int times = counts.back();
                counts.pop_back();
                string rep;
                for (int i = 0; i < times; ++i) rep += cur;
                cur = rep;
            } else {
                cur += ch;
            }
        }
        return cur;
    }
};
