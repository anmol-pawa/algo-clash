class Solution {
    string s;
    size_t p = 0;

    void skip() {
        while (p < s.size() && s[p] == ' ') ++p;
    }
    // expr := term (('+' | '-') term)*
    long long expr() {
        long long v = term();
        for (;;) {
            skip();
            if (p < s.size() && (s[p] == '+' || s[p] == '-')) {
                const char op = s[p++];
                const long long r = term();
                v = op == '+' ? v + r : v - r;
            } else {
                return v;
            }
        }
    }
    // term := factor (('*' | '/') factor)*
    long long term() {
        long long v = factor();
        for (;;) {
            skip();
            if (p < s.size() && (s[p] == '*' || s[p] == '/')) {
                const char op = s[p++];
                const long long r = factor();
                v = op == '*' ? v * r : v / r;
            } else {
                return v;
            }
        }
    }
    // factor := '-' factor | '(' expr ')' | number
    long long factor() {
        skip();
        if (s[p] == '-') {
            ++p;
            return -factor();
        }
        if (s[p] == '(') {
            ++p;
            const long long v = expr();
            skip();
            ++p;  // ')'
            return v;
        }
        long long num = 0;
        while (p < s.size() && isdigit(static_cast<unsigned char>(s[p]))) num = num * 10 + (s[p++] - '0');
        return num;
    }

public:
    int foldLedger(string ledger) {
        s = ledger;
        p = 0;
        return static_cast<int>(expr());
    }
};
