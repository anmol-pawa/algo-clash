class RingLane {
public:
    explicit RingLane(int capacity) : capacity_(capacity) {}
    bool offer(int val) {
        if (static_cast<int>(cars_.size()) == capacity_) return false;
        cars_.push_back(val);
        return true;
    }
    bool poll() {
        if (cars_.empty()) return false;
        cars_.erase(cars_.begin());
        return true;
    }
    int front() const { return cars_.empty() ? -1 : cars_.front(); }
    int back() const { return cars_.empty() ? -1 : cars_.back(); }
    bool empty() const { return cars_.empty(); }
    bool full() const { return static_cast<int>(cars_.size()) == capacity_; }

private:
    int capacity_;
    vector<int> cars_;
};
