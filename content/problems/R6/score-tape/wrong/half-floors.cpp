class Solution {
public:
    long long totalScore(vector<string>& commands) {
        vector<int> tape;
        for (const auto& cmd : commands) {
            if (cmd == "C") tape.pop_back();
            else if (cmd == "D") tape.push_back(tape.back() * 2);
            else if (cmd == "H") tape.push_back(static_cast<int>(floor(tape.back() / 2.0)));  // Wrong: rounds -7/2 to -4
            else if (cmd == "+") { const int n = static_cast<int>(tape.size()); tape.push_back(tape[n - 1] + tape[n - 2]); }
            else tape.push_back(stoi(cmd));
        }
        long long sum = 0;
        for (const int score : tape) sum += score;
        return sum;
    }
};
