class Solution {
public:
    int runTape(vector<string>& tape) {
        vector<int> values;
        for (const auto& token : tape) {
            const bool isOperator = token.size() == 1 && string("+-*/").find(token[0]) != string::npos;
            if (!isOperator) { values.push_back(stoi(token)); continue; }
            const int right = values.back(); values.pop_back();
            const int left = values.back(); values.pop_back();
            switch (token[0]) {
                case '+': values.push_back(left + right); break;
                case '-': values.push_back(left - right); break;
                case '*': values.push_back(left * right); break;
                default: {
                    // Wrong: rounds toward negative infinity.
                    int q = left / right;
                    if ((left % right != 0) && ((left < 0) != (right < 0))) --q;
                    values.push_back(q);
                }
            }
        }
        return values.back();
    }
};
