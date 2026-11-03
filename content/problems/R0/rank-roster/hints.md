## Nudge
`sort` needs to know when one element should come before another. For ints it knows. For your own struct, you must tell it.
## Approach
Define `struct Player { int id; int score; Player(int id, int score) : id(id), score(score) {} bool operator<(const Player& other) const { ... } };`. Make `operator<` return true when `*this` should come before `other`. Copy every entry into a `vector<Player>`, call `sort(v.begin(), v.end())`, then read the ids out.
## Key insight
`operator<` is the whole ranking rule: first compare scores (bigger first, so use `>`), and only when scores are equal fall back to the smaller id. It must be `const`, and it must be a strict ordering: never return true for two equal things.
