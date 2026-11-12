class Solution {
public:
    vector<int> survivors(vector<int>& rocks) {
        vector<int> kept;  // invariant: no right-mover is directly followed by a left-mover
        for (const int rock : rocks) {
            bool alive = true;
            while (alive && rock < 0 && !kept.empty() && kept.back() > 0) {
                if (kept.back() < -rock) {
                    kept.pop_back();  // the right-mover shatters; the new rock keeps going
                } else {
                    if (kept.back() == -rock) kept.pop_back();  // equal sizes: both shatter
                    alive = false;
                }
            }
            if (alive) kept.push_back(rock);
        }
        return kept;
    }
};
