class Solution {
public:
    bool isBalanced(string s) {
        string open;  // unclosed openers in arrival order; top is open.back()
        for (const char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                open.push_back(c);
                continue;
            }
            if (open.empty()) return false;  // closer with nothing to close
            const char top = open.back();
            const bool matches = (c == ')' && top == '(') || (c == ']' && top == '[') || (c == '}' && top == '{');
            if (!matches) return false;
            open.pop_back();
        }
        return open.empty();  // leftover openers mean unbalanced
    }
};
