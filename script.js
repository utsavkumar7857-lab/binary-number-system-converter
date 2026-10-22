const numberInput = document.getElementById("numberInput");
const fromBase = document.getElementById("fromBase");
const toBase = document.getElementById("toBase");
const convertBtn = document.getElementById("convertBtn");
const resultBox = document.getElementById("result");
const errorBox = document.getElementById("error");
const copyBtn = document.getElementById("copyBtn");

function convertNumber(value, sourceBase, targetBase) {
    value = value.trim().replace(/\s+/g, "");

    if (value === "") {
        throw new Error("Please enter a number.");
    }

    const digits = "0123456789ABCDEF";
    value = value.toUpperCase();

    let decimalValue = 0n;
    const base = BigInt(sourceBase);

    for (const char of value) {
        const digit = digits.indexOf(char);

        if (digit < 0 || digit >= sourceBase) {
            throw new Error(
                `Invalid number for base ${sourceBase}.`
            );
        }

        decimalValue = decimalValue * base + BigInt(digit);
    }

    if (decimalValue === 0n) {
        return "0";
    }

    let result = "";
    const target = BigInt(targetBase);

    while (decimalValue > 0n) {
        const remainder = Number(decimalValue % target);
        result = digits[remainder] + result;
        decimalValue = decimalValue / target;
    }

    return result;
}

function convert() {
    errorBox.textContent = "";
    resultBox.textContent = "";
    copyBtn.style.display = "none";

    try {
        const input = numberInput.value;
        const sourceBase = Number(fromBase.value);
        const targetBase = Number(toBase.value);

        const answer = convertNumber(
            input,
            sourceBase,
            targetBase
        );

        resultBox.textContent = answer;
        copyBtn.style.display = "inline-block";
    } catch (error) {
        errorBox.textContent = error.message;
    }
}

convertBtn.addEventListener("click", convert);

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(resultBox.textContent);
        copyBtn.textContent = "Copied!";

        setTimeout(() => {
            copyBtn.textContent = "Copy Result";
        }, 1500);
    } catch {
        errorBox.textContent = "Unable to copy result.";
    }
});

document.querySelectorAll("[data-example]").forEach(button => {
    button.addEventListener("click", () => {
        numberInput.value = button.dataset.example;
        fromBase.value = button.dataset.from || "10";
        toBase.value = button.dataset.to || "2";
        convert();
    });
});