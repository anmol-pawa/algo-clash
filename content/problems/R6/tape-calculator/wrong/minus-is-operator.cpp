class Solution {
public:
    int runTape(vector<string>& tape) {
        vector<int> values;
        for (const auto& token : tape) {
            // Wrong: any token starting with '-' is treated as the minus operator.
            const bool isOperator = token[0] == '-' || token == "+" || token == "*" || token == "/";
            if (!isOperator) { values.push_back(stoi(token)); continue; }
            const int right = values.back(); values.pop_back();
            const int left = values.back(); values.pop_back();
            switch (token[0]) {
                case '+': values.push_back(left + right); break;
                case '-': values.push_back(left - right); break;
                case '*': values.push_back(left * right); break;
                default:  values.push_back(left / right); break;
            }
        }
        return values.back();
    }
};
