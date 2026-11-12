class RingLane {
public:
    // Wrong: one array of capacity slots and head/tail only; head == tail means empty, so a full lane looks empty.
    explicit RingLane(int capacity) : slots_(capacity) {}
    bool offer(int val) {
        if (full()) return false;
        slots_[tail_] = val;
        tail_ = (tail_ + 1) % static_cast<int>(slots_.size());
        return true;
    }
    bool poll() {
        if (empty()) return false;
        head_ = (head_ + 1) % static_cast<int>(slots_.size());
        return true;
    }
    int front() const { return empty() ? -1 : slots_[head_]; }
    int back() const { return empty() ? -1 : slots_[(tail_ + static_cast<int>(slots_.size()) - 1) % static_cast<int>(slots_.size())]; }
    bool empty() const { return head_ == tail_; }
    bool full() const { return (tail_ + 1) % static_cast<int>(slots_.size()) == head_; }  // loses one slot of capacity

private:
    vector<int> slots_;
    int head_ = 0;
    int tail_ = 0;
};
