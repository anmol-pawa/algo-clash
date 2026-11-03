class StepCounter {
public:
    StepCounter(int limit, int start) : limit(limit), start(start), current(start) {}
    int add(int amount) {
        current = max(0, min(current + amount, limit));
        return current;
    }
    int total() const { return current; }
    void reset() { current = 0; }  // Wrong: should return to the constructor's start

private:
    int limit;
    int start;
    int current;
};
