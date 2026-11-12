class GaugeStack {
public:
    GaugeStack() = default;
    void push(int val) {
        items_.push_back(val);
        lowest_ = items_.size() == 1 ? val : min(lowest_, val);
    }
    void pop() { items_.pop_back(); }  // Wrong: the lowest reading is never recomputed after a pop
    int top() const { return items_.back(); }
    int low() const { return lowest_; }

private:
    vector<int> items_;
    int lowest_ = 0;
};
