<template>
    <section>
        <!-- send transfer start -->
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
                <input class="input" type="text" v-model="fromAddress">
                <p class="production">Your wallet address</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    Private Key
                  </span>
                </p>
                <input class="input" type="text" v-model="fromPrivateKey">
                <p class="production">Your wallet private key</p>
            </div>
            <div class=" information">
                <p class="title">
                  <span class="innertitle">
                    To Address
                  </span>
                </p>
                <input class="input" type="text" v-model="toAddress">
                <p class="production"><button class="ceratedone" @click="newToAddress">New Address</button></p>
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
                  {{result}} <a :href="explorer + 'transaction/' + balanceTransferHash ">Go To Explorer</a>
                </span>
            </p>
            <button class="ceratedone" @click="transfer">Transfer</button>
        </section>
        <!-- send transfer end -->
    </section>
</template>

<script>
    import api from '../lib/api';
    import runtime from '../lib/runtime.js';

    export default {
        name: "transfer",
        components: {},
        data() {
            return {
                fromAddress: '',
                fromPrivateKey: '',
                toAddress: '',
                amount: '',

                balanceTransferHash: '',
                explorer: '',

                showResult: false,
                result: '',
                success: false,
            };
        },
        computed: {},
        created() {
            this.init();
        },
        methods: {
            init() {
                this.fromAddress = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl';
                this.fromPrivateKey = 'a8666e483fd6c26dbb6deeec5afae765561ecc94df432f02920fc5d9cd4ae206ead577e5bc11215d4735cee89218e22f2d950a2a4667745ea1b5ea8b26bba5d6';
                this.toAddress = 'tyee15zphhp8wmtupkf3j8uz5y6eeamkmknfgs6rj0hsyt6m8ntpvndvsmz3h3w';
                this.amount = 1000;

                this.explorer = 'http://testnet.yeescan.org/';

                // this.assetFrom = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl';
                // this.assetTo = 'tyee15zphhp8wmtupkf3j8uz5y6eeamkmknfgs6rj0hsyt6m8ntpvndvsmz3h3w';
                // this.assetPrivateKey = 'a8666e483fd6c26dbb6deeec5afae765561ecc94df432f02920fc5d9cd4ae206ead577e5bc11215d4735cee89218e22f2d950a2a4667745ea1b5ea8b26bba5d6';
                // this.assetAmount = 1000;
                //
                // this.assetName = 'test-asset';
                // this.assetIssuer = 'tyee1jfakj2rvqym79lmxcmjkraep6tn296deyspd9mkh467u4xgqt3cqkv6lyl';
                // this.assetIssuerPrvKey = 'a8666e483fd6c26dbb6deeec5afae765561ecc94df432f02920fc5d9cd4ae206ead577e5bc11215d4735cee89218e22f2d950a2a4667745ea1b5ea8b26bba5d6';
                // this.assetDecimals = 9;
                // this.totalSupply = '1234567890';
                //
                // this.assetTransferShard = '5c70';
                // this.queryAssetShard = '5c70';

                runtime.initRuntime();
                window.calls = runtime.calls;
                window.api = api;
                window.runtime = runtime;
            },
            newToAddress() {
                let pair = api.utils.generateSrKeyPair()
                this.toAddress = api.utils.bech32Encode(api.utils.srKeypairToPublic(pair));
            },
            transfer() {
                let that = this;
                that.result = '';
                that.showResult = false;
                that.success = false;

                if (that.fromAddress == '' || that.fromPrivateKey == '' || that.toAddress == '' || that.amount == '') {
                    that.result = 'Please fill all';
                    that.showResult = true;
                    return
                }

                if (that.amount < 1000) {
                    that.result = 'The amount should not be less than 1000';
                    that.showResult = true;
                    return
                }

                let sendShardNum = api.utils.getShardNum(that.fromAddress);
                let destShardNum = api.utils.getShardNum(that.toAddress);
                console.log('sendShardNum', sendShardNum);
                console.log('destShardNum', destShardNum);

                if (!api.utils.isIntNum(that.amount)) {
                    that.result = 'Amount should be a integer';
                    that.showResult = true;
                    return
                }

                let descPublic = api.utils.bech32Decode(that.toAddress);
                let senderPublic = api.utils.bech32Decode(that.fromAddress);
                let secret = hexToBytes(that.fromPrivateKey);
                api.utils.runInBalancesTransferCall(
                    descPublic,
                    that.amount,
                    calls,
                    (call) => {
                        api.utils.composeTransaction(senderPublic, secret, call).then((result) => {
                            that.balanceTransferHash = result.data.result;
                            that.result = 'Transfer successfully';
                            that.showResult = true;
                            that.success = true;
                        }).catch((res) => {
                            that.result = res;
                            that.showResult = true;
                            that.success = false;
                        })
                    }
                )
            },
        },
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