/**
 * Typescript module definition for the SOLC compiler (solcjs)
 * TODO fill in the descriptors correctly as the "any-fied" pieces here are simply to get our test env working
 * TODO flush out the rest of the compiler's API
 */

declare module 'solc' {
  export function compile(src: any, count: number): {[key:string]:any};
}
