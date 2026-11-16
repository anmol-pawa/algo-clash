class Solution {
public:
    int foldLedger(string ledger) {
        vector<long long> values;
        vector<char> ops;  // '+', '-', '*', '/', 'n' (negate), '(' as a wall
        bool expectOperand = true;
        const int n = static_cast<int>(ledger.size());
        for (int i = 0; i < n; ++i) {
            const char c = ledger[i];
            if (c == ' ') continue;
            if (isdigit(static_cast<unsigned char>(c))) {
                long long num = 0;
                while (i < n && isdigit(static_cast<unsigned char>(ledger[i]))) num = num * 10 + (ledger[i++] - '0');
                --i;
                values.push_back(num);
                expectOperand = false;
            } else if (c == '(') {
                ops.push_back(c);
                expectOperand = true;
            } else if (c == ')') {
                while (ops.back() != '(') applyTop(values, ops);
                ops.pop_back();
                expectOperand = false;
            } else if (c == '-' && expectOperand) {
                ops.push_back('n');  // a sign has no left operand, so nothing is popped
            } else {
                while (!ops.empty() && strength(ops.back()) > strength(c)) applyTop(values, ops);
                ops.push_back(c);
                expectOperand = true;
            }
        }
        while (!ops.empty()) applyTop(values, ops);
        return static_cast<int>(values.back());
    }

private:
    static int strength(char op) {
        if (op == 'n') return 3;
        if (op == '*' || op == '/') return 2;
        if (op == '+' || op == '-') return 1;
        return 0;  // '(' is a wall: only its own ')' removes it
    }

    static void applyTop(vector<long long>& values, vector<char>& ops) {
        const char op = ops.back();
        ops.pop_back();
        if (op == 'n') {
            values.back() = -values.back();
            return;
        }
        const long long b = values.back();
        values.pop_back();
        const long long a = values.back();
        values.pop_back();
        if (op == '+') values.push_back(a + b);
        else if (op == '-') values.push_back(a - b);
        else if (op == '*') values.push_back(a * b);
        else values.push_back(a / b);  // C++ division truncates toward zero
    }
};
