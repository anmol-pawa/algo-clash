class Solution {
public:
    string unroll(string banner) {
        // Correct but quadratic: expand one innermost group at a time, rebuilding the whole string and rescanning.
        string s = banner;
        for (;;) {
            size_t close = string::npos;
            for (size_t i = 0; i < s.size(); ++i) {
                if (s[i] == ']') { close = i; break; }
            }
            if (close == string::npos) break;
            size_t open = close;
            while (s[open] != '[') --open;
            size_t d = open;
            while (d > 0 && isdigit(static_cast<unsigned char>(s[d - 1]))) --d;
            const int times = stoi(s.substr(d, open - d));
            const string body = s.substr(open + 1, close - open - 1);
            string out = s.substr(0, d);
            for (int i = 0; i < times; ++i) out += body;
            out += s.substr(close + 1);
            s = out;
        }
        return s;
    }
};
