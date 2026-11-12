class Solution {
public:
    string tidyRoute(string route) {
        vector<string> names;  // the names currently "open", from the top level down
        string name;
        route.push_back('/');  // sentinel so the last name is flushed like any other
        for (const char ch : route) {
            if (ch != '/') {
                name += ch;
                continue;
            }
            if (name == "..") {
                if (!names.empty()) names.pop_back();  // at the top level, ".." does nothing
            } else if (!name.empty() && name != ".") {
                names.push_back(name);
            }
            name.clear();
        }
        string tidy;
        for (const auto& n : names) {
            tidy += '/';
            tidy += n;
        }
        return tidy.empty() ? "/" : tidy;
    }
};
