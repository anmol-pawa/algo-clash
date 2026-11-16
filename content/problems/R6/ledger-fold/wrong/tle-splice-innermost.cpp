class Solution {
    static long long flat(const string& s) {
        // Evaluate a bracket-free line with precedence and signs (correct, linear in the slice).
        vector<long long> nums;
        vector<char> ops;
        const int n = static_cast<int>(s.size());
        bool expectOperand = true;
        auto apply = [&]() {
            const char op = ops.back();
            ops.pop_back();
            if (op == 'n') { nums.back() = -nums.back(); return; }
            const long long b = nums.back(); nums.pop_back();
            const long long a = nums.back(); nums.pop_back();
            nums.push_back(op == '+' ? a + b : op == '-' ? a - b : op == '*' ? a * b : a / b);
        };
        auto st = [](char op) { return op == 'n' ? 3 : (op == '*' || op == '/') ? 2 : 1; };
        for (int i = 0; i < n; ++i) {
            if (s[i] == ' ') continue;
            if (isdigit(static_cast<unsigned char>(s[i]))) {
                long long v = 0;
                while (i < n && isdigit(static_cast<unsigned char>(s[i]))) v = v * 10 + (s[i++] - '0');
                --i;
                nums.push_back(v);
                expectOperand = false;
            } else if (s[i] == '-' && expectOperand) {
                ops.push_back('n');
            } else {
                while (!ops.empty() && st(ops.back()) >= st(s[i])) apply();
                ops.push_back(s[i]);
                expectOperand = true;
            }
        }
        while (!ops.empty()) apply();
        return nums.back();
    }

public:
    int foldLedger(string ledger) {
        // Correct but quadratic: find the first ')', evaluate its innermost bracket, splice the number
        // back in, and rescan from the front. Deeply nested brackets rebuild the string every time.
        string s = ledger;
        for (;;) {
            size_t close = string::npos;
            for (size_t i = 0; i < s.size(); ++i) {
                if (s[i] == ')') { close = i; break; }
            }
            if (close == string::npos) break;
            size_t open = close;
            while (s[open] != '(') --open;
            const long long v = flat(s.substr(open + 1, close - open - 1));
            // The value may be negative: wrap it in its own sign so the splice stays a valid line.
            const string piece = v < 0 ? "-" + to_string(-v) : to_string(v);
            s = s.substr(0, open) + piece + s.substr(close + 1);
        }
        return static_cast<int>(flat(s));
    }
};
