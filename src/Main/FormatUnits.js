export function FormatUnits(unitsint) {
    let isPositive = true;
    if (unitsint < 0) {
        unitsint *= -1;
        isPositive = false;
    }
    let units = unitsint.toString();
    let count = 1;
    let string = []
    let numberString = units.toString().split("");
    let ds = 0;
    for (ds = numberString.length - 1; ds >= 0; ds--) {
        string.unshift(numberString[ds]);
        if (count % 3 === 0 && ds !== 0)
            string.unshift(".");
        count++;
    }

    let unitsFormatted = string.join("");
    return `${isPositive ? "" : "-"}${unitsFormatted}`;
}