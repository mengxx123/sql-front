<template>
    <my-page class="page-doc" title="数据库文档" :page="page">
        <div class="inline-category-box">
            <div class="index-box">
                <div class="search-box">
                    <input class="input" v-model="keyword" placeholder="输入名称、分类快速搜索工具">
                    <ui-icon-button icon="close" title="清空" @click="keyword = ''" v-if="keyword.length" />
                </div>
                <div class="index-list-box">
                    <div class="empty" v-if="!filtedTables.length">没有搜索结果~</div>
                    <ul class="index-list">
                        <li class="item" v-for="table in filtedTables" :class="{deprecated: table.deprecated}">
                            <a class="link" :href="'#table-' + table.name">
                                {{ table.name }}
                                <span v-if="table.comment">（{{ table.nameZh }}）</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="table-box">
            <ul class="table-list">
                <li class="item" :id="'table-' + table.name" v-for="table, index in tables" :class="{deprecated: table.deprecated}">
                    <table>
                        <tr class="table-name-row">
                            <td class="table-name btn-copy" colspan="5" :data-clipboard-text="table.name" title="点击复制表名">
                                {{ index + 1 }}. {{ table.name }}
                                <span v-if="table.comment">（{{ table.nameZh }}）</span>
                            </td>
                            <td class="op">
                                <a href="#" @click.prevent="showTableTool(table)">查看</a>
                            </td>
                        </tr>
                        <tr v-if="table.simpleComment">
                            <th>注释</th>
                            <td colspan="5">{{ table.simpleComment }}</td>
                        </tr>
                        <tr>
                            <th class="column-name">列名</th>
                            <th class="column-name2">中文名</th>
                            <th class="column-data-type">数据类型</th>
                            <th class="column-null">允许为空</th>
                            <th class="column-default">默认值</th>
                            <th class="column-comment">注释</th>
                        </tr>
                        <tr v-for="row in table.rows" :class="{deprecated: row.deprecated}">
                            <td class="btn-copy" :data-clipboard-text="row.columnName" title="点击复制">
                                <span :class="{deprecated: row.deprecated}">{{ row.columnName }}</span>
                                <!--<ui-badge class="badge" content="主键" v-if="row.primaryKey" />-->
                                <img src="/static/img/key.png" class="pk" v-if="row.primaryKey" title="主键"/>
                                <ui-badge class="badge" content="外键" v-if="row.foreignKey" />
                                <ui-badge class="badge" content="自增" v-if="row.autoIncrement" />
                            </td>
                            <td :class="{deprecated: row.deprecated}">
                                {{ row.columnNameZh }}
                            </td>
                            <td>{{ formatedDataType(row.dataType) }}</td>
                            <td>{{ row.notNull ? '否' : '是' }}</td>
                            <td>{{ defaultValue(row) }}</td>
                            <td>
                                {{ row.simpleComment }}
                                <div v-if="row.values">
                                    取值：
                                    <br>
                                    <ul class="value-list">
                                        <li class="value-item" v-for="value in row.values">
                                            <span class="name">{{ value.name }}</span>：
                                            <span class="description">{{ value.description }}</span>
                                        </li>
                                    </ul>
                                    <!--{{ row.values }}-->
                                </div>
                            </td>
                        </tr>
                    </table>
                </li>
            </ul>
        </div>
        <ui-drawer class="category-box" right :open="open" :docked="true" @close="toggleTableTool()">
            <ui-appbar title="目录">
                <ui-icon-button icon="close" @click="toggle" slot="left" />
            </ui-appbar>
            <div class="body">
                <!-- TODO refactor -->
                <div class="index-box">
                    <div class="search-box">
                        <input class="input" v-model="keyword" placeholder="输入名称、分类快速搜索工具">
                    </div>
                    <div class="index-list-box">
                        <ul class="index-list">
                            <li class="item" v-for="table in filtedTables">
                                <a class="link" :href="'#table-' + table.name">
                                    {{ table.name }}
                                    <span v-if="table.comment">（{{ table.comment }}）</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </ui-drawer>
        <ui-drawer class="table-tool-box" right :open="tableToolVisible" :docked="false" @close="toggleTableTool()">
            <ui-appbar :title="table.name" v-if="table">
                <ui-icon-button icon="close" @click="toggleTableTool" slot="left" />
            </ui-appbar>
            <div>
            </div>
            <div class="body" v-if="table">
                {{ '&#123;&#123;baseurl&#125;' }}{{ '&#125;' }}/{{ table.name }}/add
                <hr>

                <pre>{{ formatedJson }}</pre>
                <hr>

                <li v-for="row in table.rows">
                    $data['{{ row.columnName }}'] = $json->{{ row.columnName }};
                </li>
                <hr>

                <li v-for="row in table.rows">
                    $this->checkParamEmpty('{{ row.columnName }}', $json->{{ row.columnName }});
                </li>
                <hr>

                <div>
                    <ul>
                        <li v-for="row in table.rows">
                            {{ row.columnName }}
                        </li>
                    </ul>
                    <p>
                        <!--{{checkList}}-->
                    </p>
                    <ui-checkbox name="group" nativeValue="checkbox1" v-model="list" label="checkbox1" class="demo-checkbox"/> <br/>
                    <ui-checkbox name="group" nativeValue="checkbox2" v-model="list" label="checkbox2" class="demo-checkbox"/> <br/>
                    <ui-checkbox name="group" nativeValue="checkbox3" v-model="list" label="checkbox3" class="demo-checkbox"/> <br/>
                    <div class="demo-checkbox">
                        你选择的是：{{list}}
                    </div>


                        <label for="all">全选</label>
                </div>

                <!--{{ table }}-->
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    const ClipboardJS = window.ClipboardJS

    export default {
        data () {
            return {
                keyword: '',
                tables: [],
                open: false,
                // 工具
                table: null,
                tableToolVisible: false,
                list: [],
                page: {
                    menu: []
                }
            }
        },
        mounted() {
            let url = this.$route.query.url
            if (url) {
                this.loadUrl(url)
            }
            this.debug()
            window.addEventListener('resize', this.onResize = () => {
                this.resize()
            }, false)
            this.clipboard = new ClipboardJS('.btn-copy')
            this.clipboard.on('success', function (e) {
//                    console.info('Action:', e.action);
//                    console.info('Text:', e.text);
//                    console.info('Trigger:', e.trigger);
                e.clearSelection()
            })
            this.clipboard.on('error', function (e) {
                console.error('Action:', e.action)
                console.error('Trigger:', e.trigger)
            })
        },
        computed: {
            formatedJson() {
                let obj = {}
//                for (let item of this.list) {
//                    if (typeof item === 'string') {
//                        obj[item] = ''
//                    }
//                    if (typeof item === 'number') {
//                        obj[item] = 1
//                    }
//                }
                for (let row of this.table.rows) {
                    if (row.dataType.includes('varchar')) {
                        obj[row.columnName] = '测试'
                    }
                    if (row.dataType.includes('datetime')) {
                        obj[row.columnName] = '2018-4-20 16:37:40'
                    }
                    if (row.dataType.includes('int')) {
                        obj[row.columnName] = 1
                    }
                }
                return JSON.stringify(obj, null, 4)
            },
            filtedTables() {
                if (!this.keyword) {
                    return this.tables
                }
                let arr = []
                for (let table of this.tables) {
                    if (table.name.includes(this.keyword) || table.comment.includes(this.keyword)) {
                        arr.push(table)
                    }
                }
                return arr
            }
        },
        destroyed() {
            this.clipboard.destroy()
            window.removeEventListener('resize', this.onResize)
        },
        methods: {
            showTableTool(table) {
                console.log(table)
                this.table = table
                this.tableToolVisible = true
            },
            toggleTableTool() {
                this.tableToolVisible = !this.tableToolVisible
            },
            resize() {
                if (window.innerWidth < 800) {
                    this.page.menu = [
                        {
                            type: 'icon',
                            icon: 'list',
                            click: this.toggle,
                            title: '目录'
                        }
                    ]
                } else {
                    this.page.menu = []
                }
            },
            debug() {
//                let url = location.origin + '/static/table2.json'
                let url = 'http://localhost:9999/wsdgy/database/1.0.1/table.json'
                url = url + '?time=' + new Date().getTime() // prevent cache
                this.loadUrl(url)
            },
            loadUrl(url) {
                this.$http.get(url).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.tables = data
                        for (let table of this.tables) {
                            table.id = '' + new Date().getTime()
                        }
                        this.table = this.tables[0]
                    },
                    response => {
                        console.log(response)
                    })
            },
            defaultValue(row) {
                if (row.default && row.dataType.indexOf('int') !== -1) {
//                    return row.default
                    return row.default.substring(1, row.default.length - 1) // 去掉引号
                }
                return row.default === '' ? "''" : row.default
            },
            formatedDataType(dataType) {
                return dataType.replace(/,/, ', ')
            },
            toggle() {
                this.open = !this.open
            },
            checkAll() {
            },
            checked(item) {
            }
        },
        watch: {
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/doc";
    .btn-copy {
        cursor: pointer;
    }
    .table-tool-box {
        max-width: 100%;
        width: 800px;
        .body {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 16px;
            overflow: auto;
        }
    }
    .op {
        border-left: none;
    }
</style>
