import conf from '@/config'
import axios from 'axios'
import {
    calls, runtime, chain, system, runtimeUp, ss58Decode, ss58Encode, pretty,
    addressBook, secretStore, metadata, nodeService, bytesToHex, hexToBytes, AccountId
} from 'oo7-substrate';
import { sign, verify } from '@polkadot/wasm-schnorrkel';

const api = {
    id: 0,
    request(method, path, params) {
        let url = conf.apiBase + path
        params = params || {}

        if (method === 'get') {
            return new Promise((resolve, reject) => {
                axios.get(url, {
                    params: params
                }).then(
                    res => {
                        if (res.data.error
                        ) {
                            reject(res)
                        } else {
                            resolve(res)
                        }
                    },
                    res => {
                        reject(res)
                    }
                )
            })
        } else if (method === 'post') {
            return new Promise((resolve, reject) => {
                let data = null
                if (params.body) {
                    data = params.body
                } else {
                    // data = $.param(params)
                    data = params
                }
                axios.post(url, data).then(
                    res => {
                        if (res.data.error) {
                            reject(res)
                        } else {
                            resolve(res)
                        }
                    },
                    res => {
                        reject(res)
                    }
                )
            })
        }
    },
    rpcCall(method, params) {
        return api.request('post', '/', {'jsonrpc': '2.0', 'id': api.id++, 'method': method, 'params': params})
    },
    utils: {
        isIntNum(val) {
            var regPos = /^\d+$/; // 非负整数
            if (regPos.test(val)) {
                return true;
            } else {
                return false;
            }
        }
        ,
        getDisplayHash(hash) {
            return hash.substr(0, 8) + '...' + hash.substr(hash.length - 8, hash.length)
        },
        getRecentBlocks(shardNum) {
            return new Promise((resolve, reject) => {
                api.rpcCall('chain_getHeader', [shardNum, null]).then(
                    (res) => {
                        let number = eval(res.data.result.number)
                        //console.log(number)

                        let ps = [
                            api.rpcCall('chain_getHead', [shardNum, number]),
                            api.rpcCall('chain_getHead', [shardNum, number - 1]),
                            api.rpcCall('chain_getHead', [shardNum, number - 2])
                        ]

                        Promise.all(ps).then(
                            (res) => {
                                console.log(res)
                                let ret = []
                                ret[0] = {number: number, hash: res[0].data.result}
                                ret[1] = {number: number - 1, hash: res[1].data.result}
                                ret[2] = {number: number - 2, hash: res[2].data.result}
                                resolve(ret)
                            }
                        ).catch(
                            (res) => {
                                reject(res)
                            }
                        )
                    }
                ).catch(
                    (res) => {
                        reject(res)
                    }
                )
            })
        },
        generateSrKeyPair() {
            let mnemonic = secretStore().generateMnemonic()
            let seed = srKeypairFromUri("//Alice")
            // let seed = srKeypairFromUri(mnemonic)
            return seed
        },
        srKeypairToPublic(pair) {
            return new Uint8Array(pair.slice(64, 96))
        },
        srKeypairToSecret(pair) {
            return new Uint8Array(pair.slice(0, 64))
        },
        getShardNum(address) {
            let pub = ss58Decode(address);
            if (pub == null) {
                return null
            }
            let last = pub[31]
            let mask = 0x03
            let shardNum = mask & last
            return shardNum
        },
        runInBalancesTransferCall(dest, value, calls, cb) {
            let callBond = calls.balances.transfer(dest, value)
            callBond.tie((call, i) => {
                console.log('call: ', call)
                cb(call)
                callBond.untie()
            })
        },
        composeTransaction(sender, secret, call){

            return new Promise((resolve, reject) => {

                let senderBytes = ss58Decode(sender)
                let shardNum = api.utils.getShardNum(sender)
                console.log('shardNum:', shardNum)

                api.rpcCall('chain_getHead', [shardNum, 0]).then((res) => {
                    let eraHash = hexToBytes(res.data.result)

                    console.log('eraHash: ', res.data.result, eraHash)
                    let era = new TransactionEra

                    api.rpcCall('state_getNonce', [sender]).then((res)=>{
                        let index = eval(res.data.result)
                        console.log('index: ', index)

                        let e = encode([
                            index, call, era, eraHash
                        ], [
                            'Compact<Index>', 'Call', 'TransactionEra', 'Hash'
                        ])

                        console.log('e: ', e)

                        let signature = sign(senderBytes, secret, e)
                        if (!verify(signature, e, senderBytes)) {
                            console.warn(`Signature is INVALID!`)
                            reject('sign error')
                            return
                        }
                        console.log('signature: ', signature)

                        let signedData = encode(encode({
                            _type: 'Transaction',
                            version: 0x81,
                            sender,
                            signature,
                            index,
                            era,
                            call
                        }), 'Vec<u8>')
                        let extrinsic = '0x'+bytesToHex(signedData)
                        console.log("extrinsic:", extrinsic)

                        api.rpcCall('author_submitExtrinsic', [extrinsic]).then(
                            (res)=>{
                                console.log("res:", res)
                            }
                        ).catch((res)=>{
                            reject(res)
                        })

                    }).catch((res)=>{
                        reject(res)
                    })

                }).catch((res)=>{
                    reject(res)
                })

            })

        }

    }
}

export default api