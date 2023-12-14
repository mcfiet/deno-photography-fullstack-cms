bcrypt.js;
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
const password = prompt("Password:");
console.log(await bcrypt.hash(password));
