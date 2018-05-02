import * as ganache from 'ganache-cli'
import Web3 from 'web3'
import { Contract } from '../../../node_modules/web3/types.d'
import { deployToken, deployParameterizer } from '../helpers'
import { increaseTime } from './helpers'
import { Addresses, ParameterDefaults } from '../../../src/constants'
import Bignumber from 'bignumber'

const provider:any = ganache.provider(),
  web3 = new Web3(provider)

let accounts:string[],
  eip20:Contract,
  parameterizer:Contract

// TODO this is on hold until the voting contract and its dependencies are spec'd
xdescribe('Parameterizer: challengeCanBeResolved', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    eip20 = await deployToken(web3, accounts[0])
    eip20.setProvider(provider)
    const tokenAddress = eip20.options.address

    parameterizer = await deployParameterizer(web3, accounts[0], tokenAddress, Addresses.THREE) // THREE placeholding plcr TODO
    parameterizer.setProvider(provider)

    // approve the parameterizer with the token, account[0] has all the balance atm
    await eip20.methods.approve(parameterizer.options.address, 1000000).send({ from: accounts[0] })
  })

  it('should be truthy if a challenge is ready to be resolved', async () => {
    const tx = await parameterizer.methods.proposeReparameterization('voteQuorum', 51).send({ from: accounts[0] })
    expect(tx).toBeTruthy()

    // propID is nested in the event TODO change to using the event listener when they work
    const propID = tx.events._ReparameterizationProposal.returnValues.propID

    const tx1 = await parameterizer.methods.challengeReparameterization(propID).send({ from: accounts[1] })
    expect(tx1).toBeTruthy()
    console.log(tx1)

    // await increaseTime(provider, ParameterDefaults.P_COMMIT_STAGE_LENGTH + 1)
    // await increaseTime(provider, ParameterDefaults.P_REVEAL_STAGE_LENGTH + 1)

  })

})
