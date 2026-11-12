class Solution {
public:
    long long totalScore(vector<string>& commands) {
        vector<int> tape;
        for (const auto& cmd : commands) {
            if (cmd == "C") tape.pop_back();
            else if (cmd == "D") tape.push_back(tape.back() * 2);
            else if (cmd == "H") tape.push_back(tape.back() / 2);
            else if (cmd == "+") { const int n = static_cast<int>(tape.size()); tape.push_back(tape[n - 1] + tape[n - 2]); }
            else tape.push_back(stoi(cmd));
        }
        int sum = 0;  // Wrong: the total can exceed 32 bits
        for (const int score : tape) sum += score;
        return sum;
    }
};
