class LockerBoard {
public:
    LockerBoard() : buckets_(1031) {}
    void put(int key, int val) {
        auto& chain = buckets_[key % 1031];
        for (auto& entry : chain) if (entry.first == key) { entry.second = val; ++count_; return; }  // Wrong: counts a replace
        chain.emplace_back(key, val);
        ++count_;
    }
    int get(int key) const {
        for (const auto& entry : buckets_[key % 1031]) if (entry.first == key) return entry.second;
        return -1;
    }
    void remove(int key) {
        auto& chain = buckets_[key % 1031];
        for (size_t i = 0; i < chain.size(); ++i) {
            if (chain[i].first == key) { chain.erase(chain.begin() + i); --count_; return; }
        }
    }
    int count() const { return count_; }
private:
    vector<vector<pair<int, int>>> buckets_;
    int count_ = 0;
};
