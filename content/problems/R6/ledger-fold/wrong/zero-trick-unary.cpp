class Solution {
public:
    int foldLedger(string ledger) {
        // Classic trick: a '-' at the start or right after '(' is rewritten as "0 -".
        // It misses a sign that follows an operator, so "2 * -3" becomes "2 * 0 - 3".
        vector<long long> values;
        vector<char> ops;
        auto strength = [](char op) { return (op == '*' || op == '/') ? 2 : (op == '+' || op == '-') ? 1 : 0; };
        auto apply = [&]() {
            const char op = ops.back();
            ops.pop_back();
            const long long b = values.back();
            values.pop_back();
            const long long a = values.back();
            values.pop_back();
            values.push_back(op == '+' ? a + b : op == '-' ? a - b : op == '*' ? a * b : a / b);
        };
        string t;
        for (size_t i = 0; i < ledger.size(); ++i) {
            t += ledger[i];
        }
        const int n = static_cast<int>(t.size());
        char prev = '(';  // last non-space character seen
        for (int i = 0; i < n; ++i) {
            const char c = t[i];
            if (c == ' ') continue;
            if (isdigit(static_cast<unsigned char>(c))) {
                long long num = 0;
                while (i < n && isdigit(static_cast<unsigned char>(t[i]))) num = num * 10 + (t[i++] - '0');
                --i;
                values.push_back(num);
                prev = '0';
                continue;
            }
            if (c == '(') {
                ops.push_back(c);
            } else if (c == ')') {
                while (ops.back() != '(') apply();
                ops.pop_back();
            } else {
                if (c == '-' && prev == '(') values.push_back(0);
                while (!ops.empty() && strength(ops.back()) >= strength(c)) apply();
                ops.push_back(c);
            }
            prev = c;
        }
        while (!ops.empty()) apply();
        return static_cast<int>(values.back());
    }
};
