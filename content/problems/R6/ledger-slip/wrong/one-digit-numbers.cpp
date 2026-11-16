class Solution {
public:
    long long ledgerTotal(string slip) {
        long long total = 0;
        int sign = 1;
        vector<long long> saved;
        for (const char c : slip) {
            if (isdigit(static_cast<unsigned char>(c))) {
                total += sign * (c - '0');  // Wrong: every digit is its own number.
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                saved.push_back(total);
                saved.push_back(sign);
                total = 0;
                sign = 1;
            } else if (c == ')') {
                const int outerSign = static_cast<int>(saved.back()); saved.pop_back();
                const long long outerTotal = saved.back(); saved.pop_back();
                total = outerTotal + outerSign * total;
            }
        }
        return total;
    }
};
