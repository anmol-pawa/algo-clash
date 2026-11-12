class GaugeStack {
public:
    GaugeStack() = default;

    void push(int val) {
        // Each entry remembers the lowest reading at or below it, so the answer survives pops.
        const int lowest = items_.empty() ? val : min(val, items_.back().second);
        items_.emplace_back(val, lowest);
    }

    void pop() { items_.pop_back(); }

    int top() const { return items_.back().first; }

    int low() const { return items_.back().second; }

private:
    vector<pair<int, int>> items_;  // (reading, lowest reading in the stack up to here)
};
