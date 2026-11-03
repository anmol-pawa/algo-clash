struct Player {
    int id, score;
    Player(int id, int score) : id(id), score(score) {}
    // Wrong: ties go to the LARGER id.
    bool operator<(const Player& other) const {
        if (score != other.score) return score > other.score;
        return id > other.id;
    }
};
class Solution {
public:
    vector<int> rankPlayers(vector<vector<int>> players) {
        vector<Player> roster;
        for (const auto& p : players) roster.emplace_back(p[0], p[1]);
        sort(roster.begin(), roster.end());
        vector<int> ids;
        for (const auto& p : roster) ids.push_back(p.id);
        return ids;
    }
};
