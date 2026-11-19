class BurrowCache {
public:
    explicit BurrowCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        const auto found = index_.find(key);
        if (found == index_.end()) return -1;
        touch(found->second);
        return found->second->second;
    }

    void put(int key, int value) {
        const auto found = index_.find(key);
        if (found != index_.end()) {  // update: no eviction, just refresh
            found->second->second = value;
            touch(found->second);
            return;
        }
        if (static_cast<int>(items_.size()) == capacity_) {
            index_.erase(items_.back().first);  // the node carries its key for exactly this
            items_.pop_back();
        }
        items_.emplace_front(key, value);
        index_[key] = items_.begin();
    }

private:
    using Item = pair<int, int>;  // key, value

    // Moves one node to the front in O(1); iterators stay valid after splice.
    void touch(list<Item>::iterator it) { items_.splice(items_.begin(), items_, it); }

    int capacity_;
    list<Item> items_;  // freshest at the front, stalest at the back
    unordered_map<int, list<Item>::iterator> index_;
};
