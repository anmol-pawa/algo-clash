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
            const bool allDots = !name.empty() && name.find_first_not_of('.') == string::npos;
            if (allDots && name != ".") {  // bug: "..." and longer are treated like ".."
                if (!names.empty()) names.pop_back();
            } else if (!name.empty() && name != ".") {
                names.push_back(name);
            }
            name.clear();
        }
        string tidy;
        for (const auto& n : names) tidy += "/" + n;
        return tidy.empty() ? "/" : tidy;
    }
};
