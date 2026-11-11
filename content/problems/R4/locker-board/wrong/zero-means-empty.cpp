class LockerBoard {
public:
    LockerBoard() : buckets_(1031) {}
    void put(int key, int val) {
        auto& chain = buckets_[key % 1031];
        for (auto& entry : chain) if (entry.first == key) { entry.second = val; return; }
        chain.emplace_back(key, val);
    }
    int get(int key) const {
        for (const auto& entry : buckets_[key % 1031]) {
            if (entry.first == key) return entry.second == 0 ? -1 : entry.second;  // Wrong: 0 is a legal value
        }
        return -1;
    }
    void remove(int key) {
        auto& chain = buckets_[key % 1031];
        for (size_t i = 0; i < chain.size(); ++i) {
            if (chain[i].first == key) { chain.erase(chain.begin() + i); return; }
        }
    }
    int count() const {
        int c = 0;
        for (const auto& chain : buckets_) c += static_cast<int>(chain.size());
        return c;
    }
private:
    vector<vector<pair<int, int>>> buckets_;
};
