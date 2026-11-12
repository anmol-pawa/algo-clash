class Solution {
public:
    long long totalScore(vector<string>& commands) {
        vector<int> tape;
        long long sum = 0;
        for (const auto& cmd : commands) {
            if (cmd == "C") tape.pop_back();
            else if (cmd == "D") tape.push_back(tape.back() * 2);
            else if (cmd == "H") tape.push_back(tape.back() / 2);
            else if (cmd == "+") { const int n = static_cast<int>(tape.size()); tape.push_back(tape[n - 1] + tape[n - 2]); }
            else tape.push_back(stoi(cmd));
            sum = 0;  // Correct but O(n^2): re-adds the whole tape after every command
            for (const int score : tape) sum += score;
        }
        return sum;
    }
};
