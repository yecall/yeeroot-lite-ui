<template>
    <section>
        <section class="headertop">
            <header class="header center">
                <div class="left">
                    <img src="../assets/img/logo.png" alt="">
                    <span>
            YeeCo POCNET
          </span>
                </div>
                <div class="right">
                    <a href="https://www.yeeco.io/">
                        YeeCo Official
                    </a>
                    <a href="https://pocnet.yeescan.org/">
                        YeeCo Explorer
                    </a>
                    <a href="https://github.com/yeeco/yeeroot/issues/new" class="last">
                        Feedback
                    </a>
                </div>
            </header>
        </section>
        <section class="content">
            <ul class="outer center">
                <li v-for="(item,index) in blocks" class="item" :key="index">
                    <div class="part top">
                        <section class="left bold">
                            SHARD
                        </section>
                        <section class="right">#
                            <span class="bold">{{index}}</span>
                        </section>
                    </div>
                    <div v-for="(subItem, subIndex) in item" :class=" subIndex===item.length-1 ? 'part' : 'part line'">
                        <div class="up">
                            <span> NUMBER</span>
                            <span class="balance"><a :href="explorer + 'block/' + index + '-' + subItem.number ">{{subItem.number}}</a></span>
                        </div>
                        <div class="up">
                            <span>HASH</span>
                            <span class="hash">{{subItem.hash}}</span>
                        </div>
                        <div class="up">
                            <span>MPMR</span>
                            <template v-if="subItem.number">
                                <span :class="'hash mpmr-' + subItem.mpmrId" v-if="subItem.mpmr">{{subItem.mpmr}}</span>
                                <span class="hash" v-else>Not multi-mined</span>
                            </template>
                        </div>
                        <div class="up">
                            <span>FBN</span>
                            <span class="hash">{{subItem.fbn}}</span>
                        </div>
                        <div class="bottom">
                            <span>TIME</span>
                            <span class="hash">
                                <vueDateFormat v-if="subItem.number" format="hh:mm:ss dd/MM" :time="subItem.time"
                                               type="fmt"
                                               :autoUpdate="false"></vueDateFormat>
                          </span>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <section>
            <div class="block-tip center" style="padding-top:100px;">
                <p>* MPMR: Short for "Multi proof merkle root". Blocks of different shards with the same MPMR were mined
                    at the same time by a multi miner. </p>
                <p>* FBN: Short for "Finalized block number". </p>
            </div>
        </section>
        <section class="creat center">
            <div class="name">
                Create Wallet
            </div>
            <p class="production"> Create the wallet address </p>
            <button class="ceratedone" @click="createaccount">Create</button>
            <div class="information">
                <p class="title">
                    Address
                </p>
                <p class="address">
                    <span>{{address}}</span>
                    <span class="copy" v-clipboard:copy="address" v-clipboard:success="copysuccess"
                          v-clipboard:error="copyerror">Copy</span>
                </p>
            </div>
            <div class="information">
                <p class="title">
                    Private Key
                </p>
                <p class="address privatekey">
                    <span class="privatekeytext">{{privateKey}}</span>
                    <span class="copy" v-clipboard:copy="privateKey" v-clipboard:success="copysuccess"
                          v-clipboard:error="copyerror">Copy</span>
                </p>
            </div>
            <div>This page will not store your private key, please back up it by yourself for further use.</div>
        </section>
        <!-- check origin balance start -->
        <section class="creat center balance">
            <div class="name">
                Check Balance
            </div>
            <div class="information">
                <p class="title">
                  <span class="innertitle">
                    Address
                  </span>
                </p>
                <p class="address input">
                    <input class="input" type="text" v-model="queryAddress">
                </p>
            </div>
            <p class="production"> Check the balance of the address ( 1 co is 0.00000001 YEE ) </p>
            <p class="balance">
                <span class="result" v-if="balance!==''">
                  Balance is {{ balance}} co , Nonce is {{nonce}}, Shard num is {{shardNum}}
                </span>
            </p>
            <button class="ceratedone" @click="check">Check</button>
        </section>
        <!-- check origin balance end -->
        <section class="creat center transfer">
            <div class="name">
                Transfer
            </div>
            <div class=" information">
                <p class="title">
          <span class="innertitle">
            From address
          </span>
                </p>
                <input class="input" type="text" v-model="sendAddress">
                <p class="production">Your wallet address</p>
            </div>
            <div class=" information">
                <p class="title">
          <span class="innertitle">
            Private Key
          </span>
                </p>
                <input class="input" type="text" v-model="sendPrivateKey">
                <p class="production">Your wallet private key</p>
            </div>
            <div class=" information">
                <p class="title">
          <span class="innertitle">
            To Address
          </span>
                </p>
                <input class="input" type="text" v-model="dest">
                <p class="production">The address which your will transfer to</p>
            </div>
            <div class=" information">
                <p class="title">
          <span class="innertitle">
            Amount
          </span>
                </p>
                <input class="input" type="text" v-model="amount">
                <p class="production">Amount that your want it transfer (in co)</p>
            </div>
            <p class="balance ">
        <span class="result" v-if="showResult" :class="{success:success}">
          {{result}} <a :href="explorer + 'transfer/' + balanceTransferHash ">Go To Explorer</a>
        </span>
            </p>
            <button class="ceratedone" @click="transfer">Transfer</button>
        </section>

        <!-- Create Asset start -->
        <section class="creat center create_asset">
            <div class="name">
                Create Asset
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Asset name
                  </span>
                </p>
                <input class="input" type="text" v-model="assetName">
                <p class="production">* Max size: 16 bytes.</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Total Supply
                  </span>
                </p>
                <input class="input" type="text" v-model="totalSupply">
                <p class="production">* Total supply for this asset.</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Decimals
                  </span>
                </p>
                <input class="input" type="text" v-model="assetDecimals">
                <p class="production">* Decimals for this asset.</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Issuer Address
                  </span>
                </p>
                <input class="input" type="text" v-model="assetIssuer">
                <p class="production">* Please input issuer address.</p>
            </div>
            <div class=" information">
                <p class="title">
                    <span class="innertitle">Issuer Private Key</span>
                </p>
                <input class="input" type="text" v-model="assetIssuerPrvKey"/>
                <p class="production">* Please input issuer private key.</p>
            </div>
            <p class="balance ">
                <span class="result" v-if="showAssetIssueResult" :class="{success:success}">
                  {{assetCreateResult}} <a :href="explorer + 'transfer/' + assetIssueHash ">Go To Explorer</a>
                </span>
            </p>
            <button class="ceratedone" @click="new_asset">Create</button>
        </section>
        <!-- Create Asset end -->
        <!-- Transfer Asset start -->
        <section class="creat center transfer_asset">
            <div class="name">
                Asset Transfer
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Shard Code
                  </span>
                </p>
                <input class="input" type="text" v-model="assetTransferShard">
            </div>
            <p class="production"> Asset shard code for which shard the asset issued. </p>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Asset Id
                  </span>
                </p>
                <input class="input" type="text" v-model="assetTransferId">
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    From
                  </span>
                </p>
                <input class="input" type="text" v-model="assetFrom">
                <p class="production">Your wallet address</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Private Key
                  </span>
                </p>
                <input class="input" type="text" v-model="assetPrivateKey">
                <p class="production">Your wallet private key</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    To
                  </span>
                </p>
                <input class="input" type="text" v-model="assetTo">
                <p class="production">The address which your will transfer to</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Amount
                  </span>
                </p>
                <input class="input" type="text" v-model="assetAmount">
            </div>
            <p class="balance ">
                <span class="result" v-if="showAssetTransferResult" :class="{success:success}">
                  {{assetTransferResult}} <a :href="explorer + 'transfer/' + assetTransferHash ">Go To Explorer</a>
                </span>
            </p>
            <button class="ceratedone" @click="transfer_asset">Transfer</button>
        </section>
        <!-- Transfer Assets end -->
        <!-- check asset balance start -->
        <section class="creat center balance">
            <div class="name">
                Check Asset Balance
            </div>
            <div class="information">
                <p class="title">
                  <span class="innertitle">
                    Address
                  </span>
                </p>
                <p class="address input">
                    <input class="input" type="text" v-model="queryAssetAddress">
                </p>
            </div>
            <p class="production"> Check the balance of the address </p>
            <div class="information">
                <p class="title">
                  <span class="innertitle">
                    Shard Code
                  </span>
                </p>
                <p class="address input">
                    <input class="input" type="text" v-model="queryAssetShard">
                </p>
            </div>
            <p class="production"> Asset shard code for which shard the asset issued. </p>
            <div class="information">
                <p class="title">
                  <span class="innertitle">
                    Asset Id
                  </span>
                </p>
                <p class="address input">
                    <input class="input" type="text" v-model="queryAssetId">
                </p>
            </div>
            <p class="balance">
                <span class="result" v-if="assetBalance!==''">
                  Balance is {{ assetBalance}}, Shard num is {{assetShardNum}}
                </span>
            </p>
            <button class="ceratedone" @click="check_asset">Check</button>
        </section>
        <!-- check asset balance end -->
        <!-- asset detail start -->
        <section class="creat center balance">
            <div class="name">
                Asset Detail
            </div>
            <div class="information">
                <p class="title">
                  <span class="innertitle">
                    Shard Number
                  </span>
                </p>
                <p class="address input">
                    <input class="input" type="text" v-model="detailAssetShard">
                </p>
            </div>
            <div class="information">
                <p class="title">
                  <span class="innertitle">
                    Asset Id
                  </span>
                </p>
                <p class="address input">
                    <input class="input" type="text" v-model="detailAssetId">
                </p>
            </div>
            <p class="balance ">
                <span class="result" v-if="showResult" :class="{success:success}">
                  {{detailAssetResult}}
                </span>
            </p>
            <button class="ceratedone" @click="asset_detail">Click</button>
        </section>
        <!-- asset detail end -->

        <section class="bottominfo">
            <div class="footer">
                <a v-for="(item,index) in linkdata" :href="item.href" :class="item.class" :key="index"></a>
            </div>
            &copy;2019 YeeCo
        </section>
    </section>
</template>
<script>
    import api from '../lib/api';
    import runtime from '../lib/runtime.js';

    export default {
        components: {},
        data() {
            return {
                value: '',
                link: [
                    'PARTNER PROGRAM',
                    'CONTACT US',
                    'EN'
                ],
                blocks: [
                    [
                        {},
                        {},
                        {}
                    ],
                    [
                        {},
                        {},
                        {}
                    ],
                    [
                        {},
                        {},
                        {}
                    ],
                    [
                        {},
                        {},
                        {}
                    ]
                ],
                address: '',
                privateKey: '',

                queryAddress: '',
                balance: '',
                nonce: '',
                shardNum: '',

                sendAddress: '',
                sendPrivateKey: '',
                dest: '',
                amount: '',

                assetName: '',
                assetId: '',
                assetIssuer: '',
                assetIssuerPrvKey: '',
                assetDecimals: '',
                totalSupply: '',
                assetCreateResult: '',

                assetTransferShard: '',
                assetTransferId: '',
                assetFrom: '',
                assetPrivateKey: '',
                assetTo: '',
                assetAmount: '',
                assetTransferResult: '',
                showAssetIssueResult: false,
                showAssetTransferResult: false,

                balanceTransferHash: '',
                assetIssueHash: '',
                assetTransferHash: '',

                queryAssetShard: '',
                queryAssetAddress: '',
                queryAssetId: '',
                assetBalance: '',
                assetShardNum: '',

                detailAssetShard: '',
                detailAssetId: '',
                detailAssetResult: '',

                showResult: false,
                result: '',
                success: false,
                linkdata: [
                    {
                        class: 'twitter',
                        link: 'https://twitter.com/YeeCoOfficial',

                    },
                    {
                        class: 'steemit',
                        link: 'https://steemit.com/@yeefoundation'
                    },
                    {
                        class: 'telegram',
                        link: 'https://t.me/yeeofficialgroup',
                    }
                    ,
                    {
                        class: 'facebook',
                        link: 'https://www.facebook.com/YeeToken/',
                    }
                    ,
                    {
                        class: 'reddit',
                        link: 'https://www.reddit.com/user/yeetoken',
                    },
                    {
                        class: 'medium',
                        link: 'https://medium.com/@yeefoundation',
                    },

                    {
                        class: 'bitcointalk',
                        link: 'https://bitcointalk.org/index.php?topic=271453',
                    }
                ],
                explorer: "http://pocnet.yeescan.org/"
            };
        },
        computed: {},
        created() {
            this.initDevIfNeeded()
            this.initRuntime()
            this.repeat()
        },
        methods: {
            initDevIfNeeded() {
                let devMode = window.location.href.search("localhost") != -1
                if (devMode) {
                    this.queryAddress = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl'
                    this.sendAddress = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl'
                    this.sendPrivateKey = 'a8666e483fd6c26dbb6deeec5afae765561ecc94df432f02920fc5d9cd4ae206ead577e5bc11215d4735cee89218e22f2d950a2a4667745ea1b5ea8b26bba5d6'
                    this.dest = 'tyee15zphhp8wmtupkf3j8uz5y6eeamkmknfgs6rj0hsyt6m8ntpvndvsmz3h3w'
                    this.amount = 1000

                    this.assetFrom = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl';
                    this.assetTo = 'tyee15zphhp8wmtupkf3j8uz5y6eeamkmknfgs6rj0hsyt6m8ntpvndvsmz3h3w';
                    this.assetPrivateKey = 'a8666e483fd6c26dbb6deeec5afae765561ecc94df432f02920fc5d9cd4ae206ead577e5bc11215d4735cee89218e22f2d950a2a4667745ea1b5ea8b26bba5d6';
                    this.assetAmount = 1000;

                    this.assetName = 'test-asset';
                    this.assetIssuer = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl';
                    this.assetIssuerPrvKey = 'a8666e483fd6c26dbb6deeec5afae765561ecc94df432f02920fc5d9cd4ae206ead577e5bc11215d4735cee89218e22f2d950a2a4667745ea1b5ea8b26bba5d6';
                    this.assetDecimals = 9;
                    this.totalSupply = '1234567890';

                    this.assetTransferShard = '5c70';
                    this.queryAssetShard = '5c70';
                }
            },
            initRuntime() {
                runtime.initRuntime()
                window.calls = runtime.calls
                window.api = api
                window.runtime = runtime
            },
            repeat() {
                let that = this
                that.refreshRecentBlocks()
                setInterval(() => {
                    that.refreshRecentBlocks()
                }, 20000)
            },
            refreshRecentBlocks() {
                let that = this
                let count = 4;

                let ps = []
                for (let i = 0; i < count; i++) {
                    ps.push(that.refreshRecentBlocksPromise(i));
                }

                Promise.all(ps).then(
                    (res) => {
                        console.log(res)

                        let blocks = []

                        for (let i = 0; i < count; i++) {
                            let shardRes = res[i]
                            let blocksOfShard = [
                                {
                                    number: '',
                                    hash: '',
                                    mpmr: '',
                                    time: '',
                                },
                                {
                                    number: '',
                                    hash: '',
                                    mpmr: '',
                                    time: '',
                                },
                                {
                                    number: '',
                                    hash: '',
                                    mpmr: '',
                                    time: '',
                                }
                            ]
                            if (!(shardRes.data && shardRes.data.error)) {
                                blocksOfShard = shardRes
                            }
                            blocks.push(blocksOfShard)
                        }

                        //check same mpmr
                        let mpmrMap = {}
                        for (let i in blocks) {
                            for (let j in blocks[i]) {
                                let mpmr = blocks[i][j].mpmr
                                if (mpmr) {
                                    if (mpmrMap[mpmr]) {
                                        mpmrMap[mpmr]++
                                    } else {
                                        mpmrMap[mpmr] = 1
                                    }
                                }
                            }
                        }
                        let mpmrList = []
                        for (let i in mpmrMap) {
                            mpmrList.push({mpmr: i, count: mpmrMap[i]})
                        }
                        mpmrList.sort((a, b) => {
                            return b.count - a.count
                        })

                        console.log(mpmrList)

                        mpmrMap = {}
                        for (let i in mpmrList) {
                            mpmrMap[mpmrList[i]['mpmr']] = i
                        }

                        console.log(mpmrMap)

                        for (var i in blocks) {
                            for (var j in blocks[i]) {
                                let mpmr = blocks[i][j].mpmr
                                if (mpmr) {
                                    blocks[i][j]['mpmrId'] = mpmrMap[mpmr]
                                }
                            }
                        }
                        console.log(blocks)

                        for (let i = 0; i < count; i++) {
                            that.blocks.splice(i, 1, blocks[i])
                        }
                    }
                ).catch(
                    (res) => {
                    }
                )
            },
            refreshRecentBlocksPromise(shardNum) {
                return new Promise((resolve, reject) => {
                    let that = this
                    api.utils.getRecentBlocks(shardNum).then(
                        (res) => {
                            console.log('res:', res)
                            let count = 3;
                            let blocksOfShard = [];
                            for (let i = 0; i < count; i++) {

                                let number = res[i]['number']
                                let hash = api.utils.getDisplayHash(res[i]['hash'])
                                let seal = null
                                let finalityTracker = null;
                                if (res[i]['digest'] && res[i]['digest']['logs']) {
                                    for (let digestItem in res[i]['digest']['logs']) {
                                        digestItem = res[i]['digest']['logs'][digestItem]
                                        if (seal == null) {
                                            seal = api.utils.decodePowSeal(digestItem)
                                        }
                                        if (finalityTracker == null) {
                                            finalityTracker = api.utils.decodeFinalityTracker(digestItem)
                                        }
                                    }
                                }
                                let mpmr = seal != null && seal.workProofType == 2 ? api.utils.getDisplayHash('0x' + seal.workProof.merkleRoot) : null
                                let fbn = finalityTracker != null ? finalityTracker.finalizedBlockNumber : null
                                let time = seal != null ? new Date(seal.timestamp) : null
                                blocksOfShard.push({
                                    number,
                                    hash,
                                    mpmr,
                                    fbn,
                                    time
                                })
                            }
                            resolve(blocksOfShard)
                        }
                    ).catch(
                        (res) => {
                            resolve(res)
                        }
                    )
                })
            },
            copysuccess() {
                // console.log(arguments)
                // this.$alert('success')
            },
            copyerror() {
                // console.log(value)
                // this.$alert('error')
            },
            createaccount() {
                console.log('creat account')
                let pair = api.utils.generateSrKeyPair()
                this.address = api.utils.bech32Encode(api.utils.srKeypairToPublic(pair))
                this.privateKey = '0x' + bytesToHex(api.utils.srKeypairToSecret(pair))
            },
            check() {
                let that = this;
                that.balance = '';

                Promise.all([api.rpcCall('state_getBalance', [that.queryAddress]), api.rpcCall('state_getNonce', [that.queryAddress])]).then(
                    (res) => {
                        that.balance = eval(res[0].data.result);
                        that.nonce = eval(res[1].data.result);
                        that.shardNum = api.utils.getShardNum(api.utils.bech32Decode(that.queryAddress))
                    }).catch((res) => {
                    console.log(res)
                })
            },
            transfer() {
                let that = this
                that.result = ''
                that.showResult = false
                that.success = false

                if (that.sendAddress == '' || that.sendPrivateKey == '' || that.dest == '' || that.amount == '') {
                    that.result = 'Please fill all'
                    that.showResult = true
                    return
                }

                if (that.amount < 1000) {
                    that.result = 'The amount should not be less than 1000'
                    that.showResult = true
                    return
                }

                let sendShardNum = api.utils.getShardNum(that.sendAddress)
                let destShardNum = api.utils.getShardNum(that.dest)
                console.log('sendShardNum', sendShardNum)
                console.log('destShardNum', destShardNum)

                if (!api.utils.isIntNum(that.amount)) {
                    that.result = 'Amount should be a integer'
                    that.showResult = true
                    return
                }

                let descPublic = api.utils.bech32Decode(that.dest)
                let senderPublic = api.utils.bech32Decode(that.sendAddress)
                let secret = hexToBytes(that.sendPrivateKey)
                console.log('descPublic:', descPublic)
                api.utils.runInBalancesTransferCall(
                    descPublic,
                    that.amount,
                    calls,
                    (call) => {
                        api.utils.composeTransaction(senderPublic, secret, call).then((result) => {
                            that.balanceTransferHash = result.data.result;
                            that.result = 'Transfer successfully'
                            that.showResult = true
                            that.success = true
                        }).catch((res) => {
                            that.result = 'Something is wrong'
                            that.showResult = true
                            that.success = false
                        })
                    }
                )
            },
            // for asset
            new_asset() {
                let that = this;
                that.assetCreateResult = '';
                that.success = false;
                that.showAssetIssueResult = false;

                if (that.assetName == '' || that.assetDecimals == '' || that.assetIssuer == '' || that.totalSupply == '' || that.assetIssuerPrvKey == '') {
                    that.assetCreateResult = 'Please fill all field.'
                    that.showAssetIssueResult = true;
                    return
                }

                if (!api.utils.isIntNum(that.assetDecimals)) {
                    that.assetCreateResult = 'Decimals should be a integer'
                    that.showAssetIssueResult = true
                    return
                }

                let shardNum = api.utils.getShardNum(that.assetIssuer);
                console.log('issuer sharding number: ', shardNum);
                let issuerPublic = api.utils.bech32Decode(that.assetIssuer)
                let secret = hexToBytes(that.assetIssuerPrvKey);

                let name = stringToBytes(that.assetName);
                api.utils.runInIssueAssetCall(
                    name,
                    that.totalSupply,
                    that.assetDecimals,
                    calls,
                    (call) => {
                        api.utils.composeTransaction(issuerPublic, secret, call).then((result) => {
                            that.assetIssueHash = result.data.result;
                            that.assetCreateResult = 'Asset create successfully';
                            that.showAssetIssueResult = true;
                            that.success = true
                        }).catch((res) => {
                            that.assetCreateResult = 'Something is wrong' + res;
                            that.showAssetIssueResult = true;
                            that.success = false;
                        })
                    }
                );
            },
            transfer_asset() {
                let that = this;
                that.assetTransferResult = '';
                that.success = false;
                that.showAssetTransferResult = false;

                if (that.assetTransferShard == '' || that.assetTransferId == '' || that.assetFrom == '' || that.assetTo == '' ||
                    that.assetAmount == '' || that.assetPrivateKey == '') {
                    that.assetTransferResult = 'Please fill all field';
                    that.showAssetTransferResult = true;
                    return
                }

                if (!api.utils.isIntNum(that.assetTransferId)) {
                    that.assetTransferResult = 'Asset Id should be a integer';
                    that.showAssetTransferResult = true;
                    return
                }

                if (!api.utils.isIntNum(that.assetAmount)) {
                    that.assetTransferResult = 'Amount should be a integer';
                    that.showAssetTransferResult = true;
                    return
                }
                let shardNumFrom = api.utils.getShardNum(that.assetFrom);
                let shardNumTo = api.utils.getShardNum(that.assetTo);
                console.log('transfer asset from sharding: ', shardNumFrom);
                console.log('transfer asset to sharding: ', shardNumTo);

                let fromPublic = api.utils.bech32Decode(that.assetFrom);
                let secret = hexToBytes(that.assetPrivateKey);
                let toPublic = api.utils.bech32Decode(that.assetTo);

                api.utils.runInAssetTransferCall(
                    hexToBytes(that.assetTransferShard),
                    that.assetTransferId,
                    toPublic,
                    that.assetAmount,
                    calls,
                    (call) => {
                        api.utils.composeTransaction(fromPublic, secret, call).then((result) => {
                            that.assetTransferHash = result.data.result;
                            that.assetTransferResult = 'Asset transfer successfully';
                            that.showAssetTransferResult = true;
                            that.success = true;
                        }).catch((res) => {
                            that.assetTransferResult = 'Something is wrong';
                            that.showAssetTransferResult = true;
                            that.success = false;
                        });
                    }
                )
            },
            check_asset() {
                let that = this;
                that.assetBalance = '';
                that.assetShardNum = '';
                if (that.queryAssetShard == '' || that.queryAssetAddress == '' || that.queryAssetId == '') {
                    return;
                }
                let shardCode = hexToBytes(that.queryAssetShard);
                Promise.all([api.rpcCall('state_getAssetBalance', [that.queryAssetAddress, that.queryAssetShard, parseInt(that.queryAssetId)])]).then(
                    (res) => {
                        that.assetBalance = eval(res[0].data.result);
                        that.assetShardNum = api.utils.getShardNum(api.utils.bech32Decode(that.queryAssetAddress));
                    }
                ).catch(
                    (res) => {
                        console.log('check_asset failed:');
                        console.log(res);
                    }
                );
            },
            asset_detail() {
                let that = this;
                if (that.detailAssetShard == '' || that.detailAssetId == '') {
                    that.detailAssetResult = 'Please fill all field';
                    that.showResult = true;
                    return
                }
                if (!api.utils.isIntNum(that.detailAssetShard)) {
                    that.detailAssetResult = 'Shard Number should be a integer';
                    that.showResult = true;
                    return
                }
                if (!api.utils.isIntNum(that.detailAssetId)) {
                    that.detailAssetResult = 'Asset Id should be a integer';
                    that.showResult = true;
                    return
                }
                let BytesToString = function (array){
                    let str = "";
                    for (let i = 0; i < array.length; i++) {
                        str += String.fromCharCode(array[i]);
                    }
                    return str
                };
                Promise.all([api.rpcCall('state_getAssetDetail', [parseInt(that.detailAssetShard), parseInt(that.detailAssetId)])]).then(
                    (res) => {
                        let detail = eval(res[0].data.result);
                        detail.Issuer = api.utils.bech32Encode(detail.Issuer);
                        detail.Name = BytesToString(eval(detail.Name));
                        detail.TotalSupply = eval(detail.TotalSupply);
                        detail.ShardCode = bytesToHex(eval(detail.ShardCode));

                        that.detailAssetResult = detail;
                        that.showResult = true;
                    }
                ).catch(
                    (res) => {
                        console.log('asset_detail failed:');
                        console.log(res)
                    }
                );
            },
        }
    }
</script>
<style scoped lang="stylus">
    .center {
        margin: 0 auto;
        width: 1000px;
    }

    .header {
        padding: 20px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: #444;

        .left {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-weight: 800;

            img {
                width: 36px;
                height: 36px;
                margin-right: 20px;
            }
        }

        .right a {
            color: #444;
            padding: 0 10px;
            border-right: 1px solid #444;

            &:hover {
                color: #333;
                text-decoration: none;
            }

            &.last {
                border-right: none;
            }
        }
    }

    .content {
        width: 100%;
        background: #323d4c;
        color: #333;

        .outer {
            position: relative;
            top: 80px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .item {
                // margin: 0 25px;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 220px;
                background: #fff;
                box-sizing: border-box;
                box-shadow: 0px 2px 3px #e4e4e4;

                .part {
                    padding: 15px 20px;
                    width: 100%;
                    display: flex;
                    color: #606266;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    background: #fff;
                    box-sizing: border-box;

                    &.top {
                        flex-direction: row;
                        height: 50px;
                        color: #444;
                        background: #f7f8f8;

                        .bold {
                            font-size: 16px;
                            font-weight: 600;

                            &.shard {
                                font-size: 14px;
                            }
                        }
                    }

                    &.line {
                        padding: 10px 0px;
                        width: 80%;
                        border-bottom: 1px solid #e4e4e4;
                        box-sizing: content-box;
                    }

                    .up, .bottom {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;

                        .balance {
                            height 32px
                            font-size: 18px;
                            font-weight: bolder;
                            color: #444;

                            a {
                                color: #444;
                                text-decoration: underline;
                            }
                        }

                        .hash {
                            font-size: 12px;
                            text-align: base;
                        }

                        .mpmr-0 {
                            color: #a73c12;
                        }

                        .mpmr-1 {
                            color: #1779af;
                        }

                        .mpmr-2 {
                            color: #0f9d70;
                        }

                        .mpmr-3 {
                            color: #dac112;
                        }

                        .mpmr-4 {
                            color: #20017d;
                        }
                    }
                }
            }
        }
    }

    .block-tip {
        padding-top: 100px;
    }

    .creat {
        padding-top: 60px;

        &.balance, &.transfer {
            padding-top: 80px;
        }

        .name {
            font-size: 20px;
            color: #444;
            font-weight: 600;
            border-bottom: 1px solid #e4e4e4;
        }

        .production {
            padding: 5px 0;
            color: #b5b7bc;
        }

        .ceratedone {
            margin-bottom: 20px;
            padding: 8px 40px;
            color: #fff;
            font-weight: 600;
            background: #2e394b;
            border: none;
            cursor: pointer;
        }

        .information {
            padding: 5px 0;

            .title {
                font-size: 16px;
                color: #2e394b;
                font-weight: 600;

                .innertitle {
                    display: inline-block;
                    padding: 0 10px;
                    position: relative;
                    top: 12px;
                    left: 10px;
                    background: #fff;
                }
            }

            .address {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 10px 15px;
                width: 500px;
                background: #f7f7f8;
                border: 1px solid #e4e4e4;

                &.input {
                    padding: 0 0;
                    border: none;
                    background: #fff;
                    height: 100%;
                }

                &.privatekey {
                    height: 80px;

                    .privatekeytext {
                        width: 380px;
                        word-wrap: break-word;
                        word-break: normal;
                    }
                }

                .copy {
                    cursor: pointer
                }
            }

            .input {
                width: 500px;
                height: 40px;
                line-height: 40px;
                padding: 0 10px;
                box-sizing: border-box;
            }
        }

        .balance {
            padding-bottom: 15px;

            .result {
                padding-bottom: 5px;
                font-weight: 600;
                width: 200px;

                // border-bottom: 1px solid #333;

                &.success {
                    color: green;
                    // border-bottom: 1px solid green;
                }

                &.error {
                    color: red;
                    // border-bottom: 1px solid red;
                }
            }
        }
    }

    .bottominfo {
        width: 100%;
        padding: 66px 0 53px;
        color: #fff;
        text-align: center;
        background: #323d4c;

        .footer {
            padding-bottom: 50px
            display flex
            flex-direction row
            align-items center
            justify-content: space-around

            a {
                display: inline-block;
                width: 30px;
                height: 30px;
                background-size: 100% 100%;

                &.twitter {
                    background-image: url('../assets/img/footer/ic_twitter_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_twitter_2.png');
                    }
                }

                &.steemit {
                    background-image: url('../assets/img/footer/ic_steemit_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_steemit_2.png');
                    }
                }

                &.telegram {
                    background-image: url('../assets/img/footer/ic_telegram_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_telegram_2.png');
                    }
                }

                &.facebook {
                    background-image: url('../assets/img/footer/ic_facebook_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_facebook_2.png');
                    }
                }

                &.reddit {
                    background-image: url('../assets/img/footer/ic_reddit_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_reddit_2.png');
                    }
                }

                &.medium {
                    background-image: url('../assets/img/footer/ic_medium_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_medium_2.png');
                    }
                }

                &.bitcointalk {
                    background-image: url('../assets/img/footer/ic_bitcointalk_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_bitcointalk_2.png');
                    }
                }

                &.gplus {
                    background-image: url('../assets/img/footer/ic_g+_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_g+_2.png');
                    }
                }

                &.chainnode {
                    background-image: url('../assets/img/footer/ic_chainnode_1.png');

                    &:hover {
                        background-image: url('../assets/img/footer/ic_chainnode_2.png');
                    }
                }

            }
        }
    }
</style>