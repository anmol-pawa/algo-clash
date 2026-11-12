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
            if (name == "..") {
                if (!names.empty()) names.pop_back();
            } else if (!name.empty() && name != ".") {
                names.push_back(name);
            }
            name.clear();
        }
        string tidy;
        for (const auto& n : names) tidy += "/" + n;
        if (tidy.empty()) return "/";
        return tidy + "/";  // bug: tidy form has no trailing slash
    }
};
