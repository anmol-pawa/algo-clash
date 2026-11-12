class RingLane {
public:
    explicit RingLane(int capacity) : capacity_(capacity) {}
    bool offer(int val) {
        if (full()) return false;
        auto it = cars_.before_begin();
        while (next(it) != cars_.end()) ++it;  // Correct but walks the whole chain to find the tail: O(size) per offer
        cars_.insert_after(it, val);
        ++size_;
        return true;
    }
    bool poll() {
        if (empty()) return false;
        cars_.pop_front();
        --size_;
        return true;
    }
    int front() const { return empty() ? -1 : cars_.front(); }
    int back() const {
        if (empty()) return -1;
        auto it = cars_.begin();
        while (next(it) != cars_.end()) ++it;
        return *it;
    }
    bool empty() const { return size_ == 0; }
    bool full() const { return size_ == capacity_; }

private:
    int capacity_;
    int size_ = 0;
    forward_list<int> cars_;
};
