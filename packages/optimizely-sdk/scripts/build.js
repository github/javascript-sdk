/**
 * Copyright 2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

process.chdir(path.resolve(__dirname, ".."));

function exec(command, extraEnv) {
  return execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  });
}

const packageName = "optimizely.node";
const umdName = "optimizelySdk";

console.log("\nBuilding CommonJS modules...");
exec(`rollup -c scripts/config.js -i lib/index.node.js -f cjs -o dist/${packageName}.js --exports named`);

console.log("\nBuilding UMD modules...");


exec(
  `rollup -c scripts/config.js -f umd -i lib/index.browser.js -n ${umdName} -o dist/optimizely.browser.umd.js --exports named`,
  {
    BUILD_ENV: "development"
  }
);

exec(
  `rollup -c scripts/config.js -f umd lib/index.browser.js -n ${umdName} -o dist/optimizely.browser.umd.min.js --exports named`,
  {
    BUILD_ENV: "production"
  }
);
