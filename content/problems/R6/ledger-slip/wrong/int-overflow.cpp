class Solution {
public:
    long long ledgerTotal(string slip) {
        int total = 0;  // Wrong: partial sums can pass 32 bits.
        int sign = 1;
        vector<int> saved;
        const int n = static_cast<int>(slip.size());
        for (int i = 0; i < n; ++i) {
            const char c = slip[i];
            if (isdigit(static_cast<unsigned char>(c))) {
                int value = 0;
                while (i < n && isdigit(static_cast<unsigned char>(slip[i]))) value = value * 10 + (slip[i++] - '0');
                --i;
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
                const int outerSign = saved.back(); saved.pop_back();
                const int outerTotal = saved.back(); saved.pop_back();
                total = outerTotal + outerSign * total;
            }
        }
        return total;
    }
};
