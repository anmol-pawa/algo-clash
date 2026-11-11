class LockerBoard {
public:
    // Correct but never grows: with 8 buckets, chains reach tens of thousands of entries.
    LockerBoard() : buckets_(8) {}
    void put(int key, int val) {
        auto& chain = buckets_[key % 8];
        for (auto& entry : chain) if (entry.first == key) { entry.second = val; return; }
        chain.emplace_back(key, val);
        ++count_;
    }
    int get(int key) const {
        for (const auto& entry : buckets_[key % 8]) if (entry.first == key) return entry.second;
        return -1;
    }
    void remove(int key) {
        auto& chain = buckets_[key % 8];
        for (size_t i = 0; i < chain.size(); ++i) {
            if (chain[i].first == key) { chain[i] = chain.back(); chain.pop_back(); --count_; return; }
        }
    }
    int count() const { return count_; }
private:
    vector<vector<pair<int, int>>> buckets_;
    int count_ = 0;
};
