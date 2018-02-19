export function getArgs(func) {
    const functionName = func.toString();
    // First match everything inside the function argument parens.
    const argMatches = functionName.match(/function\s.*?\(([^)]*)\)/);
    if (!argMatches) {
        return [];
    }
    const args = argMatches[1];
    // Split the arguments string into an array comma delimited.
    // Ensure no inline comments are parsed and trim the whitespace.
    return args.split(',')
        .map((arg) => arg.replace(/\/\*.*\*\//, '').trim())
        .filter((arg) => !!arg);
}
//# sourceMappingURL=util.js.map