class Solution {
public:
    bool isBalanced(string s) {
        // Correct but quadratic: erase one "()" etc. pair at a time, rescanning from the start.
        for (;;) {
            bool found = false;
            for (size_t i = 0; i + 1 < s.size(); ++i) {
                const char a = s[i], b = s[i + 1];
                if ((a == '(' && b == ')') || (a == '[' && b == ']') || (a == '{' && b == '}')) {
                    s.erase(i, 2);
                    found = true;
                    break;
                }
            }
            if (!found) return s.empty();
        }
    }
};
