export function getArgs(func) {
    var functionName = func.toString();
    // First match everything inside the function argument parens.
    var argMatches = functionName.match(/function\s.*?\(([^)]*)\)/);
    if (!argMatches) {
        return [];
    }
    var args = argMatches[1];
    // Split the arguments string into an array comma delimited.
    // Ensure no inline comments are parsed and trim the whitespace.
    return args.split(',')
        .map(function (arg) { return arg.replace(/\/\*.*\*\//, '').trim(); })
        .filter(function (arg) { return !!arg; });
}
//# sourceMappingURL=util.js.map