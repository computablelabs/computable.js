import { Contract } from '../../node_modules/web3/types.d'

export async function commitVote(
  voting:Contract,
  pollID:string,
  voter:string,
  vote:string = '1',
  tokens:string = '10',
  salt:string = '420',
): Promise<any> {

}

function getVoteSaltHash(vote:string, salt:string): string {
  // TODO once voting contract has been spec'd
  return ''
}
