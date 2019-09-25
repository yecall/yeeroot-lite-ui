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
              <span>
                NUMBER</span>
                            <span class="balance">{{subItem.number}}</span>
                        </div>
                        <div class="up">
              <span>
                HASH</span>
                            <span class="hash">{{subItem.hash}}</span>
                        </div>
                        <div class="up">
              <span>
                MPMR</span>
                            <template v-if="subItem.number">
                                <span :class="'hash mpmr-' + subItem.mpmrId"  v-if="subItem.mpmr">{{subItem.mpmr}}</span>
                                <span class="hash" v-else>Not multi-mined</span>
                            </template>
                        </div>
                        <div class="bottom">
              <span>
                TIME</span>
                            <span class="hash">
                <vueDateFormat v-if="subItem.number" format="hh:mm:ss dd/MM" :time="subItem.time" type="fmt"
                               :autoUpdate="false"></vueDateFormat>
              </span>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <section>
            <div class="block-tip center" style="padding-top:100px;">* MPMR: Short for "Multi proof merkle root". Blocks of different shards with the same MPMR were mined at the same time by a multi miner. </div>
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
          {{result}}
        </span>
            </p>
            <button class="ceratedone" @click="transfer">Transfer</button>
        </section>
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
                    ],
                    [
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
                    ],
                    [
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
                    ],
                    [
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
                    // ,
                    // {

                    //   class: 'gplus',
                    //   link: ''
                    // }
                    // ,
                    // {
                    //   class: 'chainnode',
                    //   link: ''
                    // }


                ]
            };
        },
        computed: {},
        created() {
            //this.initDev()
            this.initRuntime()
            this.repeat()
        },
        methods: {
            initDev() {
                this.queryAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
                this.sendAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
                this.sendPrivateKey = '0x98319d4ff8a9508c4bb0cf0b5a78d760a0b2082c02775e6e82370816fedfff48925a225d97aa00682d6a59b95b18780c10d7032336e88f3442b42361f4a66011'
                this.dest = '5EtYZwFsQR2Ex1abqYFsmTxpHWytPkphS1LDsrCJ2Gr6b695'
                this.amount = 1000
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
            refreshRecentBlocks(){
                let that = this
                let count = 4;

                let ps = []
                for(let i=0; i<count; i++){
                    ps.push(that.refreshRecentBlocksPromise(i));
                }

                Promise.all(ps).then(
                    (res) => {
                        console.log(res)

                        let blocks = []

                        for(let i=0; i<count; i++){
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
                            if(!(shardRes.data && shardRes.data.error)) {
                                blocksOfShard = shardRes
                            }
                            blocks.push(blocksOfShard)
                        }

                        //check same mpmr
                        let mpmrMap = {}
                        for(let i in blocks){
                            for(let j in blocks[i]){
                                let mpmr = blocks[i][j].mpmr
                                if(mpmr){
                                    if (mpmrMap[mpmr]){
                                        mpmrMap[mpmr]++
                                    }else{
                                        mpmrMap[mpmr] = 1
                                    }
                                }
                            }
                        }
                        let mpmrList = []
                        for(let i in mpmrMap){
                            mpmrList.push({mpmr: i, count: mpmrMap[i]})
                        }
                        mpmrList.sort((a, b)=>{
                            return a.count - b.count
                        })

                        mpmrMap = {}
                        for(let i in mpmrList){
                            mpmrMap[mpmrList[i]['mpmr']] = i
                        }

                        console.log(mpmrMap)

                        for(var i in blocks){
                            for(var j in blocks[i]){
                                let mpmr = blocks[i][j].mpmr
                                if(mpmr) {
                                    blocks[i][j]['mpmrId'] = mpmrMap[mpmr]
                                }
                            }
                        }
                        console.log(blocks)

                        for(let i=0; i<count; i++) {
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
                                if (res[i]['digest'] && res[i]['digest']['logs']) {
                                    for (let digestItem in res[i]['digest']['logs']) {
                                        digestItem = res[i]['digest']['logs'][digestItem]
                                        seal = api.utils.decodePowSeal(digestItem)
                                    }
                                }
                                let mpmr = seal != null && seal.workProofType == 2 ? api.utils.getDisplayHash('0x' + seal.workProof.merkleRoot) : null
                                let time = seal != null ? new Date(seal.timestamp) : null

                                blocksOfShard.push({
                                    number,
                                    hash,
                                    mpmr,
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
                this.address = ss58Encode(api.utils.srKeypairToPublic(pair))
                this.privateKey = '0x' + bytesToHex(api.utils.srKeypairToSecret(pair))
            },
            check() {
                let that = this
                that.balance = ''

                Promise.all([api.rpcCall('state_getBalance', [that.queryAddress]), api.rpcCall('state_getNonce', [that.queryAddress])]).then(
                    (res) => {
                        that.balance = eval(res[0].data.result)
                        that.nonce = eval(res[1].data.result)
                        that.shardNum = api.utils.getShardNum(that.queryAddress)
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

                let destBytes = ss58Decode(that.dest)
                let secret = hexToBytes(that.sendPrivateKey)
                console.log('destBytes:', destBytes)
                api.utils.runInBalancesTransferCall(
                    destBytes,
                    that.amount,
                    calls,
                    (call) => {
                        api.utils.composeTransaction(that.sendAddress, secret, call).then(() => {
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
            }
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