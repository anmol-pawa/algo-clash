class Solution {
    string s;
    size_t pos = 0;

    void skip() { while (pos < s.size() && s[pos] == ' ') ++pos; }

    // value := number | '(' expr ')'
    long long value() {
        skip();
        if (s[pos] == '(') {
            ++pos;
            const long long inner = expr();
            skip();
            ++pos;  // ')'
            return inner;
        }
        long long v = 0;
        while (pos < s.size() && isdigit(static_cast<unsigned char>(s[pos]))) v = v * 10 + (s[pos++] - '0');
        return v;
    }

    // expr := ['-'] value (('+' | '-') value)*
    long long expr() {
        skip();
        bool negate = false;
        if (pos < s.size() && s[pos] == '-') { negate = true; ++pos; }
        long long result = value();
        if (negate) result = -result;
        for (;;) {
            skip();
            if (pos >= s.size() || s[pos] == ')') return result;
            const char op = s[pos++];
            const long long rhs = value();
            result = op == '+' ? result + rhs : result - rhs;
        }
    }

public:
    long long ledgerTotal(string slip) {
        s = slip;
        pos = 0;
        return expr();
    }
};
