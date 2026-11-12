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
    bool empty() const { return inbox_.empty(); }  // Wrong: customers may be waiting in the outbox

private:
    void refill() {
        if (!outbox_.empty()) return;
        while (!inbox_.empty()) {
            outbox_.push_back(inbox_.back());
            inbox_.pop_back();
        }
    }
    vector<int> inbox_, outbox_;
};
