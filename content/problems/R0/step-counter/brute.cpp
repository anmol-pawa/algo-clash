class StepCounter {
public:
    StepCounter(int limit, int start) : limit_(limit), start_(start) {}

    int add(int amount) {
        // Replays the whole history since the last reset each time.
        steps_.push_back(amount);
        return total();
    }

    int total() const {
        int value = start_;
        for (const int s : steps_) value = max(0, min(value + s, limit_));
        return value;
    }

    void reset() { steps_.clear(); }

private:
    int limit_;
    int start_;
    vector<int> steps_;
};
