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
        // Move the last ticket into the hole, fix its recorded slot, then drop the old last slot.
        // Order matters when val == last: erase the key after the move so it does not come back.
        slots_[hole] = last;
        where_[last] = hole;
        slots_.pop_back();
        where_.erase(val);
        return true;
    }

    int slot(int i) const { return slots_[i]; }

    int size() const { return static_cast<int>(slots_.size()); }

private:
    vector<int> slots_;                 // Packed row of tickets.
    unordered_map<int, int> where_;     // ticket -> its slot.
};
