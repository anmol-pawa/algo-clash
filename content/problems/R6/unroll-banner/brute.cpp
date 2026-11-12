class Solution {
public:
    string unroll(string banner) {
        // Expand the first innermost group (first ']' and its '[') until none are left.
        string s = banner;
        for (;;) {
            const size_t close = s.find(']');
            if (close == string::npos) break;
            const size_t open = s.rfind('[', close);
            size_t d = open;
            while (d > 0 && isdigit(static_cast<unsigned char>(s[d - 1]))) --d;
            const int times = stoi(s.substr(d, open - d));
            const string body = s.substr(open + 1, close - open - 1);
            string expanded;
            for (int i = 0; i < times; ++i) expanded += body;
            s = s.substr(0, d) + expanded + s.substr(close + 1);
        }
        return s;
    }
};
