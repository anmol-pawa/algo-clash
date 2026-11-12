class Solution {
public:
    int runTape(vector<string>& tape) {
        vector<int> values;
        for (const auto& token : tape) {
            const bool isOperator = token.size() == 1 && string("+-*/").find(token[0]) != string::npos;
            if (!isOperator) { values.push_back(stoi(token)); continue; }
            const int a = values.back(); values.pop_back();
            const int b = values.back(); values.pop_back();
            // Wrong: a is the newer value, so - and / run backwards.
            switch (token[0]) {
                case '+': values.push_back(a + b); break;
                case '-': values.push_back(a - b); break;
                case '*': values.push_back(a * b); break;
                default:  values.push_back(a / b); break;
            }
        }
        return values.back();
    }
};
