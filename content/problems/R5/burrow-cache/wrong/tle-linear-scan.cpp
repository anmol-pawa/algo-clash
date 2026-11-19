// Correct but O(k) per operation: scans a vector and erases from the middle.
class BurrowCache {
public:
    explicit BurrowCache(int capacity) : capacity_(capacity) {}
    int get(int key) {
        for (size_t i = 0; i < items_.size(); ++i) {
            if (items_[i].first == key) {
                const auto item = items_[i];
                items_.erase(items_.begin() + i);
                items_.push_back(item);
                return item.second;
            }
        }
        return -1;
    }
    void put(int key, int value) {
        for (size_t i = 0; i < items_.size(); ++i) {
            if (items_[i].first == key) {
                items_.erase(items_.begin() + i);
                break;
            }
        }
        if (static_cast<int>(items_.size()) == capacity_) items_.erase(items_.begin());
        items_.emplace_back(key, value);
    }
private:
    int capacity_;
    vector<pair<int, int>> items_;
};
