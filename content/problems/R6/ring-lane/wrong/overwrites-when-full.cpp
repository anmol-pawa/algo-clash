class RingLane {
public:
    explicit RingLane(int capacity) : slots_(capacity) {}
    bool offer(int val) {
        slots_[(head_ + size_) % capacity()] = val;  // Wrong: no fullness check, overwrites the front car
        if (size_ < capacity()) ++size_;
        return true;
    }
    bool poll() {
        if (empty()) return false;
        head_ = (head_ + 1) % capacity();
        --size_;
        return true;
    }
    int front() const { return empty() ? -1 : slots_[head_]; }
    int back() const { return empty() ? -1 : slots_[(head_ + size_ - 1) % capacity()]; }
    bool empty() const { return size_ == 0; }
    bool full() const { return size_ == capacity(); }

private:
    int capacity() const { return static_cast<int>(slots_.size()); }
    vector<int> slots_;
    int head_ = 0;
    int size_ = 0;
};
