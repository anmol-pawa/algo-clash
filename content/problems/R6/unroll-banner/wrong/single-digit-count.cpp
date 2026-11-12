class Solution {
public:
    string unroll(string banner) {
        vector<pair<string, int>> saved;
        string cur;
        int count = 0;
        for (const char ch : banner) {
            if (isdigit(static_cast<unsigned char>(ch))) {
                count = ch - '0';  // bug: "12[z]" is read as 2
            } else if (ch == '[') {
                saved.emplace_back(cur, count);
                cur.clear();
                count = 0;
            } else if (ch == ']') {
                auto [outer, times] = saved.back();
                saved.pop_back();
                for (int i = 0; i < times; ++i) outer += cur;
                cur = outer;
            } else {
                cur += ch;
            }
        }
        return cur;
    }
};
