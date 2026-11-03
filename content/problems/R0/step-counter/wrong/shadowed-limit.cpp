class StepCounter {
public:
    StepCounter(int limit, int start) {
        limit = limit;  // Wrong: assigns the parameter to itself; the member keeps its default of 0
        this->start = start;
        current = start;
    }
    int add(int amount) {
        current = max(0, min(current + amount, limit));
        return current;
    }
    int total() const { return current; }
    void reset() { current = start; }

private:
    int limit = 0;
    int start = 0;
    int current = 0;
};
