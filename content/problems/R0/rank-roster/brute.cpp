class Solution {
public:
    vector<int> rankPlayers(vector<vector<int>> players) {
        // Selection: repeatedly pick the best unused player.
        vector<bool> used(players.size(), false);
        vector<int> ids;
        for (size_t round = 0; round < players.size(); ++round) {
            int best = -1;
            for (size_t i = 0; i < players.size(); ++i) {
                if (used[i]) continue;
                if (best < 0 || players[i][1] > players[best][1] ||
                    (players[i][1] == players[best][1] && players[i][0] < players[best][0])) best = static_cast<int>(i);
            }
            used[best] = true;
            ids.push_back(players[best][0]);
        }
        return ids;
    }
};
