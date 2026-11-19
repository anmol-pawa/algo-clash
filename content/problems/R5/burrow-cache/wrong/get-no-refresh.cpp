// Bug: a successful get does not count as a touch.
class BurrowCache {
public:
    explicit BurrowCache(int capacity) : capacity_(capacity) {}
    int get(int key) {
        const auto found = index_.find(key);
        if (found == index_.end()) return -1;
        return found->second->second;
    }
    void put(int key, int value) {
        const auto found = index_.find(key);
        if (found != index_.end()) {
            found->second->second = value;
            items_.splice(items_.begin(), items_, found->second);
            return;
        }
        if (static_cast<int>(items_.size()) == capacity_) {
            index_.erase(items_.back().first);
            items_.pop_back();
        }
        items_.emplace_front(key, value);
        index_[key] = items_.begin();
    }
private:
    int capacity_;
    list<pair<int, int>> items_;
    unordered_map<int, list<pair<int, int>>::iterator> index_;
};
