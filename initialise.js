const server = require('./server/server');

async function auth(username, role, email, password) {
  const user = await User.create({ username, email, password });
  const user_role = await Role.create({ name: role });
  await user_role.principals.create({ principalType: RoleMapping.USER, principalId: user.id });
  const login = await User.login({ email, password });
  return login.id;
};

const { spawnSync } = require("child_process");
const User = server.models.User;
const Role = server.models.Role;
const RoleMapping = server.models.RoleMapping;
const HOST = process.env.HOST || "localhost:3000";

const os = [], arch = [], distro = [], lts = [], node = [], validPlatforms = [];

async function main() {
  const adminToken = await auth("admin", "admin", "admin@gmail.com", "admin"); // TODO: set admin username, role, email, password
  const testToken  = await auth("test",  "test",  "test@gmail.com",  "test");  // TODO: set test username, role, email, password
  console.log(`\nADMIN_TOKEN: ${adminToken}\nTEST_TOKEN: ${testToken}\n\n`);

  const TOKEN = testToken;
  os.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ arch: "x64" }),
    `http://${HOST}/api/Architectures`
  ]).stdout.toString().trim());
  os.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ arch: "ppc64le" }),
    `http://${HOST}/api/Architectures`
  ]).stdout.toString().trim());
  os.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ arch: "s390x" }),
    `http://${HOST}/api/Architectures`
  ]).stdout.toString().trim());
  console.log(os);

  arch.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ os: "linux" }),
    `http://${HOST}/api/OperatingSystems`
  ]).stdout.toString().trim());
  arch.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ os: "darwin" }),
    `http://${HOST}/api/OperatingSystems`
  ]).stdout.toString().trim());
  console.log(arch);

  distro.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ distro: "ubuntu-16.04" }),
    `http://${HOST}/api/Distributions`
  ]).stdout.toString().trim());
  distro.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ distro: "macos10.13" }),
    `http://${HOST}/api/Distributions`
  ]).stdout.toString().trim());
  console.log(distro);

  lts.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ lts_version: 6 }),
    `http://${HOST}/api/LTSVersions`
  ]).stdout.toString().trim());
  lts.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ lts_version: 8 }),
    `http://${HOST}/api/LTSVersions`
  ]).stdout.toString().trim());
  console.log(lts);

  node.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ node_version: "v6.14.3", lts_version: 6}),
    `http://${HOST}/api/nodeVersions`
  ]).stdout.toString().trim());
  node.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ node_version: "v8.11.3", lts_version: 8}),
    `http://${HOST}/api/nodeVersions`
  ]).stdout.toString().trim());
  console.log(node);

  validPlatforms.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ os: "linux", arch: "x64", distro: "ubuntu-16.04"}),
    `http://${HOST}/api/ValidPlatforms`
  ]).stdout.toString().trim());
  validPlatforms.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ os: "linux", arch: "s390x", distro: "ubuntu-16.04"}),
    `http://${HOST}/api/ValidPlatforms`
  ]).stdout.toString().trim());
  validPlatforms.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ os: "linux", arch: "ppc64le", distro: "ubuntu-16.04"}),
    `http://${HOST}/api/ValidPlatforms`
  ]).stdout.toString().trim());
  validPlatforms.push(spawnSync("curl", ['-X', 'POST',
    '--header', 'Content-Type: application/json',
    '--header', 'Accept: application/json',
    '--header', `Authorization: ${TOKEN}`,
    '-d', JSON.stringify({ os: "darwin", arch: "x64", distro: "macos10.13"}),
    `http://${HOST}/api/ValidPlatforms`
  ]).stdout.toString().trim());
  console.log(validPlatforms);
  process.exit(0);
}
main();
