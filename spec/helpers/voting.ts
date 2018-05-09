import Web3 from 'web3'
import { Contract } from '../../node_modules/web3/types.d'

export async function commitVote(
  web3:Web3,
  voting:Contract,
  pollID:string,
  voter:string,
  vote:string|number|boolean = 1,
  tokens:string|number = 10,
  salt:string|number = 420,
): Promise<any> {
  const hash = getVoteSaltHash(web3, vote, salt)

  await voting.methods.requestVotingRights(tokens).send({ from: voter })

  const prevPollID = await voting.methods.getInsertPointForNumTokens(voter, tokens, pollID).call(),
    tx = await voting.methods.commitVote(pollID, hash, tokens, prevPollID).send({ from: voter })

  return tx
}

function getVoteSaltHash(web3:Web3, vote:string|number|boolean, salt:string|number): string {
  //`0x${abi.soliditySHA3(['uint', 'uint'], [vote, salt]).toString('hex')}`
  return web3.utils.soliditySha3({ t: 'uint', v: vote }, { t: 'uint', v: salt })
}
