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
    void refill() {
        // Wrong: moves whenever the inbox has anything, even if the outbox still holds older customers
        while (!inbox_.empty()) {
            outbox_.push_back(inbox_.back());
            inbox_.pop_back();
        }
    }
    vector<int> inbox_, outbox_;
};
