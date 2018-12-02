#!/bin/bash
yarn build:tsc
yarn build
echo "export default \`" > dist/export.ts
cat dist/main.js >> dist/export.ts
echo "\`" >> dist/export.ts
cp dist/export.ts ../qrs-signer/src/webrtc/inner.ts

