class StepCounter {
public:
    StepCounter(int limit, int start) : limit(limit), start(start), current(start) {}
    int add(int amount) {
        current += amount;  // Wrong: stores the unclamped sum and clamps only when reporting
        return total();
    }
    int total() const { return max(0, min(current, limit)); }
    void reset() { current = start; }

private:
    int limit;
    int start;
    int current;
};
