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
        slots_[hole] = slots_.back();  // Wrong: where_ for the moved ticket is never updated
        slots_.pop_back();
        where_.erase(val);
        return true;
    }
    int slot(int i) const { return slots_[i]; }
    int size() const { return static_cast<int>(slots_.size()); }
private:
    vector<int> slots_;
    unordered_map<int, int> where_;
};
