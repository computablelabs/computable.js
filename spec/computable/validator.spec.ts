import * as ganache from 'ganache-cli'
import Web3 from 'web3'
// symlink? copy types to @types? TODO
import { Contract } from '../../node_modules/web3/types.d'
import compile from '../compiler'

// TODO use the web3 IProvider?
const provider:any = ganache.provider()

const web3 = new Web3(provider),
  // can't destruture because interface is reserved...
  compiled = compile('Validator')

let accounts:string[], validator:Contract

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  validator = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({ data: compiled.bytecode, arguments: [] })
    .send({ from: accounts[0], gas: '1000000' })

  validator.setProvider(provider)
})

describe('Validator', () => {
  describe('Expected failures', () => {
    it('throws if called by non-owner', async () => {
      try {
        await validator.methods.addVote('foo').send({
          from: accounts[1],
        })

        // this should never be run as we should throw above
        expect(false).toBe(true)

      } catch(e) {
        expect(e).toBeTruthy()
      }
    })
  })

  it('allows the owner to vote', async () => {
    await validator.methods.addVote('foo').send({
      from: accounts[0],
    })

    const vote = await validator.methods.votes(0).call({ from: accounts[0] })
    expect(vote).toBe('foo')
  })
})
