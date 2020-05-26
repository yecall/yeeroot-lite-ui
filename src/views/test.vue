<template>
    <section>
        <section class="creat center transfer">
            <div class="name">
                Get Block Hash
            </div>
            <div class=" information">
                <p class="title">
                    <span class="innertitle">
                        ShardNum
                    </span>
                </p>
                <input class="input" type="text" v-model="shard" />
            </div>
            <div class=" information">
                <p class="title">
                    <span class="innertitle">
                        Height
                    </span>
                </p>
                <input class="input" type="text" v-model="blockHeight">
            </div>
            <button class="ceratedone" @click="getBlock">Click</button>

            <p class="balance ">
            <pre class="result" v-if="showResult" :class="{success:success}">
                  {{result}}
                </pre>
            </p>
        </section>

        <section class="creat center transfer">
            <div class="name">
                Get Block PowSeal
            </div>
            <div class=" information">
                <p class="title">
                    <span class="innertitle">
                        PowSeal Detail Hex String
                    </span>
                </p>
                <input class="input" type="text" v-model="powSealDetail">
            </div>
            <button class="ceratedone" @click="getPowSeal">Click</button>

            <p class="balance ">
            <pre class="result" v-if="showPowSealResult" :class="{success:powSealSuccess}">
                  {{powSealResult}}
                </pre>
            </p>
        </section>
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
                blockHeight: 0,
                shard: 0,

                showResult: false,
                result: '',
                success: false,

                powSealDetail: '',
                showPowSealResult: false,
                powSealResult: '',
                powSealSuccess: false,
            };
        },
        computed: {},
        created() {
            this.init();
        },
        methods: {
            init() {

                runtime.initRuntime();
                window.calls = runtime.calls;
                window.api = api;
                window.runtime = runtime;
            },
            getBlock() {
                let that = this;
                that.result = '';
                that.showResult = false;
                that.success = false;

                Promise.all([api.rpcCall('chain_getBlockHash', [that.shard, that.blockHeight])]).then(
                    (res) => {
                        let hash = res[0].data.result;
                        Promise.all([api.rpcCall('chain_getBlock', [that.shard, hash])]).then(
                            (res) => {
                                that.result = eval(res[0].data.result);
                            }
                        ).catch(
                            (res) => {
                                console.log('getBlock failed:');
                                console.log(res);
                            }
                        );
                    }
                ).catch(
                    (res) => {
                        console.log('getBlockHash failed:');
                        console.log(res);
                    }
                );
            },
            getPowSeal() {
                let that = this;
                that.powSealResult = '';
                that.showPowSealResult = false;
                that.powSealSuccess = false;
                let str = that.powSealDetail;
                let seal = api.utils.decodePowSeal(str);
                let diff = Math.pow(2, 256) / parseInt(seal.pow_target);
                console.log(diff);
                that.powSealResult = JSON.stringify(seal);
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