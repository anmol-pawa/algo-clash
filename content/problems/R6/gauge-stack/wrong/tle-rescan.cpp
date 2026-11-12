class GaugeStack {
public:
    GaugeStack() = default;
    void push(int val) { items_.push_back(val); }
    void pop() { items_.pop_back(); }
    int top() const { return items_.back(); }
    int low() const {
        int best = items_.front();  // Correct but O(n) per call
        for (const int x : items_) best = min(best, x);
        return best;
    }

private:
    vector<int> items_;
};
