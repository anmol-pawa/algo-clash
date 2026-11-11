class LockerBoard {
public:
    LockerBoard() : buckets_(kInitialBuckets) {}

    void put(int key, int val) {
        auto& chain = buckets_[indexOf(key, buckets_.size())];
        for (auto& entry : chain) {
            if (entry.first == key) { entry.second = val; return; }  // replace, never duplicate
        }
        chain.emplace_back(key, val);
        ++count_;
        if (count_ > buckets_.size()) grow();  // keep load factor <= 1 so chains stay short
    }

    int get(int key) const {
        for (const auto& entry : buckets_[indexOf(key, buckets_.size())]) {
            if (entry.first == key) return entry.second;
        }
        return -1;
    }

    void remove(int key) {
        auto& chain = buckets_[indexOf(key, buckets_.size())];
        for (auto it = chain.begin(); it != chain.end(); ++it) {
            if (it->first == key) {
                *it = chain.back();  // order inside a chain is irrelevant: swap-with-last, then pop
                chain.pop_back();
                --count_;
                return;
            }
        }
    }

    int count() const { return static_cast<int>(count_); }

private:
    static constexpr size_t kInitialBuckets = 8;
    using Chain = vector<pair<int, int>>;

    static size_t indexOf(int key, size_t buckets) { return static_cast<size_t>(key) % buckets; }

    void grow() {
        vector<Chain> bigger(buckets_.size() * 2);
        for (const auto& chain : buckets_) {
            for (const auto& entry : chain) bigger[indexOf(entry.first, bigger.size())].push_back(entry);
        }
        buckets_ = move(bigger);
    }

    vector<Chain> buckets_;
    size_t count_ = 0;
};
