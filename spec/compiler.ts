import * as path from 'path'
import * as fs from 'fs'
import * as solc from 'solc'

/**
 * Given the name of a computable solidity contract, fetch it from the computable repo's contracts
 * @param file The name of a Solidity contract without the extension
 * @returns The compiler output for that contract {bytecode, interface}
 */
function compile(file: string): {[key:string]:any} {
  const where = path.join(__dirname, '../',  `computable/contracts/${file}.sol`),
    src = fs.readFileSync(where, 'utf8');

  return solc.compile(src, 1).contracts[`:${file[0].toUpperCase()}${file.slice(1)}`];
}

export default compile
