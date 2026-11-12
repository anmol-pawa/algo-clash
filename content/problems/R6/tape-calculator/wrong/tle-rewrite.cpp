class Solution {
public:
    int runTape(vector<string>& tape) {
        // Correct but quadratic: rescans from the front and erases from the middle of a vector.
        vector<string> t = tape;
        while (t.size() > 1) {
            size_t i = 0;
            while (!(t[i].size() == 1 && string("+-*/").find(t[i][0]) != string::npos)) ++i;
            const long long a = stoll(t[i - 2]), b = stoll(t[i - 1]);
            long long r = 0;
            switch (t[i][0]) {
                case '+': r = a + b; break;
                case '-': r = a - b; break;
                case '*': r = a * b; break;
                default:  r = a / b; break;
            }
            t[i - 2] = to_string(r);
            t.erase(t.begin() + static_cast<long>(i - 1), t.begin() + static_cast<long>(i + 1));
        }
        return static_cast<int>(stoll(t[0]));
    }
};
