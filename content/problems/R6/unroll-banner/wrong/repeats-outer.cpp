class Solution {
public:
    string unroll(string banner) {
        vector<pair<string, int>> saved;
        string cur;
        int count = 0;
        for (const char ch : banner) {
            if (isdigit(static_cast<unsigned char>(ch))) {
                count = count * 10 + (ch - '0');
            } else if (ch == '[') {
                saved.emplace_back(cur, count);
                cur.clear();
                count = 0;
            } else if (ch == ']') {
                auto [outer, times] = saved.back();
                saved.pop_back();
                string both = outer + cur;  // bug: repeats the saved outer text as well
                cur.clear();
                for (int i = 0; i < times; ++i) cur += both;
            } else {
                cur += ch;
            }
        }
        return cur;
    }
};
