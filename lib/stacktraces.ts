export const STACKTRACES = [
  "TypeError: Cannot read properties of undefined\n  at Component.render (App.jsx:42:18)\n  at updateFunctionComponent (react-dom.js:15990)",
  "ReferenceError: tentativa is not defined\n  at checkWord (game.js:7:12)\n  at handleSubmit (game.js:33:5)",
  "SyntaxError: Unexpected token '}'\n  at wrapSafe (node:internal/modules/cjs/loader:1217)\n  at Module._compile (loader:1271:10)",
  "UnhandledPromiseRejection: 404 Not Found\n  at createError (axios/lib/core/createError.js:16)\n  at settle (axios/lib/core/settle.js:17:12)",
  "Error: ENOENT: no such file or directory\n  open '/etc/resposta.config'\n  errno: -2, syscall: 'open'",
  "MongoServerError: Document failed validation\n  collection: palavras, field: tentativa.$0\n  details: { operatorName: '$type' }",
  "PANIC: runtime error: index out of range [5] with length 5\n  goroutine 1 [running]\n  main.checkLetra() +0x89",
  "discord.errors.HTTPException: 404 Not Found (error code: 10003)\n  Unknown Channel - at handle_http_error line 429",
  "SegmentationFault (core dumped)\n  Process finished with exit code 139\n  Signal: SIGSEGV (signal 11)",
] as const;
