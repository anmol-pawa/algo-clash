class RingLane {
public:
    explicit RingLane(int capacity) : slots_(capacity) {}

    bool offer(int val) {
        if (full()) return false;
        slots_[(head_ + size_) % capacity()] = val;  // first free slot after the last car
        ++size_;
        return true;
    }

    bool poll() {
        if (empty()) return false;
        head_ = (head_ + 1) % capacity();  // the array never shifts; the window moves
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
    int head_ = 0;  // index of the front car
    int size_ = 0;  // cars waiting; tracked so empty and full are never confused
};
