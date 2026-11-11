class DrumBag {
public:
    DrumBag() = default;
    bool insert(int val) {
        if (find(slots_.begin(), slots_.end(), val) != slots_.end()) return false;  // Correct but O(n)
        slots_.push_back(val);
        return true;
    }
    bool erase(int val) {
        const auto it = find(slots_.begin(), slots_.end(), val);
        if (it == slots_.end()) return false;
        *it = slots_.back();
        slots_.pop_back();
        return true;
    }
    int slot(int i) const { return slots_[i]; }
    int size() const { return static_cast<int>(slots_.size()); }
private:
    vector<int> slots_;
};
