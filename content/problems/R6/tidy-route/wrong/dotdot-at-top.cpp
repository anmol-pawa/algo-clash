class Solution {
public:
    string tidyRoute(string route) {
        vector<string> names;
        string name;
        route.push_back('/');
        for (const char ch : route) {
            if (ch != '/') {
                name += ch;
                continue;
            }
            if (name == ".." && !names.empty()) {
                names.pop_back();
            } else if (!name.empty() && name != ".") {
                names.push_back(name);  // bug: ".." at the top level is kept as a name
            }
            name.clear();
        }
        string tidy;
        for (const auto& n : names) tidy += "/" + n;
        return tidy.empty() ? "/" : tidy;
    }
};
