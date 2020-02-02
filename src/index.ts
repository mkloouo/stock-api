import Application from "./app";

new Application().start((hostname: string, port: number) => {
    console.log(`express app started listening on ${hostname}:${port}`);
});
