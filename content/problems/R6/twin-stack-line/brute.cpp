class TwinStackLine {
public:
    TwinStackLine() = default;
    void enqueue(int val) { line_.push_back(val); }
    int dequeue() {
        const int val = line_.front();
        line_.erase(line_.begin());  // O(n) shift, fine for a brute force
        return val;
    }
    int front() { return line_.front(); }
    bool empty() const { return line_.empty(); }

private:
    vector<int> line_;
};
