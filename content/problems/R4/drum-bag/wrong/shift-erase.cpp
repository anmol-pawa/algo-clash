class DrumBag {
public:
    DrumBag() = default;
    bool insert(int val) {
        if (where_.count(val)) return false;
        where_[val] = static_cast<int>(slots_.size());
        slots_.push_back(val);
        return true;
    }
    bool erase(int val) {
        const auto it = where_.find(val);
        if (it == where_.end()) return false;
        slots_.erase(slots_.begin() + it->second);  // Wrong: shifts everything left, O(n), and breaks the slot rule
        where_.erase(val);
        for (size_t i = 0; i < slots_.size(); ++i) where_[slots_[i]] = static_cast<int>(i);
        return true;
    }
    int slot(int i) const { return slots_[i]; }
    int size() const { return static_cast<int>(slots_.size()); }
private:
    vector<int> slots_;
    unordered_map<int, int> where_;
};
