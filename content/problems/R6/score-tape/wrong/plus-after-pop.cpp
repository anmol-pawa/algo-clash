class Solution {
public:
    long long totalScore(vector<string>& commands) {
        vector<int> tape;
        for (const auto& cmd : commands) {
            if (cmd == "C") tape.pop_back();
            else if (cmd == "D") tape.push_back(tape.back() * 2);
            else if (cmd == "H") tape.push_back(tape.back() / 2);
            else if (cmd == "+") {
                const int last = tape.back();
                tape.pop_back();  // Wrong: the last score is removed while summing, so it vanishes from the tape
                tape.push_back(last + tape.back());
            }
            else tape.push_back(stoi(cmd));
        }
        long long sum = 0;
        for (const int score : tape) sum += score;
        return sum;
    }
};
