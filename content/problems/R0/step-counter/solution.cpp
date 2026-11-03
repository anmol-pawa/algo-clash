class StepCounter {
public:
    StepCounter(int limit, int start) : limit(limit), start(start), current(start) {}

    int add(int amount) {
        current = max(0, min(current + amount, limit));  // clamp after EVERY addition
        return current;
    }

    int total() const { return current; }

    void reset() { current = start; }

private:
    int limit;
    int start;
    int current;
};
