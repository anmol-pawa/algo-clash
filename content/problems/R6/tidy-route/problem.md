# Tidy Route

Stackspire's lifts are controlled by routes written like file paths. A `route` always starts with `/` and is made of **names** separated by slashes. Names are made of lowercase letters and dots.

- A name `.` means "stay here" and does nothing.
- A name `..` means "go up one level" (undo the most recent name). Going up from the top level stays at the top level.
- Several slashes in a row count as one. Any other name, including `...` or `.a`, is an ordinary name.

Return the **tidy** form of the route: it starts with a single `/`, names are separated by a single `/`, it has no `.` or `..` names, and it does not end with `/` unless it is just the top level `/`.

## Examples

- `route = "/a/./b/../c/"` gives `"/a/c"`.
- `route = "/../.."` gives `"/"`: you cannot go above the top.
- `route = "//x///y"` gives `"/x/y"`.
- `route = "/a/.../b/.."` gives `"/a/..."`: `...` is a normal name.

## Constraints

- `1 <= route.length() <= 100000`
- `route` starts with `/` and contains only lowercase letters, `.` and `/`.
