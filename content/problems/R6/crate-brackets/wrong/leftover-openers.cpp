class Solution {
public:
    bool isBalanced(string s) {
        string open;
        for (const char c : s) {
            if (c == '(' || c == '[' || c == '{') { open.push_back(c); continue; }
            if (open.empty()) return false;
            const char top = open.back();
            if (!((c == ')' && top == '(') || (c == ']' && top == '[') || (c == '}' && top == '{'))) return false;
            open.pop_back();
        }
        return true;  // Wrong: forgets that unclosed openers remain.
    }
};
