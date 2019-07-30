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
            <ul class="outer">
                <li v-for="(item,index) in blocks" class="item" :key="index">
                    <div class="part top">
                        <section class="left bold">
                            SHARD
                        </section>
                        <section class="right">#
                            <span class="bold">{{index}}</span>
                        </section>
                    </div>
                    <div class="part line">
                        <div class="up">
              <span>
                HEIGHT</span>
                            <span class="balance">{{item.number0}}</span>
                        </div>
                        <div class="bottom">
              <span>
                HASH</span>
                            <span class="hash">{{item.hash0}}</span>
                        </div>
                    </div>
                    <div class="part line">
                        <div class="up">
              <span>
                HEIGHT</span>
                            <span class="balance">{{item.number1}}</span>
                        </div>
                        <div class="bottom">
              <span>
                HASH</span>
                            <span class="hash">{{item.hash1}}</span>
                        </div>
                    </div>
                    <div class="part">
                        <div class="up">
              <span>
                HEIGHT</span>
                            <span class="balance">{{item.number2}}</span>
                        </div>
                        <div class="bottom">
              <span>
                HASH</span>
                            <span class="hash">{{item.hash2}}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <section class="creat center">
            <div class="name">
                Create Wallet
            </div>
            <p class="production"> Create the wallet address to test the function </p>
            <button class="ceratedone" @click="create">Create</button>
            <div class="information">
                <p class="title">
                    Address
                </p>
                <p class="address">
                    <span>{{address}}</span>
                    <span v-clipboard="address
  " v-clipboard:success="copysuccess" v-clipboard:error="copyerror">Copy</span>
                </p>
            </div>
            <div class="information">
                <p class="title">
                    Private Key
                </p>
                <p class="address">
                    <span>{{privateKey}}</span>
                    <span v-clipboard="privateKey
  " v-clipboard:success="copysuccess" v-clipboard:error="copyerror">Copy</span>
                </p>
            </div>
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
            <p class="production"> Create the wallet address to test the function </p>
            <p class="balance">
        <span class="result" v-if="balance">
          Balance {{ balance}} co
            <p>(1 co is 0.00000001 YEE)</p>
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
                <p class="production">The address which your will transfer YEE to</p>
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
            Token amount that you want it transfer
        </section>
    </section>
</template>
<script>
    import axios from 'axios';
    import api from '../lib/api';
    import runtime from '../lib/runtime.js';

    export default {
        components: {},
        data() {
            return {
                value: '复制的内容',
                link: [
                    'PARTNER PROGRAM',
                    'CONTACT US',
                    'EN'
                ],
                blocks: [
                    {
                        number0: '',
                        number1: '',
                        number2: '',
                        hash0: '',
                        hash1: '',
                        hash2: '',
                    },
                    {
                        number0: '',
                        number1: '',
                        number2: '',
                        hash0: '',
                        hash1: '',
                        hash2: '',
                    },
                    {
                        number0: '',
                        number1: '',
                        number2: '',
                        hash0: '',
                        hash1: '',
                        hash2: '',
                    },
                    {
                        number0: '',
                        number1: '',
                        number2: '',
                        hash0: '',
                        hash1: '',
                        hash2: '',
                    }
                ],
                address: '',
                privateKey: '',

                //queryAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                queryAddress: '',
                balance: '',


                // sendAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                // sendPrivateKey: '0x98319d4ff8a9508c4bb0cf0b5a78d760a0b2082c02775e6e82370816fedfff48925a225d97aa00682d6a59b95b18780c10d7032336e88f3442b42361f4a66011',
                // dest: '5EtYZwFsQR2Ex1abqYFsmTxpHWytPkphS1LDsrCJ2Gr6b695',
                // amount: '100',
                sendAddress: '',
                sendPrivateKey: '',
                dest: '',
                amount: '',

                showResult: false,
                result: '',
                success: false
            };
        },
        computed: {},
        created() {
            this.initRuntime()
            this.repeat()
        },
        methods: {
            initRuntime() {
                runtime.initRuntime()
                window.calls = runtime.calls
                window.api = api
                window.runtime = runtime
            },
            repeat() {
                let that = this
                for (let i = 0; i < 4; i++) {
                    that.refreshRecentBlocks(i)
                    setInterval(() => {
                        that.refreshRecentBlocks(i)
                    }, 20000)
                }
            },
            refreshRecentBlocks(shardNum) {
                let that = this
                api.utils.getRecentBlocks(shardNum).then(
                    (res) => {
                        console.log('res:', res)
                        that.blocks.splice(shardNum, 1, {
                            number0: res[0]['number'],
                            number1: res[1]['number'],
                            number2: res[2]['number'],
                            hash0: api.utils.getDisplayHash(res[0]['hash']),
                            hash1: api.utils.getDisplayHash(res[1]['hash']),
                            hash2: api.utils.getDisplayHash(res[2]['hash']),
                        })
                        //console.log('blocks: ', that.blocks)
                    }
                ).catch(
                    (res) => {
                    }
                )
            },
            copysuccess() {
                this.$alert('success')
            },
            copyerror() {
                this.$alert('error')
            },
            create() {
                console.log('creat account')
                let pair = api.utils.generateSrKeyPair()
                this.address = ss58Encode(api.utils.srKeypairToPublic(pair))
                this.privateKey = '0x' + bytesToHex(api.utils.srKeypairToSecret(pair))
            },
            check() {
                console.log('check')
                let that = this
                that.balance = ''
                api.rpcCall('state_getBalance', [this.queryAddress]).then(
                    (res) => {
                        that.balance = eval(res.data.result)
                        console.log(eval(res.data.result))
                    }).catch(
                    (res) => {
                        console.log(res)
                    }
                )
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

                let sendShardNum = api.utils.getShardNum(that.sendAddress)
                let destShardNum = api.utils.getShardNum(that.dest)
                console.log('sendShardNum', sendShardNum)
                console.log('destShardNum', destShardNum)

                if (sendShardNum != destShardNum) {
                    that.result = 'From address and to address should be in the same shard'
                    that.showResult = true
                    return
                }

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
                        api.utils.composeTransaction(that.sendAddress, secret, call)
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
            justify-content: center;

            .item {
                margin 0 25px
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 240px;
                height: 300px;
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
                            font-weight: 600;
                        }
                    }

                    &.line {
                        padding: 10px 0px;
                        width: 80%;
                        border-bottom: 1px solid #aeb1b6;
                        box-sizing: content-box;
                    }

                    .up, .bottom {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;

                        .balance {
                            font-size: 20px;
                            font-weight: 600;
                            color: #444;
                        }
                    }
                }
            }
        }
    }

    .creat {
        padding-top: 120px;
        &.balance, &.transfer {
            padding-top: 80px
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
            padding: 8px 25px;
            color: #fff;
            font-weight: 600;
            background: #2e394b;
            border: none;
            cursor: pointer;
        }

        .information {
            padding: 5px 0;

            .title {
                font-size: 18px;
                color: #2e394b;
                font-weight: 600;
                .innertitle {
                    display inline-block
                    padding: 0 10px
                    position relative
                    top: 12px;
                    left 10px
                    background #fff
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
                border-bottom: 1px solid #333;

                &.success {
                    color: green;
                    border-bottom: 1px solid green;
                }

                &.error {
                    color: red;
                    border-bottom: 1px solid red;
                }

                p {
                    margin-top: 20px;
                }
            }
        }
    }

    .bottominfo {
        width: 100%;
        padding: 200px 0 40px;
        color: #fff;
        text-align: center;
        background: #323d4c;
    }
</style>