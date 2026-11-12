class GaugeStack {
public:
    GaugeStack() = default;
    void push(int val) { items_.push_back(val); }
    void pop() { items_.pop_back(); }
    int top() const { return items_.back(); }
    int low() const {
        return *min_element(items_.begin(), items_.end());  // Correct but O(n) per call
    }

private:
    vector<int> items_;
};
