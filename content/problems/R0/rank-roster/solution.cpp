struct Player {
    int id;
    int score;

    Player(int id, int score) : id(id), score(score) {}

    // "Smaller" means "ranks first": higher score, then smaller id.
    bool operator<(const Player& other) const {
        if (score != other.score) return score > other.score;
        return id < other.id;
    }
};

class Solution {
public:
    vector<int> rankPlayers(vector<vector<int>> players) {
        vector<Player> roster;
        roster.reserve(players.size());
        for (const auto& p : players) roster.emplace_back(p[0], p[1]);
        sort(roster.begin(), roster.end());
        vector<int> ids;
        ids.reserve(roster.size());
        for (const auto& p : roster) ids.push_back(p.id);
        return ids;
    }
};
