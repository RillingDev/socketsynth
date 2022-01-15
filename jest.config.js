module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/src/test/ts/**/*.spec.ts"],
	testPathIgnorePatterns: ["./node_modules/", "./__tests__/helper/"],
};
