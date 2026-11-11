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
        const int hole = it->second;
        const int last = slots_.back();
        where_.erase(val);
        slots_[hole] = last;
        where_[last] = hole;  // Wrong when val == last: the erased ticket is re-inserted
        slots_.pop_back();
        return true;
    }
    int slot(int i) const { return slots_[i]; }
    int size() const { return static_cast<int>(slots_.size()); }
private:
    vector<int> slots_;
    unordered_map<int, int> where_;
};
