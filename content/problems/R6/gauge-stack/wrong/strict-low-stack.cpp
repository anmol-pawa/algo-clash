class GaugeStack {
public:
    GaugeStack() = default;
    void push(int val) {
        items_.push_back(val);
        if (lows_.empty() || val < lows_.back()) lows_.push_back(val);  // Wrong: a repeat of the minimum is not tracked
    }
    void pop() {
        if (items_.back() == lows_.back()) lows_.pop_back();  // so popping one copy forgets the other
        items_.pop_back();
    }
    int top() const { return items_.back(); }
    int low() const { return lows_.back(); }

private:
    vector<int> items_;
    vector<int> lows_;
};
