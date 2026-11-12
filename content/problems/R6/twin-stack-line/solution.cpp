class TwinStackLine {
public:
    TwinStackLine() = default;

    void enqueue(int val) { inbox_.push_back(val); }

    int dequeue() {
        refill();
        const int val = outbox_.back();
        outbox_.pop_back();
        return val;
    }

    int front() {
        refill();
        return outbox_.back();
    }

    bool empty() const { return inbox_.empty() && outbox_.empty(); }

private:
    // Only move when the outbox is empty: the outbox then holds the oldest customers in serving order.
    void refill() {
        if (!outbox_.empty()) return;
        while (!inbox_.empty()) {
            outbox_.push_back(inbox_.back());
            inbox_.pop_back();
        }
    }

    vector<int> inbox_;   // newest on top
    vector<int> outbox_;  // oldest on top
};
