class Solution {
    string s;

    // Evaluates s[lo, hi) by recursion; every '(' scans forward to find its partner.
    long long eval(int lo, int hi) {
        long long total = 0;
        int sign = 1;
        for (int i = lo; i < hi; ++i) {
            const char c = s[i];
            if (isdigit(static_cast<unsigned char>(c))) {
                long long value = 0;
                while (i < hi && isdigit(static_cast<unsigned char>(s[i]))) value = value * 10 + (s[i++] - '0');
                --i;
                total += sign * value;
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                int depth = 0, j = i;
                for (;; ++j) {  // Wrong: O(length of the group) per bracket, O(n^2) when nested.
                    if (s[j] == '(') ++depth;
                    else if (s[j] == ')' && --depth == 0) break;
                }
                total += sign * eval(i + 1, j);
                i = j;
            }
        }
        return total;
    }

public:
    long long ledgerTotal(string slip) {
        s = slip;
        return eval(0, static_cast<int>(s.size()));
    }
};
