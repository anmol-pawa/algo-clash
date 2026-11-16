class Solution {
public:
    long long ledgerTotal(string slip) {
        // total: value of the group being read; sign: sign of the next term.
        // On '(' we park the outer total and the sign in front of the bracket.
        long long total = 0;
        int sign = 1;
        vector<long long> saved;
        const int n = static_cast<int>(slip.size());
        for (int i = 0; i < n; ++i) {
            const char c = slip[i];
            if (isdigit(static_cast<unsigned char>(c))) {
                long long value = 0;
                while (i < n && isdigit(static_cast<unsigned char>(slip[i]))) value = value * 10 + (slip[i++] - '0');
                --i;  // the loop's ++i moves past the last digit
                total += sign * value;
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
