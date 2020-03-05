import { transform } from "@babel/core";

const conf = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-typescript"
    ],
    plugins: [
        "./src/index.js",
        "@babel/plugin-proposal-class-properties",
    ], filename: './source.ts'
};

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "./", "source.ts");
const fdr = fs.readFileSync(file, "utf8", function(err, data) {
  return data;
});

describe("babel-plugin-preserve-arrow-function-to-string", () => {
    it("should redeclare arrow to string", () => {
        const { code } = transform(fdr, conf);
        console.log(code);
        expect(code).not.toEqual(fdr);
        expect(code).toContain("premises_length");
        eval(code);
    });
});
