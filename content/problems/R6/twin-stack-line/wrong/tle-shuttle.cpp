class TwinStackLine {
public:
    TwinStackLine() = default;
    void enqueue(int val) {
        // Correct but O(n): shuttle everything to the spare stack and back so the new value sits at the bottom
        while (!main_.empty()) { spare_.push_back(main_.back()); main_.pop_back(); }
        main_.push_back(val);
        while (!spare_.empty()) { main_.push_back(spare_.back()); spare_.pop_back(); }
    }
    int dequeue() {
        const int val = main_.back();
        main_.pop_back();
        return val;
    }
    int front() { return main_.back(); }
    bool empty() const { return main_.empty(); }

private:
    vector<int> main_, spare_;
};
