class LockerBoard {
public:
    void put(int key, int val) {
        for (auto& entry : all_) {
            if (entry.first == key) { entry.second = val; return; }
        }
        all_.emplace_back(key, val);
    }
    int get(int key) const {
        for (const auto& entry : all_) if (entry.first == key) return entry.second;
        return -1;
    }
    void remove(int key) {
        for (size_t i = 0; i < all_.size(); ++i) {
            if (all_[i].first == key) { all_.erase(all_.begin() + i); return; }
        }
    }
    int count() const { return static_cast<int>(all_.size()); }
private:
    vector<pair<int, int>> all_;
};
