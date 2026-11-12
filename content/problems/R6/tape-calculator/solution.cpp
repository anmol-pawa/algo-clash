class Solution {
public:
    int runTape(vector<string>& tape) {
        vector<int> values;
        for (const auto& token : tape) {
            const bool isOperator = token.size() == 1 && string("+-*/").find(token[0]) != string::npos;
            if (!isOperator) {
                values.push_back(stoi(token));  // handles "-3": a lone '-' is the only minus operator
                continue;
            }
            const int right = values.back(); values.pop_back();  // newer value is the right operand
            const int left = values.back(); values.pop_back();
            switch (token[0]) {
                case '+': values.push_back(left + right); break;
                case '-': values.push_back(left - right); break;
                case '*': values.push_back(left * right); break;
                default:  values.push_back(left / right); break;  // C++ truncates toward zero
            }
        }
        return values.back();
    }
};
