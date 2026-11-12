class Solution {
public:
    long long totalScore(vector<string>& commands) {
        // Recompute the whole tape from scratch after every command: O(n^2).
        long long answer = 0;
        for (size_t end = 1; end <= commands.size(); ++end) {
            vector<long long> tape;
            for (size_t i = 0; i < end; ++i) {
                const string& c = commands[i];
                if (c == "C") tape.pop_back();
                else if (c == "D") tape.push_back(tape.back() * 2);
                else if (c == "H") tape.push_back(tape.back() / 2);
                else if (c == "+") tape.push_back(tape[tape.size() - 1] + tape[tape.size() - 2]);
                else tape.push_back(stoll(c));
            }
            answer = 0;
            for (const long long x : tape) answer += x;
        }
        return answer;
    }
};
