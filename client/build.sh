mkdir -p public
GOOS=js GOARCH=wasm go build -o public/main.wasm
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" public/
cp -r html/* public/
