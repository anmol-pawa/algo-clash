struct Crate {
    int weight;
    int id;
    Crate(int w, int i) : weight(w), id(i) {}
    // Wrong: the comparison is flipped, so the lightest crate is lifted first.
    bool operator<(const Crate& other) const {
        if (weight != other.weight) return weight < other.weight;
        return id < other.id;
    }
};

class Solution {
public:
    vector<int> rankCrates(vector<int>& weights) {
        vector<Crate> crates;
        for (int i = 0; i < static_cast<int>(weights.size()); ++i) crates.emplace_back(weights[i], i);
        sort(crates.begin(), crates.end());
        vector<int> order;
        for (const auto& c : crates) order.push_back(c.id);
        return order;
    }
};
