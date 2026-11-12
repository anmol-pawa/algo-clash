class Solution {
public:
    string unroll(string banner) {
        string out;  // the banner built so far; an open bracket remembers where its body starts
        vector<pair<size_t, int>> open;  // (start of the body in out, repeat count)
        int count = 0;
        for (const char ch : banner) {
            if (isdigit(static_cast<unsigned char>(ch))) {
                count = count * 10 + (ch - '0');
            } else if (ch == '[') {
                open.emplace_back(out.size(), count);
                count = 0;
            } else if (ch == ']') {
                const auto [start, times] = open.back();
                open.pop_back();
                if (times == 0) {
                    out.resize(start);
                } else if (times > 1) {
                    const string body = out.substr(start);  // copy first: appending a string to itself is a trap
                    for (int i = 1; i < times; ++i) out += body;  // the body is already there once
                }
            } else {
                out += ch;
            }
        }
        return out;
    }
};
