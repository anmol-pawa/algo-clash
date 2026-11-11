class DrumBag {
public:
    DrumBag() = default;

    bool insert(int val) {
        for (const int x : slots_) if (x == val) return false;
        slots_.push_back(val);
        return true;
    }

    bool erase(int val) {
        for (size_t i = 0; i < slots_.size(); ++i) {
            if (slots_[i] == val) {
                slots_[i] = slots_.back();
                slots_.pop_back();
                return true;
            }
        }
        return false;
    }

    int slot(int i) const { return slots_[i]; }

    int size() const { return static_cast<int>(slots_.size()); }

private:
    vector<int> slots_;
};
