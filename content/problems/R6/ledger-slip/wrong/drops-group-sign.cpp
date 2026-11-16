class Solution {
public:
    long long ledgerTotal(string slip) {
        long long total = 0;
        int sign = 1;
        vector<long long> saved;
        const int n = static_cast<int>(slip.size());
        for (int i = 0; i < n; ++i) {
            const char c = slip[i];
            if (isdigit(static_cast<unsigned char>(c))) {
                long long value = 0;
                while (i < n && isdigit(static_cast<unsigned char>(slip[i]))) value = value * 10 + (slip[i++] - '0');
                --i;
                total += sign * value;
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                saved.push_back(total);
                total = 0;
                sign = 1;
            } else if (c == ')') {
                // Wrong: the sign in front of the bracket is never applied to the group.
                total = saved.back() + total;
                saved.pop_back();
            }
        }
        return total;
    }
};
