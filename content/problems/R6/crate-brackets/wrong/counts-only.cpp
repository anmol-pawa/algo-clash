class Solution {
public:
    bool isBalanced(string s) {
        // Wrong: counts each kind but ignores nesting order.
        int a = 0, b = 0, c = 0;
        for (const char ch : s) {
            if (ch == '(') ++a; else if (ch == ')') --a;
            else if (ch == '[') ++b; else if (ch == ']') --b;
            else if (ch == '{') ++c; else --c;
            if (a < 0 || b < 0 || c < 0) return false;
        }
        return a == 0 && b == 0 && c == 0;
    }
};
