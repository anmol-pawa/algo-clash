class Solution {
public:
    string tidyRoute(string route) {
        // Tokenise, drop empties and ".", then repeatedly cancel the first ".." with the name before it.
        vector<string> t;
        string cur;
        route.push_back('/');
        for (const char ch : route) {
            if (ch == '/') {
                if (!cur.empty() && cur != ".") t.push_back(cur);
                cur.clear();
            } else {
                cur += ch;
            }
        }
        for (;;) {
            size_t i = 0;
            while (i < t.size() && t[i] != "..") ++i;
            if (i == t.size()) break;
            if (i > 0) t.erase(t.begin() + i - 1, t.begin() + i + 1);
            else t.erase(t.begin());
        }
        string out;
        for (const auto& n : t) out += "/" + n;
        return out.empty() ? "/" : out;
    }
};
