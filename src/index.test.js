import { transform } from "@babel/core";

const conf = {
    presets: [["@babel/preset-env"]],
    plugins: ["./src/index.js"]
};
describe("babel-plugin-preserve-arrow-function-to-string", () => {
    it("should redeclare arrow toString", () => {
        const input =
            "\n" +
            'let t = { a: { b: { c: "Test" } } };' +
            "function testFunc(a, b) { b(a) };" +
            "testFunc(t, test => test.a.b.c);";
        const { code } = transform(input, conf);
        expect(code).not.toEqual(input);
        // var result = eval(code);
        // expect(result.toString()).toEqual(input);
    });
    it("should not redeclare function toString", () => {
        const input = 'function test() { console.log("test") }';
        const { code } = transform(input, conf);
        expect(eval(code).toString).toEqual("".toString);
    });
});
