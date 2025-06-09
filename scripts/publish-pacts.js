import { Publisher } from "@pact-foundation/pact";
import path from "path";
import { version } from "../package.json" assert { type: "json" };
import { cwd, process } from "node:process";

// This is the version of the consumer application that is publishing the pact.
// It is recommended to use the git sha for this.
// We are using the package.json version for simplicity, but you should probably
// use process.env.GITHUB_SHA in a real CI/CD environment.
const appVersion = process.env.GITHUB_SHA || version;

const opts = {
  pactFilesOrDirs: [path.resolve(cwd(), "pacts")],
  pactBroker: process.env.PACT_BROKER_BASE_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  consumerVersion: appVersion,
  tags: ["main"], // Tag the pact with the branch name
};

new Publisher(opts)
  .publishPacts()
  .then(() => {
    console.log("Pact contract publishing complete!");
    console.log("");
    console.log(`Head over to ${process.env.PACT_BROKER_BASE_URL}`);
    console.log("to see your published contracts.");
  })
  .catch((e) => {
    console.log("Pact contract publishing failed: ", e);
    process.exit(1);
  });
