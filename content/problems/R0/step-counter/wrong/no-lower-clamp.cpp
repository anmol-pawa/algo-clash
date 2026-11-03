class StepCounter {
public:
    StepCounter(int limit, int start) : limit(limit), start(start), current(start) {}
    int add(int amount) {
        current = min(current + amount, limit);  // Wrong: the total may go below 0
        return current;
    }
    int total() const { return current; }
    void reset() { current = start; }

private:
    int limit;
    int start;
    int current;
};
